const app = require('./app.js');
const connectToDB = require('../config/dbConnection');
const { config } = require('dotenv');
const { async } = require('q');
const Razorpay = require('razorpay');
const cloudinary=require('cloudinary').config();
const Rajorpay=require('razorpay')

const PORT = process.env.PORT || 5011;

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    api_key:process.env.CLOUDINARY_API_KEY
})
const razorpay = new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

        app.listen(PORT,async () => {
            await connectToDB(); 
            console.log(`Server is running at http://localhost:${PORT}`);
        });
   
