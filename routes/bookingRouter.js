const express=require('express');
const bookingRouter=express.Router();
//this is from the changeBookingStatus. 
const bookcontroller=require('../controller/bookingcontroller');
const middleware = require('../middleware/auth');

// bookingRouter.post('/check-availability',bookcontroller.checkAvailability);
// bookingRouter.post('/check-availability',bookcontroller.checkAvailbilityOfBike);

bookingRouter.post('/create',middleware.protect,bookcontroller.createBooking);
//to get the user's own booking
// bookingRouter.get('/user',middleware.protect,bookcontroller.getUserBookings);
bookingRouter.get('/owner',middleware.protect,bookcontroller.getOwnerBookings);

bookingRouter.post('/change-status',middleware.protect,bookcontroller.changeBookingStatus);
bookingRouter.post('/allowpayment',middleware.protect,bookcontroller.allowpayment);

module.exports={
    bookingRouter:bookingRouter,
}
