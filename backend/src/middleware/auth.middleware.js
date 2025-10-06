const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model")

async function authMiddleware(req,res,next){
    const token =req.cookies.token;
    if(!token){return res.status(401).json({
        success: false,
        message:"unauthorized access"
    })}
    try{const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id).select("-password -__v");
        if(!user){return res.status(401).json({
            success:false,
            message: "unauthorized access - user not found"
        })}
        req.user = user
        next()
    }
    catch(err){return res.status(401).json({
        success: false,
        message:"unauthorized access"
    })}
}

module.exports = authMiddleware;