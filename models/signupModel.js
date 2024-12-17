const mongoose = require('mongoose')

const signupSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    Name : {

        type : String, 
        required : true
    },
    email : { 
        type : String,
        required : true
    },
    qualification : { 
        type : String, 
        required : false
    },
    password : {
        type : String,
        required : true 
    },
    otp : {
        type : String,
        required :false,
        default : null
    },
    role : {
        type : String,
        required : true,
        default : "client"
    },
    bio : {
        type : String,
        required : false
    },
    profileImage : {
        type : String,
        required : false
    }
})

const collection = new mongoose.model('signup',signupSchema)
module.exports = collection