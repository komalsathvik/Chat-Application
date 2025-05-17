const express=require("express");
const http=require("http");
const cors=require("cors");
const {Server} =require("socket.io");

const app=express();
const port=3000;
app.use(cors());
const server=http.createServer(app);
const io=new Server(server,{
  cors:{
    origin:"https://chat-application-t4vi.vercel.app/",
    methods:['GET','POST'],
  }
});
io.on("connection",(socket)=>{
  console.log(`user connected with id : ${socket.id}`);
  socket.on("join-room",(data)=>{
    socket.join(data);
    console.log(`user with id: ${socket.id} joined room: ${data}`);
  })
  socket.on("send-msg",(data)=>{
    console.log(data);
    socket.to(data.room).emit("receive",data);
  })
  socket.on("disconnect",()=>{
    console.log(`user disconnected with id: ${socket.id}`);
  })
})


server.listen(port,()=>{
  console.log("server is running");
})
