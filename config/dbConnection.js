const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectToDB = async () => {
    try {
        const { connection } = await mongoose.connect(
            process.env.MONGO_URL || "mongodb+srv://Abhishek:Abhishek@cluster0.kfiy82y.mongodb.net/LSM"
        );
        
        if (connection) {
            console.log(`Connection established to MongoDB database: ${connection.host}`);
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

module.exports = connectToDB;
