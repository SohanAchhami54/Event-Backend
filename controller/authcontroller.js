    //this function gets executed whenever the user request the user registration routes.
    //const { validationResult, check } = require("express-validator");
    const jwt=require('jsonwebtoken');
    const bcrypt=require('bcrypt');
    const User = require('../models/User');
    const Bike=require('../models/bike');
    //generate jwt token.
    const generateToken=(userId)=>{
        const payload=userId;
        return jwt.sign(payload,process.env.JWT_SECRET);  //to generate the secret key.
    }   
    //user signup or register.
    exports.PostSignUp = async (req, res) => {
        try {
            const { firstname, lastname, usertype,address, email, password } = req.body;//req.body ma chai yesko input value haru aauxa.
            if (!firstname ||!lastname || !usertype || !address|| !email || password.length < 8) {
                return res.json({ success: false, message: 'Fill all the field' });
            }

          // email=email.toLowerCase().trim();
            const userExists = await User.findOne({ email })
            if (userExists) {
                return res.json({ success: false, message: 'User already exists' });
            }

            const hashedpassword =await bcrypt.hash(password, 12);
            const user=new User({firstname,lastname,usertype,address,email,password:hashedpassword});
            await user.save();
            res.json({success:true});
            //jwt token
            //aafai generate gardinxa
            // const token=generateToken(user._id.toString()); //send the token to the frontend
            // res.json({success:true,token});
           

        } catch (err) {
            console.log('Error was occured:',err.message);
            res.json({success:false,message:err.message});   
        }
    }




    //user login
    exports.postloginuser=async(req,res)=>{
        try{
            const {email,password}=req.body;
            const user=await User.findOne({email});
            //if no user is found.
            if(!user){
                return res.json({success:false,message:'User not found'});
            }
            const isMatch=await bcrypt.compare(password,user.password);
            //when the password is not match.s
            if(!isMatch){
            return res.json({success:false,message:'Invalid Credentials'});
            }
            //generate the jwt token for us.
            const token=generateToken(user._id.toString()); //send the token to the frontend
            res.json({success:true,token});

        }catch(err){
            console.log('Error was occured:',err.message);
            res.json({success:false,message:err.message});  
        } 

    }


    //function to get the user data using jwt token
    exports.getUserData=async(req,res)=>{
        try {
           
            const {user}=req;
             console.log('request',req);
            console.log('data of the user is:', user);
            res.json({success:true,user})
        } catch (error) {   
            console.log(error.message);
            res.json({success:false,message:error.message});
        }
    }


//get all bikes for the frontend
exports.getBikes=async(req,res)=>{
    try {
        const bikes=await Bike.find({isAvailable:true});
        console.log('Fetched bikes from Db:',bikes);
        res.json({success:true,bikes});
    } catch (error) {
         console.log(error.message);
            res.json({success:false,message:error.message});
    }
}
