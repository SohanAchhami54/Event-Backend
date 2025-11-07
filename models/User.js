const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    firstname:{
        type:String,
        required:[true,'Fullname is requires']
    },
    lastname:{
        type:String,
        required:[true,'Lastname is requires']
    },
    usertype:{
        type:String,
        enum:['guest','host'],
        default:'guest',
    },
    address:{
        type:String,
        required:[true,'Email is required'],
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    image:{
        type:String,
        default:'',
    }
},{timestamps:true});
//it will create the created at and updated at figure.
module.exports=mongoose.model('User',userSchema);