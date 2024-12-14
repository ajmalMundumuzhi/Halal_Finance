const mongoose = require('mongoose')

const roomModel = new mongoose.Schema({
    roomName : {
        type : String,
        required : true
    },
    mentor : {
        type : String, 
        required : true
    },
    participents : {
        type : [String],
        default : []
    }
})

const collection = new mongoose.model('rooms',roomModel)
module.exports = collection