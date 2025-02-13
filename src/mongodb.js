const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/login-signup")
.then(()=>{
    console.log("DataBase connected successfully");
})
.catch((error)=>{
    console.log("DataBase connection error:",error);
});

// Define the schema for the login collection
const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Create the model for the login collection
const LogInCollection = mongoose.model('LogIn', loginSchema);

module.exports = LogInCollection;
