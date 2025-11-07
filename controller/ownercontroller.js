const User=require('../models/User');
const imagekit=require('../config/imagekit');
const Bike=require('../models/bike');
const Booking=require('../models/booking');
const fs=require('fs');
//api to change the role
// exports.changeRoletoOwner=async(req,res)=>{  //this is changeroletoowner.
//    try {
//      const {_id}=req.user;
//      await User.findByIdAndUpdate(_id,{usertype:'host'});
//      res.json({success:true,message:'Now u can list the bike.'})
//    } catch (error) {
//        console.log(error.message);
//        res.json({success:false,message:error.message});
//    }
// }   


//api to list the bike
exports.postAddBike=async(req,res)=>{   
  try {
     const{_id}=req.user; //kun host ley upload gareko ho tyo hunxa.
     console.log(req);
     let bikeData=JSON.parse(req.body.bikeData);
     const imageFile=req.file; //to store the image.
     console.log(imageFile)
     //it will provide the file buffer and we uploadinimagekit
    const fileBuffer= fs.readFileSync(imageFile.path);//to read the image.
    const response= await imagekit.upload({
        file:fileBuffer, //path of the image
        fileName:imageFile.originalname, //to store the original name in the imageKit
        folder:'/bikes'  //to save the image inside the bike folder in imagekit
    });

    // optimization through imageKit URL transformation.
 var optimizedImageUrl = imagekit.url({
    // The path is the location of the uploaded image inside ImageKit's file system, excluding the domain (base URL). 
    path : response.filePath, //response will be: bikes/pulsar-ns200.jpg
    transformation :[
        {width:'1280'}, //width resizings
        {quality:'auto'}, //auto compression
        {format:'webp'}//covert to modern format
    ]
});

const image=optimizedImageUrl;
await Bike.create({...bikeData,owner:_id,image});//save the bike in the database. including owner id.
res.json({success:true,message:'bike added'});

     //w    e have to store the image in the cloud and f
     //for that we have to use the imagekit.


  } catch (error) {
       console.log(error.message);
       res.json({success:false,message:error.message});
  }
}
//image ko response aauxa 
// {
//   fileId: "abc123",
//   name: "bike.jpg",
//   url: "https://ik.imagekit.io/yourid/bikes/bike.jpg",
//   filePath: "/bikes/bike.jpg",
//   ...
// }

// req = {
//   method: "POST",
//   url: "/api/owner/addbike",
//   baseUrl: "/api/owner",
//   originalUrl: "/api/owner/addbike",
//   path: "/addbike",
//   params: {},
//   query: {},
//   headers: {
//     host: "localhost:5000",
//     connection: "keep-alive",
//     "content-length": "324576",
//     "accept": "application/json",
//     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
//     "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryabcd1234",
//     authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
//   },
//   body: {
//     bikeData: `{
//       "brand": "Pulsar",
//       "model": "NS200",
//       "year": 2022,
//       "pricePerDay": 1200,
//       "category": "sport",
//       "transmission": "manual",
//       "fuel_type": "petrol",
//    
//       "location": "Kathmandu",
//       "description": "Well maintained, great for rides."
//     }`
//   },
//   file: {
//     fieldname: 'image',
//     originalname: 'pulsar-ns200.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     destination: 'uploads/',
//     filename: '1689348273478-pulsar-ns200.jpg',
//     path: 'uploads/1689348273478-pulsar-ns200.jpg',
//     size: 152384  // bytes
//   },
//   user: {
//     _id: "6877143ef7aa1ebbde9a205d",
//     firstname: "Sohan",
//     lastname: "Mijar",
//     email: "sohanachhami55@gmail.com",
//     usertype: "host",
//     image: "",
//     createdAt: "2025-07-16T02:53:50.771Z",
//     updatedAt: "2025-07-16T02:53:50.771Z",
//     __v: 0
//   },
//   protocol: "http",
//   secure: false,
//   ip: "::1",
//   cookies: {},
//   signedCookies: {},
//   hostname: "localhost",
//   xhr: false,
//   app: {
//     // internal express app reference
//   },
//   res: {
//     // internal response object reference
//   },
//   route: {
//     path: "/addbike",
//     stack: [/* middlewares and controller */],
//     methods: { post: true }
//   }
// }


//api to list all the owner bike
exports.getOwnerBikes=async(req,res)=>{
    try{
       const {_id}=req.user;//kun  user ho vanerw find garna ko lagi ho yo chai.
       const bikes=await Bike.find({owner:_id});
       res.json({success:true,bikes});

    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});

    }
}

//api to toggle bike availability.
exports.toggleBikeAvailability=async(req,res)=>{
    try {
        const {_id}=req.user;
        const {bikeId}=req.body;
        const bike=await Bike.findById(bikeId);
       
        if(bike.owner.toString()!==_id.toString()){
            return res.json({success:false,message:"Unauthorized"});
        }
        bike.isAvailable=!bike.isAvailable;
        await bike.save();
        res.json({success:true,message:'Bike Availability Updated'});
        } catch (error) {
            console.log(error.message);
            res.json({success:false,message:error.message});
    }
}


//api to delete the bike
exports.deletebike=async(req,res)=>{
    try {
        const {_id}=req.user;
        const {bikeId}=req.body;
        const bike=await Bike.findById(bikeId);
       
        if(bike.owner.toString()!==_id.toString()){
            return res.json({success:false,message:"Unauthorized"});//kei karan bas milena vaney chai.
        }
         await Bike.findByIdAndDelete(bikeId);
        //   bike.owner=null;
        //   bike.isAvailable=false;
        //   await bike.save();
          res.json({success:true,message:'Bike removed'});
        } catch (error) {
            console.log(error.message);
            res.json({success:false,message:error.message});//if server error
    }
}


//api to get the dashboard data

exports.getDashboardData=async(req,res)=>{
    try {
        const {_id,usertype}=req.user; 
        // if(usertype!=='host'){
        //     return res.json({success:false,message:'Unauthorized'});
        // }
         
        const bike=await Bike.find({owner:_id});//owner ko bike
        const booking=await Booking.find({owner:_id}).populate('bike').sort({createdAt:-1});//ownerkobooking

        const pendingbooking=await Booking.find({owner:_id,status:'pending'});
        const completebooking=await Booking.find({owner:_id,status:'confirmed'});


        //calculate monthly revenue from booking where status is confirmed
      const monthlyRevenue=booking.filter(booking=>booking.status==='confirmed').reduce((acc,booking)=>{
        return acc+booking.price
        },0);
        const dashboardData={
            totalbikes:bike.length,
            totalbooking:booking.length,
            pendingbooking:pendingbooking.length,
            completebooking:completebooking.length,
            recentbooking:booking.slice(0,3),
            monthlyRevenue,
        }

        res.json({success:true,dashboardData});

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}


//api to update the user image
exports.updateHostImage=async(req,res)=>{
    try {
         const {_id}=req.user;
          const imageFile=req.file; //to store the image.
     //it will provide the file buffer and we uploadinimagekit
    const fileBuffer= fs.readFileSync(imageFile.path);
    const response= await imagekit.upload({
        file:fileBuffer,
        fileName:imageFile.originalname,
         folder:'/hosts'
    });

    // optimization through imageKit URL transformation.
  var optimizedImageUrl = imagekit.url({
    path : response.filePath,
    transformation :[
        {width:'400'}, //width resizings
        {quality:'auto'}, //auto compression
        {format:'webp'}//covert to modern format
    ]
});
 const image=optimizedImageUrl;
 await User.findByIdAndUpdate(_id,{image});
 res.json({success:true,message:'Image updated'});

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}
//image ko response aauxa 
// {
//   fileId: "abc123",
//   name: "bike.jpg",
//   url: "https://ik.imagekit.io/yourid/bikes/bike.jpg",
//   filePath: "/bikes/bike.jpg",
//   ...
// }


//  body: {
//     bikeData: `{
//       "brand": "Pulsar",
//       "model": "NS200",
//       "year": 2022,
//       "pricePerDay": 1200,
//       "category": "sport",
//       "transmission": "manual",
//       "fuel_type": "petrol",
//    
//       "location": "Kathmandu",
//       "description": "Well maintained, great for rides."
//     }`
//   },
//   file: {
//     fieldname: 'image',
//     originalname: 'pulsar-ns200.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     destination: 'uploads/',
//     filename: '1689348273478-pulsar-ns200.jpg',
//     path: 'uploads/1689348273478-pulsar-ns200.jpg',
//     size: 152384  // bytes
//   },
//   user: {
//     _id: "6877143ef7aa1ebbde9a205d",
//     firstname: "Sohan",
//     lastname: "Mijar",
//     email: "sohanachhami55@gmail.com",
//     usertype: "host",
//     image: "",
//     createdAt: "2025-07-16T02:53:50.771Z",
//     updatedAt: "2025-07-16T02:53:50.771Z",
//     __v: 0
//   },
//   protocol: "http",
//   secure: false,
//   ip: "::1",
//   cookies: {},
//   signedCookies: {},
//   hostname: "localhost",
//   xhr: false,
//   app: {
//     // internal express app reference
//   },
//   res: {
//     // internal response object reference
//   },
//   route: {
//     path: "/addbike",
//     stack: [/* middlewares and controller */],
//     methods: { post: true }
//   }
// }
