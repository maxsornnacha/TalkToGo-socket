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
   // console.log(`User ID:${socket.id} is connected to the socket`);

 
    //like
    socket.on('like', (like,postID)=>{
         //console.log(like , postID)
         io.emit('like',like,postID)
    })
    //unlike
    socket.on('unlike', (unlike,postID)=>{
        //console.log(unlike, postID)

      io.emit('unlike',unlike,postID)
 })

    //Upload Comment 
    socket.on('commentData',(currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentInput,commentImage)=>{
      console.log(currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentInput,commentImage)
      io.emit('commentData',currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentInput,commentImage)
 })

  //Upload Reply
  socket.on('replyData',(index,currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentID,replyInput,replyImage)=>{
    console.log(index,currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentID,replyInput,replyImage)
    io.emit('replyData',index,currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentID,replyInput,replyImage)
})


  //FriendShip
  socket.on('requestFriendship',(requestData)=>{
    console.log(requestData)
    io.emit('requestFriendship',requestData)
  })



    socket.on('disconnect', () => {
      //console.log(`User ID:${socket.id} disconnected from the socket`);
    });
    //ส่ง User ID ไปที่ Client
    io.emit('userID',socket.id)


  });

const PORT = process.env.PORT || 8080;

httpServer.listen(process.env.PORT,()=>{
    console.log(`port of socket running on ${process.env.PORT}`)
})

