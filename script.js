var myButton = document.getElementById("clickButton");
var myText = document.getElementById("helloText");

myButton.addEventListener('click', doSomething, false)

function doSomething() {
	myText.textContent = "Rogue Like";
	document.getElementById("game").innerHTML = 
	"<canvas width=600 height=500 id='gamecanvas'></canvas>";
	setInterval(draw, 50);
}

var i = 1;

function draw() {
    var cv = document.getElementById("gamecanvas");
    var ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.moveTo(i, i);
    ctx.lineTo(10, 50);
    ctx.stroke();
    i += 1;
    
}