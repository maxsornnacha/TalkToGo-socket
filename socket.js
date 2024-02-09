const  express = require('express')
const app = express()
const {createServer} = require('http')

require('dotenv').config()
//import socket.io
//Doc here https://socket.io/docs/v4/server-initialization/
const {Server} = require('socket.io')
const httpServer  = createServer(app)
const io = new Server(httpServer,{
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    }
})

//เชื่อมต่อ socket
io.on('connection', (socket) => {
    console.log(`User ID:${socket.id} is connected to the socket`);
  
    socket.on('disconnect', () => {
      console.log(`User ID:${socket.id} disconnected from the socket`);
    });
    //ส่ง User ID ไปที่ Client
    io.emit('userID',socket.id)

    socket.on('chat message',(messageGet)=>{
        console.log('message: '+messageGet)
        io.emit('chat message from server',messageGet)
    })
  });

const PORT = process.env.PORT || 8080;

httpServer.listen(process.env.PORT,()=>{
    console.log(`port of socket running on ${process.env.PORT}`)
})

