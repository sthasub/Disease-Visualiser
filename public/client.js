const socket = io();
let textarea;
let names = "";
const audio = new Audio("hangout.mp3");
const messageContainer = document.querySelector(".container");

do {
    names = prompt("Enter your to join?");
    socket.emit("new-member-joined", names);
} while (!names);


const appendMsg = (msg, type) => {
    let mainDiv = document.createElement("div");

    let className = type;
    mainDiv.classList.add("message", className);
    let markup;
    if (type === "left") {
        audio.play();
        markup = `
       <p class="msg">👧${msg.name}: <h4>${msg.message}</h4>
       </p>`;
        
    } else if (type === "joined-right") {
        markup = `<p>🙂 ${msg} joined the chat</p>`;
        scrollTobottom();
    } else if(type === "left-chat"){
        markup = ` <p>😔 ${msg.name} left the chat</p>`;
        scrollTobottom();
    }else {
        markup = `
        <p class="msg">🧑You: <h4>${msg}</h4></p>`;
    }

    mainDiv.innerHTML = markup;
    messageContainer.appendChild(mainDiv);
}


const enterHanlder = (e) => {
    if (e.key === "Enter") sendMessage(e.target.value);
}

//send message
const sendMessage = (msgs) => {
    appendMsg(msgs.trim(), "right");
    textarea.value = "";
    scrollTobottom();
    //send to server
    socket.emit("message", msgs.trim());
}

//reciever
socket.on("new-member-joined", name => {
    appendMsg(name, "joined-right");
});

socket.on("message", data => {
    appendMsg(data, "left");
    scrollTobottom();
})

// left the chat
socket.on("left-chat", msg=>{
    appendMsg(msg,"left-chat");
});


const prompts = () => {
    textarea = document.querySelector("#messageInput");
    textarea.addEventListener("keyup", enterHanlder)
}

//scrolls down when chat increase
const scrollTobottom = () => {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

prompts();
