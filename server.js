const express = require("express");
const mustacheExpress = require("mustache-express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(express.static("public"));

let posts = [];
let messages = [];

app.get("/", (req, res) => {
  res.render("teamup", {
    user: { displayName: "홍길동" },
    posts,
    chatMessages: messages
  });
});

app.get("/list", (req, res) => {
  res.render("list", { posts });
});


app.post("/posts", (req, res) => {
  const newPost = req.body;
  posts.unshift(newPost);
  io.emit("new_post", newPost);
  res.sendStatus(200);
});

io.on("connection", (socket) => {
  socket.on("chat_message", (msg) => {
    messages.push(msg);
    io.emit("chat_message", msg);
  });
});

server.listen(3001, () => {
  console.log("✅ 서버 실행 중 → http://localhost:3001");
});
