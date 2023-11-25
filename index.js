import express, { Router } from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRouter from './Routes/userRouter.js'
import { Server } from "socket.io"
dotenv.config()
const app=express()
app.use(express.json());

app.use(cors({
    origin:['http://localhost:3000'],
    methods:["GET","POST"]
}))

const server=app.listen(8000,()=>{
    console.log("connected");
})
mongoose.connect(process.env.db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connect successfully");
}).catch((error) => {
    console.log(error.message)
})
app.use('/',userRouter)

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT'],
    },
  });
console.log(io,"lllllll");

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('login', (userId) => {
      // Associate the socket with the user ID
      socket.join(userId);
      console.log(`User ${userId} joined the room`);
    });

    // Handle other Socket.io events as needed

    // Clean up when a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

export { io, server, app }