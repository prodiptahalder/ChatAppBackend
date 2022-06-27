const express = require('express');
const app = express();
const http = require('http');
var cors = require('cors')
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//using dotenv module to access environment Variable
require("dotenv").config();

// DATABASE
mongoose.connect(`${process.env.MONGO_URL}`,
{
    useNewUrlParser: true
},
(err)=>{
    if(err) console.log("Unable to establish connection", err);
    else{
        console.log("Connection Established");
    }
});
// DATABASE

//MIDDLEWARE
//logger
app.use("*", morgan("dev"));
//parse url-encoded data
app.use(bodyParser.urlencoded({extended: false}));
//parse json data
app.use(bodyParser.json());
//set headers to avoid C-Cross O-Origin R-Resource S-Sharing error
app.use(cors());
//MIDDLEWARE


// ROUTES
//user routes
const userRoutes = require("./api/routes/userRoutes");
app.use("/api/v1/users", userRoutes);

//message routes
const messageRoutes = require("./api/routes/messageRoutes");
app.use("/api/v1/messages", messageRoutes);

// ROUTES


// ERROR HANDLING
//error handling to set error and then pass on
app.use("*", (req, res, next) =>{
    const error = new Error("Not found");
    error.status=404;
    next(error);
});
//handles error set in previous block of code
app.use("*", (error, req, res, next) =>{
    res.status(error.status||500);
    res.json({
        error: {
            message: error.message
        }
    });
});
// ERROR HANDLING

// SOCKET
const {Server} = require('socket.io');

// server creation
const  server = http.createServer(app);

// Socket Object
const io = new Server(server, {
    cors:{
        origin: `${process.env.CLIENT}`,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
});

// Socket Connection
const roomHandler = require('./Socket/room');
const messageHandler = require('./Socket/message');

global.onlineUsers = new Map();

const onConnection = (socket) => {
    roomHandler(io, socket);
    messageHandler(io, socket);
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(onlineUsers);
    });
}

io.on("connection", onConnection);

// Server setup
server.listen( 3001, () => {
    console.log('SERVER IS RUNNING');
});