const express = require('express')
const dbConnect = require('./config/connection')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const session = require('express-session')

const secret = process.env.SECRET
// public
app.use(express.static('./public'))

// ejs view 

app.set('view engine','ejs')

//  session
app.use(session({
    secret,
    resave: false,
    saveUninitialized: true
    }))

//  auth route
const auth = require('./routes/authRouter')
app.use('/auth',auth)

// client route
const client = require('./routes/clientRouter')
app.use('/',client)

// mentor
const mentor = require('./routes/mentorRouter')
app.use('/mentor',mentor)

// admin route
const admin = require('./routes/adminRouter')
app.use('/admin',admin)
dbConnect()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server running on ${port}`)
    })
})
.catch((err)=>{
    console.log(`MongoDB connection failed : `,err)
})