const mongoose = require("mongoose");

const ConnectDB = async() => {
    // mongoose.set('strictQuery', true);
    try{
        const conn = await mongoose.connect(process.env.DB_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.log(`Error: ${error.message}`);
        process.exit();
    }

}

module.exports = ConnectDB;