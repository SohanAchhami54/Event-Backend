const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;
const { Schema, Types } = mongoose;
const bookingSchema=mongoose.Schema({
    bike:{
        type:ObjectId,ref:'Bike',required:true //for storing the unique id of the docuements
    },
    user:{
        type:ObjectId,ref:'User',required:true
    },
    owner:{
        type:ObjectId,ref:'User',required:true
    },
    pickupDate:{
        type:Date,
        required:true
    },
    returnDate:{
        type:Date,
        required:true,
    },
     priorityScore:{
        type:Number,
        required:true
    },
    paymentAllowed:{
        type:Boolean,
        default:false
    },
    status:{
          type:String, 
          enum:['pending','confirmed','cancelled'],
          default:'pending'   //by default the status is pending.
    },
    price:{
        type:Number,
        required:true,
    },
    payment: {
    pricestatus: { type: String, default: "unpaid" }, // unpaid / paid / failed
    transactionCode: { type: String },
    method: { type: String, default: "eSewa" }, // online / esewa
  }

  
},{timestamps:true});
bookingSchema.index({returnDate:1},{ expireAfterSeconds:0});
module.exports=mongoose.model('Booking',bookingSchema);
