const socket = io();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let drawing = false;
let color = document.getElementById("color").value;
let size = document.getElementById("size").value;

// Update tool
document.getElementById("color").onchange = e => color = e.target.value;
document.getElementById("size").onchange = e => size = e.target.value;

// Drawing
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);

canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    drawCircle(x, y, color, size);
    socket.emit("draw", { x, y, color, size });
});

// Draw function
function drawCircle(x, y, color, size) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

// Receive drawing
socket.on("draw", data => {
    drawCircle(data.x, data.y, data.color, data.size);
});

// Clear canvas
document.getElementById("clear").onclick = () => {
    socket.emit("clear");
};

socket.on("clear", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
