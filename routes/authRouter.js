const express=require('express');
const authcontroller=require('../controller/authcontroller');
const middleware = require('../middleware/auth');
const authRouter=express.Router(); //also called the userRouter in yt.

authRouter.post('/signup',authcontroller.PostSignUp);

authRouter.post('/login',authcontroller.postloginuser);

authRouter.get('/data',middleware.protect,authcontroller.getUserData);

authRouter.get('/bikes',authcontroller.getBikes);
module.exports=authRouter;