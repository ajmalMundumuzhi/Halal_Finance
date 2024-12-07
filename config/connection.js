const mongoose = require('mongoose')

async function dbConnect(){
    await mongoose.connect(process.env.MONGOURL,{
        dbName : 'finance'
    })
    .then(()=>{
        console.log("MongoDB connected succesfully")
    })
    .catch((err)=>{
        console.log("MongoDB connection failed : ",err)
    })
}
module.exports = dbConnect