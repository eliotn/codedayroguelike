//Rogue Like For Code Day
var clearStuff = document.getElementById("clear");
var myButton = document.getElementById("clickButton");
var tileimage;

var imageObj = new Image(256, 256);

imageObj.onload = function() {
    myButton.addEventListener('click', doSomething, false)
};
imageObj.src = './images/df.png';

function doSomething() {
    clearStuff.style.display = 'none';
	document.getElementById("game").innerHTML = 
	"<canvas width=640 height=480 id='gamecanvas'></canvas>";
	setInterval(draw, 50);
}


var tiles = [];
for (var x = 0; x < 40; x++) {
    
    tilelist = [];
    for (var y = 0; y < 30; y++) {
        tilelist.push((x*y + 2)%256);
    }
    tiles.push(tilelist);
}

function draw() {
    console.log(tiles);
    var cv = document.getElementById("gamecanvas");
    var ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var y = 0; y < 30; y++) {
        for (var x = 0; x < 40; x++) {
            ctx.drawImage(imageObj, 0, 16, 16, 16, 16*x, 16*y, 16, 16);
        }
    }
    ctx.drawImage(imageObj, 0, 16, 16, 16, 0, 0, 16, 16);
    
    
}