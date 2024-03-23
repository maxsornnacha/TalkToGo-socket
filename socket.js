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
      //console.log(currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentInput,commentImage)
      io.emit('commentData',currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentInput,commentImage)
 })

  //Upload Reply
  socket.on('replyData',(index,currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentID,replyInput,replyImage)=>{
    //console.log(index,currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentID,replyInput,replyImage)
    io.emit('replyData',index,currentDate,currentTime,accountImage,firstname,lastname,accountID,postID,commentID,replyInput,replyImage)
})

  //FriendShip เปลี่ยนค่าสถานะของปุ่มเพิ่มเพื่อน
  socket.on('requestFriendship',async ({roomIDGet,requester,recipient,status})=>{
    //console.log(requester)
    //console.log(recipient)
    //console.log(status)
    //console.log(roomIDGet)
    io.emit('requestFriendship',{roomIDGet,requester,recipient,status})
  })

  //FriendRequestHandle จัดการกับการยอมรับการเป็นเพื่อน หรือไม่
  socket.on('friendRequestList',({data,getterID})=>{
    io.emit('friendRequestList',{data,getterID})
  })

  //สร้างห้องสำหรับส่งข้อความสำหรับแค่ 2 ตน
    // Function to create a consistent room ID
    function createRoomID(userID1, userID2) {
      const sortedIDs = [userID1, userID2].sort();
      return `${sortedIDs[0]}-${sortedIDs[1]}`;
       }

  //start to create a room
  socket.on('joinRoom',async ({senderID, getterID}) =>{
    const roomID = createRoomID(senderID, getterID);
    await socket.join(roomID);
    socket.emit('joinRoom',{roomID})
  })


  //ทำการส่ง massage แค่ 2 คนที่ได้ระบุไว้
  socket.on('sendMsg', ({ roomIDGet, message }) => {
    io.to(roomIDGet).emit('message',{roomIDGet,message});
  });

  //ทำการอัพเดตแชท เมื่อมีการ อ่านข้อความแล้ว จากฝ้่งรับข้อความ
  socket.on('updateMsg',({roomIDGet,messagesAll})=>{
    if(messagesAll){
      //console.log('dataGet :',messagesAll[messagesAll.length-1])
      //console.log('roomID',roomIDGet)
    }
    io.to(roomIDGet).emit('updateMsg',{messagesAll})
  })

  //ทำการอัพเดต การส่งคำขอ เข้าร่วมห้องพูดคุย
    socket.on('roomRequest',({id, requestStatus})=>{
      //console.log(id)
     // console.log(requestStatus)
      io.emit('roomRequest',{id,requestStatus})
    })

  //ทำการอัพเดต ข้อความทั้งหมด 
    socket.on('allMessages',({data , userID , newUnreadMessages})=>{
      console.log(newUnreadMessages)
      io.emit('allMessages',{data,userID,newUnreadMessages})
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

