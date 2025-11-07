//function to check the availability of the bike for a given date
const Bike = require('../models/bike');
const Booking=require('../models/booking');
const ownerRouter = require('../routes/ownerRouter');

// exports.checkAvailability=async(bike,pickupDate,returnDate)=>{
//     const bookings=await Booking.find({
//         bike,
//         pickupDate:{$lte:returnDate},
//         returnDate:{$gte:pickupDate},
//     })
//     return bookings.length===0;
// }


// //for the home page data
// //api to check the availability of bike for the given date and location 
// exports.checkAvailbilityOfBike=async(req,res)=>{
//     try {
//        const {location,pickupDate,returnDate}=req.body;
//        //fetch all the available bike for the given location
//        const bikes=await Bike.find({location,isAvailable:true});

//        //check bike availability for the given date range using promise
//        const availableBikePromises=bikes.map(async(bike)=>{
//          const isAvailable= await checkAvailability(bike._id,pickupDate,returnDate);
//          return {...bike._doc,isAvailable:isAvailable}
//        })

//        let availableBike=await Promise.all(availableBikePromises);
//        availableBike=availableBike.filter(bike=>bike.isAvailable===true);
//        res.json({success:true,availableBike});


//     } catch (error) {
//         console.log(error.message);
//         res.json({success:false,message:error.message});
//     }

// }


// Helper function to calculate booking priority
//Greedy based Priority Algorithm
function calculatePriority(pickupDate, returnDate, bookingDate) {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  const booking = new Date(bookingDate);

  // Duration of booking in days
  const durationInDays = (returnD - pickup) / (1000 * 60 * 60 * 24);

  // Urgency (gap between booking and pickup)
  const urgencyInDays = (pickup - booking) / (1000 * 60 * 60 * 24);

  // Scoring logic
  const urgencyScore = Math.max(0, 10 - urgencyInDays);
  const durationScore = Math.min(durationInDays, 10);

  // Weighted final score
  return (2 * urgencyScore) + durationScore;
}

//for booking the bike
exports.createBooking = async (req, res) => {
  try {
    const { _id } = req.user; // Logged-in user
    const { bikeId, pickupDate, returnDate } = req.body;

    console.log('req.user:', req.user);
    console.log('req.body:', req.body);

    // Fetch bike details
    const bikeData = await Bike.findById(bikeId);
    if (!bikeData) {
      return res.json({ success: false, message: 'Bike not found' });
    }

    // Calculate booking duration in days
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noofdays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = bikeData.pricePerDay * noofdays;

    // Calculate priority score (using today's date as bookingDate)
    const bookingDate = new Date();
    const priorityScore =Math.floor(calculatePriority(pickupDate, returnDate, bookingDate));

    // Save booking with priority
    await Booking.create({
      bike: bikeId,
      owner: bikeData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
      priorityScore, // new field added
    });

    res.json({
      success: true,
      message: 'Booking created successfully',
      priorityScore,
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


//api to list the user bookings
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



//yo chai dashboard ko data ho.
//api to get the  owner bookings
    exports.getOwnerBookings=async(req,res)=>{
        console.log(req.user);
        try {
        if(req.user.usertype!=='host'){
            return res.json({success:false,message:'Unauthorized'});
        }
        const bookings=await Booking.find({owner:req.user._id}).populate('bike user').select('-user.password').sort({createdAt:-1});
        res.json({success:true,bookings});
        } catch (error) {
            res.json({success:false,message:error.message});
        }
    }   


    //for confirmed and cancelled the bookings
    exports.changeBookingStatus=async(req,res)=>{
        try {
            const {_id}=req.user;
            const {bookingId,status}=req.body;
            const booking=await Booking.findById(bookingId);
          
            
            if(booking.owner.toString()!==_id.toString()){
                return res.json({success:false,message:'Unauthorized'});  
            }
            //if the payment is not done yet.
            if(booking.payment.pricestatus==="unpaid" && status==="confirmed"){
                return res.json({success:false, message:'Payment has not been done yet'});
            }


            //the payment has already been done and host cannot change the status
            if(booking.payment.pricestatus==="paid"){
                return res.json({success:false, message:'Payment has already been done. Status cannot be changed.'})
            }
           
            booking.status=status;  
            await booking.save()
            res.json({success:true,message:'Status Updated'});
        } catch (error) {
            console.log(error.message);
            res.json({success:false,message:error.message});
        }
    }


exports.allowpayment = async (req, res) => {
  try {
    const { bookingId, payallow } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentAllowed: payallow }, // ✅ Consistent naming
      { new: true }
    );
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }
    res.json({
      success: true,
      message: payallow ? "Payment enabled for user" : "Payment disabled",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};