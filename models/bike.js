const mongoose=require('mongoose');
const { Schema, Types } = mongoose;
const bikeSchema=mongoose.Schema({
     owner:{ type:Types.ObjectId,ref:'User', },
     brand:{type:String,required:true },
     model:{ type:String,required:true,},
     image:{type:String,  required:true,},
     year:{ type:String,  required:true,},
     category:{ type:String, required:true,},
     fuel_type:{ type:String,required:true },
     transmission:{type:String, required:true, },
     pricePerDay:{  type:Number, required:true,},
     location:{ type:String,required:true, },
     description:{ type:String,required:true},
     isAvailable:{type:Boolean, default:true}
},{timestamps:true});
module.exports=mongoose.model('Bike',bikeSchema);
