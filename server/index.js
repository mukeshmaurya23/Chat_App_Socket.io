require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const groups = [];

const createGroup = ({ groupName, groupDescription }) => {
  const groupId = `group_${groups.length + 1}`;
  const group = {
    id: groupId,
    name: groupName,
    description: groupDescription,
    users: [],
  };
  console.log(group, "group from create_group");
  groups.push(group);
  return group;
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
  //send message part logic for chat
  socket.on("send_message", (message) => {
    console.log(message, "message from send_message");
    //Broadcast the message to all users in the room
    io.emit("receive_message", message);
  });
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  //group part logic for chat

  socket.on("create_group", ({ groupName, groupDescription }) => {
    const group = createGroup({ groupName, groupDescription });
    socket.join(group.id);
    io.emit("group_created", group);
  });

  socket.on("join_group", (data) => {
    console.log(data, "data from join_group");

    socket.join(data.groupId);
  });

  socket.on("send_group_message", (data) => {
    console.log(data, "data from send_group_message");
    io.to(data.groupId).emit("receive_group_message", data);
  });

  socket.on("leave_group", (data) => {
    console.log(data, "data from leave_group");
    socket.leave(data.groupId);
  });
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
