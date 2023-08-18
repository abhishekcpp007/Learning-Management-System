const app = require('./app.js');
const connectToDB = require('../config/dbConnection');
const { config } = require('dotenv');
const cloudinary=require('cloudinary').config();

const PORT = process.env.PORT || 5011;

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    api_key:process.env.CLOUDINARY_API_KEY
}),
(async () => {
    try {
        await connectToDB();
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
})();
