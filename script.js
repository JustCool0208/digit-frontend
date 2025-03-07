const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 280;
canvas.height = 280;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "white";
ctx.lineWidth = 8;
ctx.lineJoin = "round";

let drawing = false;

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDrawing(e.touches[0]);
});
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e.touches[0]);
});
function getCoordinates(event) {
    let x, y;
    if (event.clientX) {
        
        x = event.offsetX;
        y = event.offsetY;
    } else {
        
        const rect = canvas.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }
    return { x, y };
}
function startDrawing(event) {
    drawing = true;
    const { x, y } = getCoordinates(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}


function draw(event) {
    if (!drawing) return;
    const { x, y } = getCoordinates(event);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function clearCanvas() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath(); 
}
fetch("https://digit-backend-ax66.onrender.com")
    .catch(() => console.log("Backend might take a few seconds to wake up."));

async function sendData() {
    const operation = document.getElementById("operation").value;
    const secondNumber = document.getElementById("secondNumber").value;
    const imageBase64 = canvas.toDataURL();

    try {
        const response = await fetch("https://digit-backend-ax66.onrender.com/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageBase64, operation: operation, second_number: parseInt(secondNumber) })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById("result").innerText = `First digit : ${data.first_digit} , Second digit :  ${data.second_digit} , RESULT = ${data.result}`;
    } catch (error) {
        console.error("Error:", error);
    }
}

