const jwt = require('jsonwebtoken')

const extractToken = (req, res, next) =>{
    const token = req.headers.authorization?.split('')[1];

    if(token)
    {
        try{
            const decode = jwt.verify(token, '12345abcde');

            req.user = decoded.user;
        }
        catch(err){
            return res.status(401).json({message:'Invalid token'})
        }
    }

    next();
}

module.exports = extractToken;