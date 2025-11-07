  // require('dotenv').config(); // Load environment variables
  // const cors = require('cors');
  // const express = require('express');
  // const mongoose = require('mongoose');
  // const {authRouter} = require('./routes/authRouter');
  // const {ownerRouter} = require('./routes/ownerRouter');
  // const {bookingRouter} = require('./routes/bookingRouter');
  // const { guestbookingRouter } = require('./routes/userRouter');

  // const app = express();

  // // Middleware
  // app.use(express.json());// parse json data in incoming requests req.body
  // app.use(cors());

  // //it runs for every request
  // app.use((req,res,next)=>{
  //   console.log('Url:'+req.url+" Method:"+req.method);
  //   next();
  // })

  // // Routes
  // app.get('/', (req, res) => {
  //   res.send('Bike Rental API is running');
  // });

  // app.use('/api/user', authRouter);
  // app.use('/api/owner', ownerRouter);
  // app.use('/api/booking',bookingRouter);
  // app.use('/api/guestbooking',guestbookingRouter);

  // // MongoDB connection
  // let isConnected = false;

  // const connectDB = async () => {
  //   if (isConnected) {
  //     console.log('Using existing database connection');
  //     return;
  //   }

  //   try {
  //     await mongoose.connect(process.env.MONGODB_URI, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     });
  //     isConnected = true;
  //     console.log('MongoDB connected successfully');
  //   } catch (err) {
  //     console.error('Error connecting to MongoDB:', err);
  //     throw err;
  //   }
  // };

  // // Connect to database before handling requests
  // app.use(async (req, res, next) => {
  //   try {
  //     await connectDB();
  //     next();
  //   } catch (err) {
  //     res.status(500).json({ success: false, message: 'Database connection error' });
  //   }
  // });

  // // Export for Vercel serverless function
  // module.exports = app;

  require('dotenv').config();  // Load environment variables
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { authRouter } = require('./routes/authRouter');
const { ownerRouter } = require('./routes/ownerRouter');
const { bookingRouter } = require('./routes/bookingRouter');
const { guestbookingRouter } = require('./routes/userRouter');

const app = express();
const corsOptions={
  origin:'*',
}
// Middleware
app.use(express.json());  // Parse incoming requests with JSON payload
app.use(cors(corsOptions));  // Enable CORS for all domains (you can restrict to your frontend domain)

// Routes
app.get('/', (req, res) => {
  res.send('Bike Rental API is running');
});

app.use('/api/user', authRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/guestbooking', guestbookingRouter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.log("Error connecting to MongoDB", err));

// Route for all requests to check database connection
app.use(async (req, res, next) => {
  next();  // Proceed to next middleware
});

// Export for Vercel serverless function
module.exports = app;
