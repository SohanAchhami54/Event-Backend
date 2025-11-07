const express=require('express');
const guestbookingRouter=express.Router();
const middleware =require('../middleware/auth')
const usercontroller=require('../controller/usercontroller');
guestbookingRouter.get('/user',middleware.protect,usercontroller.getUserBookings);
//guestbookingRouter.post('/payment',middleware.protect,usercontroller.makepayment);
guestbookingRouter.post('/payment-success',middleware.protect,usercontroller.paymentsuccess);
module.exports={
    guestbookingRouter:guestbookingRouter,
}