const mongoose = require('mongoose');


const connectDB = ()=>{
    try {
        
    mongoose.connect("mongodb+srv://sunilpatil14000:sunil657@tech.sb74q.mongodb.net/todo").then(()=>{
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.error("MongoDB connection error:", err);
    });
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        
    }

}

module.exports = connectDB;