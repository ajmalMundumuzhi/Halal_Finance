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
        required : true
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
    profileImage : {
        type : String,
        required : false
    }
})

const collection = new mongoose.model('signup',signupSchema)
module.exports = collection