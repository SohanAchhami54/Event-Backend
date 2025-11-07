const express=require('express');
const ownerRouter=express.Router();
const middleware = require('../middleware/auth');
const ownerController= require('../controller/ownercontroller');
const {upload } = require('../middleware/multer');

//ownerRouter.post('/change-role',middleware.protect,ownerController.changeRoletoOwner);
ownerRouter.post('/addbike',upload.single('image'),middleware.protect,ownerController.postAddBike);
ownerRouter.get('/bikes',middleware.protect,ownerController.getOwnerBikes)
ownerRouter.post('/toggle-bike',middleware.protect,ownerController.toggleBikeAvailability)
ownerRouter.post('/delete-bike',middleware.protect,ownerController.deletebike)
ownerRouter.get('/dashboard',middleware.protect,ownerController.getDashboardData);
ownerRouter.post('/updateimage',middleware.protect,upload.single('image'), ownerController.updateHostImage)
module.exports={
    ownerRouter:ownerRouter,
}