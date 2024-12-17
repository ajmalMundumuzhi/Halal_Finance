const express = require('express');
const dbConnect = require('./config/connection');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const port = process.env.PORT;
const secret = process.env.SECRET;

// CORS Configuration
const corsOptions = {
    origin: '*', // This allows all origins explicitly
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true,
};
app.use(cors(corsOptions));

// Public Folder
app.use(express.static('./public'));

// EJS View Engine
app.set('view engine', 'ejs');

// Session Middleware
app.use(session({
    secret,
    resave: false,
    saveUninitialized: true,
}));

// Routes
const auth = require('./routes/authRouter');
app.use('/auth', auth);

const client = require('./routes/clientRouter');
app.use('/', client);

const mentor = require('./routes/mentorRouter');
app.use('/mentor', mentor);

const admin = require('./routes/adminRouter');
app.use('/admin', admin);

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join room', (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit('user joined', `A user joined the room: ${roomName}`);
    });

    socket.on('chat message', (data) => {
        io.to(data.room).emit('chat message', data.message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Database Connection and Server Start
dbConnect()
    .then(() => {
        server.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(`MongoDB connection failed:`, err);
    });
