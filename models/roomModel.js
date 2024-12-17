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
    },
    messages:{
        type:[{
            sender:{
                type:String
            },
            message:{
                type:String
            },
            time:{
                type:Date,
                default:Date.now
            },
            isMentor : {
                type : Boolean
            }
        }]
    },

})

const collection = new mongoose.model('rooms',roomModel)
module.exports = collection