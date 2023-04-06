const jwt = require("jsonwebtoken")
const config = require("../config/config")

exports.adminauth=(req,res,next)=>{
    if(req.cookies && req.cookies.admintoken){
        jwt.verify(req.cookies.admintoken,config.security_key,(err,data)=>{
            if(!err){
                req.admin=data
                next()
            }else{
                next()
            }
        })
    }else{
        next()
    }
}