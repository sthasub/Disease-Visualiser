const express = require("express");
const app = express();
// const http = require("http").createServer(app);
const PORT = process.env.PORT || 3001;
app.use(express.static('public'));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});


const server = app.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
});

//socket
let users = {};
const io = require("socket.io")(server);

io.on("connection", socket=>{
    socket.on("new-member-joined", name=>{
        users[socket.id] = name;
        socket.broadcast.emit("new-member-joined", name);
    });

    socket.on("message",(msg)=>{
        socket.broadcast.emit("message", {message:msg, name:users[socket.id]});
    });

    socket.on("disconnect", msg=>{
        socket.broadcast.emit("left-chat",{name:users[socket.id]});
        delete users[socket.id];
    })
});












// const io = require("socket.io")(8000);

// const users = {};

// io.on("connection", socket => {
//     socket.on("new-user-joined", name => {
//         console.log("Your name::: ",name);
//         users[socket.id] = name;
//         socket.broadcast.emit("user-joined", name);
//     });

//     socket.on("send", message => {
//         socket.broadcast.emit("receive", { message: message, name: users[socket.id] });
//     });
// });

