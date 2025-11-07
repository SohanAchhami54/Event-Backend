const mongoose=require('mongoose');
const connectedDb=mongoose.connect(`${process.env.MONGODB_URI}/RentalApp`)
.then(()=>{
    console.log('database connected successfully');
})
.catch((err)=>{
  console.log('Error occured while connecting to the database.',err);
})

module.exports=connectedDb;