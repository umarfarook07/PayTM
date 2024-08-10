const express = require('express');
const { authMiddleware } = require('../middlewares/middlewares');
const { User, Account } = require('../db/db');
const router = express.Router();
const zod = require('zod');
const { default: mongoose } = require('mongoose');

const transferSchema = zod.object({
    to: zod.string(),
    amount: zod.number().positive().min(1)
})
router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const account = await Account.findOne({ userId });
        res.status(200).json({
            AccountBalance: account.amount,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});
router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const payLoad = req.body;
        const parsedPayLoad = transferSchema.safeParse(payLoad);
        if (!parsedPayLoad.success) {
            await session.abortTransaction();
            return res.status(403).json({
                msg: 'Invalid inputs / amount'
            });
        }
        const account = await Account.findOne({ userId: req.userId }).session(session);
        const senderName = await User.findOne({ _id: req.userId });
        if (!account || account.amount < payLoad.amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }
        
        const toAccount = await Account.findOne({ userId: payLoad.to }).session(session);
        const ReceviverName = await User.findOne({ _id: payLoad.to });
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid Account"
            });
        }
        
        const updateSender = await Account.updateOne(
            { userId: req.userId },
            { $inc: { amount: -payLoad.amount } }
        ).session(session);

        const updateReceiver = await Account.updateOne(
            { userId: payLoad.to },
            { $inc: { amount: payLoad.amount } }
        ).session(session);

        await session.commitTransaction();

        res.status(200).json({
            receviver:ReceviverName.username,
            sender:senderName.username,
            BalanceAtSender:account.amount,
        });
    } catch (error) {
        await session.abortTransaction();
        console.log('Error during transaction:', error); 
        res.status(500).json({ error });
    } finally {
        session.endSession();
    }
});

module.exports = router;
