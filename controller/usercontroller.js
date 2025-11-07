const Booking=require('../models/booking');
const purchasedBikes=require('../models/purchasedbikes');
const payment=require('../models/payment');
require('dotenv').config();
const CryptoJS=require('crypto-js');
const {v4:uuidv4}=require('uuid');
const {sendMail}=require('../utils/mailer')
// exports.getUserBookings=async(req,res)=>{
//     try {
//         console.log('userbookings',req.user);
//       const {_id}=req.user;//yo owner ko id ho
//       const bookings=await Booking.find({user:_id}).populate('bike').sort({createdAt:-1});
//         res.json({success:true,bookings});
//     } catch (error) {   
//         console.log(error.message);
//          res.json({success:false,message:error.message});
//     }
// }

// exports.makepayment = async (req, res) => {
//   try {
//       //const { _id } = req.user;
//      const {bookingId}=req.body;
//   //  const {bookingId}=req.params;

//      const booking = await Booking.findById({_id: bookingId }).populate("bike");
//     //const booking=await Booking.findById(bookingId).populate('bike');

//     if (!booking) {
//       return res.json({ success: false, message: "Booking not found" });
//     }

//     const total_amount = booking.price.toFixed(2); // string with 2 decimals
//     const uid = uuidv4(); //Ensures each payment has a unique identifier.

//     // Only fields listed here are used for signature
//     const signedFields = "total_amount,transaction_uuid,product_code";

//     // Create signature string
//     const message = `total_amount=${total_amount},transaction_uuid=${uid},product_code=EPAYTEST`;

//     // Generate HMAC-SHA256 signature in Base64
//     const hash = CryptoJS.HmacSHA256(message, process.env.ESEWASECRET);
//     const signature = CryptoJS.enc.Base64.stringify(hash);

//     res.json({
//       success: true,
//       paymentData: {
//         amount: total_amount, // required by eSewa
//         tax_amount: "0",
//         total_amount: total_amount,
//         transaction_uuid: uid,
//         product_code: "EPAYTEST",
//         product_service_charge: "0",
//         product_delivery_charge: "0",
//         success_url: `${process.env.FRONTEND_URL}/success`,
//         failure_url: `${process.env.FRONTEND_URL}/failure`,
//         // success_url: `${process.env.FRONTEND_URL}/success`,
//         // failure_url: `${process.env.FRONTEND_URL}/failure`,
//         signed_field_names: signedFields,
//         signature: signature,
//       },
//     });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };


// exports.paymentsuccess=async(req,res)=>{
//    try{
//      const {bookingId,transactionCode,total_amount,pricestatus}=req.body;
//      console.log("bookingid is",bookingId);
//      const booking= await Booking.findById(bookingId);
//      if(!booking) return res.json({success:false,message:"booking not found"})
     
//      if(pricestatus?.toLowerCase()==="completed" || pricestatus?.toLowerCase()==="success"){
//       booking.payment.pricestatus="paid"
//       booking.payment.transactionCode=transactionCode;
//       // booking.payment.amount=total_amount;
//      }
//       await booking.save();
//       res.json({success:true, message:"Payment recorded"}) 
//    }catch(error){
//     res.json({success:false,message:error.message});
//    }
// };

// exports.paymentsuccess = async (req, res) => {
//   try {
//     const { bookingId, transactionCode, total_amount, status } = req.body;
//     console.log("bookingId:", bookingId, "status:", status);

//     const booking = await Booking.findById(bookingId);
//     if (!booking) return res.json({ success: false, message: "booking not found" });

//     const normalized = status?.toLowerCase();
//     if (normalized === "completed" || normalized === "complete" || normalized === "success") {
//       booking.payment.pricestatus = "paid"; //  update DB
//       booking.status="confirmed";
//       booking.payment.transactionCode = transactionCode;
   
//     } else {
//       booking.payment.pricestatus = "failed";
//     }

//     await booking.save();
//     res.json({ success: true, message: "Payment recorded", booking });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };


exports.paymentsuccess = async (req, res) => {
  try {
    const { bookingId, transactionCode, total_amount, status } = req.body;
    console.log("bookingId:", bookingId, "status:", status);

    const booking = await Booking.findById(bookingId).populate('user').populate('bike').populate('owner');
    if (!booking) return res.json({ success: false, message: "booking not found" });

    const normalized = status?.toLowerCase();
    if (normalized === "completed" || normalized === "complete" || normalized === "success") {
      booking.payment.pricestatus = "paid"; //  update DB
      booking.status="confirmed";
      booking.payment.transactionCode = transactionCode;
 

      //for creating the purchased bike in the database.
      await purchasedBikes.create({
        booking:booking._id,
        bike:booking.bike._id,
        user:booking.user._id,
        owner:booking.owner._id,
        price:booking.price,
        pickupDate:booking.pickupDate,
        returnDate:booking.returnDate,
      });

      //for creating the payment information in the database
      await payment.create({
        booking:booking._id,
        user:booking.user._id,
        amount:total_amount,
        status:"paid",
        transactionCode,
        method:"eSewa",
      });

      const emailContent = `
        <h2>Payment Successful</h2>
        <p>Hello ${booking.user.firstname}${booking.user.lastname},</p>
        <p>Thank you for booking with us. Here are your details:</p>
        <ul>
          <li><b>Bike:</b> ${booking.bike.model}</li>
          <li><b>Price:</b> NPR ${booking.price}</li>
          <li><b>Image:</b> ${booking.bike.image}</li>
          <li><b>Pickup Date:</b> ${new Date(booking.pickupDate).toDateString()}</li>
          <li><b>Return Date:</b> ${new Date(booking.returnDate).toDateString()}</li>
          <li><b>Transaction Code:</b> ${transactionCode}</li>
          <li><b>Status:</b> ${status} </li>
        </ul>
        <p>Ride safe!</p>
      `;

      await sendMail(booking.user.email, "Bike Booking Payment Success", emailContent);
    } else {
      booking.payment.pricestatus = "failed";
      await payment.create({
        booking:booking._id,
        user:booking.user._id,
        amount:total_amount,
        status:"failed",
        transactionCode,
        method:"esewa",
      })
      
    }

    await booking.save();
    res.json({ success: true, message: "Payment recorded", booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



exports.getUserBookings=async(req,res)=>{
    try {
        console.log('userbookings',req.user);
      const {_id}=req.user;//yo owner ko id ho
    
      //to delete the bike if the time expired.
    await Booking.deleteMany({user:_id,returnDate:{$lt:new Date()}});

    const bookings=await Booking.find({user:_id})
    .populate('bike')
    .sort({createdAt:-1});
        
const availableBookings = bookings.filter(b => b.bike && b.bike.isAvailable
  && new Date(b.returnDate)>new Date()
);

res.json({ success: true, bookings: availableBookings });
    } catch (error) {   
        console.log(error.message);
         res.json({success:false,message:error.message});
    }
}
