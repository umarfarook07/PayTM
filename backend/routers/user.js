const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config');
const router = Router();
const { User, Account } = require('../db/db');
const bcrypt = require('bcrypt');
const zod = require('zod');
const { authMiddleware } = require('../middlewares/middlewares');

const signupSchema = zod.object({
    username: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
})
const signinSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
});
const userUpdateSchema = zod.object({
    username: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional(),
})
router.post('/signup', async (req, res) => {
    try {
        const payLoad = req.body;
        const parsedPayLoad = signupSchema.safeParse(payLoad);

        if (!parsedPayLoad.success) {
            return res.status(400).json({
                error: parsedPayLoad.error.format()
            });
        }

        const isUserExist = await User.findOne({ username: payLoad.username });
        if (isUserExist) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(payLoad.password, 8);
        parsedPayLoad.data.password = hashedPassword;
        const user = new User(parsedPayLoad.data);
        await user.save();

        const account = new Account({
            userId: user._id,
            amount: parseInt((Math.random() * 1000))
        });
        await account.save();
        const token = jwt.sign({ userId: user._id }, JWT_KEY);
        const jwt_token = `Bearer ${token}`;

        res.status(200).json({
            msg: 'User Created Sucuessfully',
            AccountBalance:account.amount,
            jwt_token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const payLoad = req.body;
        const parsedPayLoad = signinSchema.safeParse(payLoad);

        if (!parsedPayLoad.success) {
            return res.status(400).json({
                error: parsedPayLoad.error.format()
            });
        }
        const isUserExist = await User.findOne({ username: payLoad.username });
        if (!isUserExist) {
            return res.status(400).json({
                error: 'User Not exists',
                username: payLoad.username
            });
        }
        // console.log(isUserExist);
        const passwordMatched = await bcrypt.compare(payLoad.password, isUserExist.password);
        // console.log(passwordMatched);
        if (!passwordMatched) {
            return res.status(400).json({
                error: 'Incorrect password'
            });
        }
        const token = jwt.sign({ userId: isUserExist._id }, JWT_KEY);
        const jwt_token = `Bearer ${token}`;
        res.status(200).json({
            msg: `Welcome Back ${payLoad.username}`,
            jwt_token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
router.put('/', authMiddleware, async (req, res) => {
    const payLoad = req.body;
    const parsedPayLoad = userUpdateSchema.safeParse(payLoad);
    if (!parsedPayLoad.success) {
        return res.status(400).json({
            error: parsedPayLoad.error.format()
        });
    }
    const { userId } = req;
    const updatedUser = await User.updateOne(
        { _id: userId },
        { $set: payLoad }
    );

    if (updatedUser.nModified === 0) {
        return res.status(404).json({ msg: 'User not found or no changes made' });
    }
    res.status(200).json({
        msg: 'Updated user sucuessfully',
        updatedUser
    });
})
router.get('/bulk', async (req, res) => {
    const searchString = req.query.searchString || '';
    const regex = new RegExp(searchString, 'i');

    try {
        const filteredUsers = await User.find({
            $or: [
                { firstName: { $regex: regex } },
                { lastName: { $regex: regex } }
            ]
        });

        res.status(200).json({
            user: filteredUsers.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user._id
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
