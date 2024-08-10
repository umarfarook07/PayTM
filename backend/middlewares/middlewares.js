const { JWT_KEY } = require('../config.js');
const jwt = require('jsonwebtoken');
async function authMiddleware(req, res, next) {
    const jwt_token = req.headers.authorization;
    // console.log(jwt_token);
    if (!jwt_token || !jwt_token.startsWith('Bearer ')) {
        return res.status(403).json({
            msg: 'you are not authorized'
        });
    }
    const token = jwt_token.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_KEY);
        req.userId = decoded.userId;
        // console.log(decoded);
        next();
    } catch (error) {
        return res.status(403).json({error});
    }
}

module.exports = {
    authMiddleware
}