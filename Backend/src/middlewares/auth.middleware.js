const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');   



function authUSer(req,res,next){
    const token = req.cookies.token;


    if(!token){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }
const isBlacklisted = tokenBlacklistModel.findOne({token})
if(isBlacklisted){
    return res.status(401).json({   
        message : "token is blacklisted"
    })
}
   const decoded =  jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    if(err){
        return res.status(401).json({
            message : "Unauthorized"
        })
    }
    req.user = decoded;
    next();
        })
    }
module.exports = { authUSer }