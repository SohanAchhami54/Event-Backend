// this is the authentication middleware
const User = require('../models/User');
const jwt=require('jsonwebtoken');
exports.protect=async(req,res,next)=>{
    //console.log(req.headers);//authorization key aauxa. extra key haru aauxa.
   const token=req.headers.authorization;
   if(!token){
    return res.json({success:false,message:'Not authorized'});
   }
   try {//we will get the userid from the token
     const userId=jwt.decode(token,process.env.JWT_SECRET); 
    //  console.log('Decoded token:', decoded);
    //   const userId=decoded?.id;
     if(!userId){
        return res.json({success:false,message:'Not authorized'});
     }
     req.user=await User.findById(userId).select('-password');
     next();
   } catch (error) {
        return res.json({success:false,message:'Not authorized'});
   }
}


