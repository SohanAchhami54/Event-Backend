const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types;

const payment=new mongoose.Schema({
    booking:{type:ObjectId,ref:"Booking",required:true},
    user:{type:ObjectId,ref:"User",required:true},
    amount:{type:Number,required:true},
    status:{type:String,enum:["paid","unpaid","failed"],default:"unpaid"},
    transactionCode:{type:String},
    method:{type:String,default:"eSewa"},    
},{timestamps:true});

module.exports=mongoose.model("payment",payment);