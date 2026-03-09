const jwt = require('jsonwebtoken');

const generateToken = (userId, companyId = null) => {
    return jwt.sign(
        {
            id: userId,
            company: companyId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        }
    );
};

module.exports = generateToken;
