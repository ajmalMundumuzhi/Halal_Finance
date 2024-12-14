const express = require('express')
const dbConnect = require('./config/connection')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const session = require('express-session')
const http = require('http')
const socketIo = require('socket.io')
const server = http.createServer(app)
const io = socketIo(server) 

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
const { log } = require('console')
app.use('/admin',admin)

// socket.io - chat
io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('join room', (roomName) => {
        socket.join(roomName)
        console.log(`User joined room : ${roomName}`)
        io.to(roomName).emit('User joined', `A new user has joined roon ${roomName}`)
    })

    socket.on('chat message', ({ room, message }) => {
        console.log(`Message recieved in room ${room} : ${message}`)
        io.to(room).emit('chat message', message)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
})
dbConnect()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server running on ${port}`)
    })
})
.catch((err)=>{ 
    console.log(`MongoDB connection failed : `,err)
})