const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const port = 3000;

// CORS configuration
const allowedOrigins = [
  "https://chat-application-t4vi.vercel.app",   // Frontend Vercel
  "https://chat-application-1-e6gm.onrender.com"  // Socket.io Server Origin
];

// Allow CORS for the express app
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected with ID: ${socket.id}`);

  // Handling room join
  socket.on("join-room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // Handling message send
  socket.on("send-msg", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive", data);
  });

  // Handling user disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected with ID: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log("Server is running on port " + port);
});
