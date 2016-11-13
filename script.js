//Rogue Like For Code Day
var clearStuff = document.getElementById("clear");
var myButton = document.getElementById("clickButton");
var playerInfo = document.getElementById("playerinfo");
var tileimage;

var tilewidth = 40;
var tileheight = 30;

var fishChar = 224;
var heartChar = 3;
var weaponChar = 10;
var stairsChar = '>'.charCodeAt(0);
var bossChar = 'B'.charCodeAt(0);
var weapons = ['fists', 'brass knuckles', 'copper knuckles', 'silver knuckles',
'gold knuckles', 'brass bat', 'copper bat', 'silver bat', 'gold bat', 'brass gun',
'silver gun', 'golden gun', 'diamond gun', 'HAPPY CODE DAY!', 'DUKE NUKEUM!'];
var imageObj = new Image(256, 256);
var deathmessage;
imageObj.onload = function() {
    myButton.addEventListener('click', doSomething, false)
};
imageObj.src = './images/df.png';

function whiteSpace(length) {
    return "<img src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' width=" + length + " height=1>";
        
}

function drawUI() {
    if (player.dead) {
        playerInfo.innerHTML = "<p>" + deathmessage + " Final score: " + player.score + "<br><button onClick='doSomething()' class='buttonStyle'>Retry</button>";
        
    }
    else {
        playerInfo.innerHTML = "<p>Weapon: " + weapons[player.weapon] + whiteSpace(80) +
        "Health: " + player.hp + whiteSpace(80) +
        "Score: " + player.score + whiteSpace(80) + "Level: " + level + "</p>"; //Using transparent image for spacing
    }
}

function doSomething() {
    clearStuff.style.display = 'none';
	document.getElementById("game").innerHTML = 
	"<canvas width=640 height=480 id='gamecanvas'></canvas>";
	restartGame();
	drawUI();
	setInterval(draw, 50);
}
var tiles, player, enemies, level;
function spawnLevel(nextLevel) {
    level = nextLevel;
    tiles = [];
    for (var x = 0; x < 40; x++) {
    
        tilelist = [];
        for (var y = 0; y < 30; y++) {
            if (level !== 4) {
                tilelist.push((x%2 && y%2)?178:0);
            }
            else {
                tilelist.push((x >= 18 && x <= 20 && y >= 14 && y <= 16)?0:178);
            }
        }
        tiles.push(tilelist);
    }
    
    enemies = [];
    player.x = -100;
    player.y = -100;
    obj= spawnRandom();
    player.x = obj.x;
    player.y = obj.y;
    enemies.push(player);
    if (level !== 4) {
        for (var i = 0; i < 100; i++) {
            rngenemy = Math.random();
            enemychar = '*'.charCodeAt(0);
            enemyhp = 1;
            enemydamage = 2;
            if (rngenemy > 0.9) {
                enemychar = 'w'.charCodeAt(0);
                enemyhp = 20;
            }
            else if (rngenemy > 0.6) {
                enemychar = 'k'.charCodeAt(0);
                enemyhp = 10*level;
                enemydamage = 2*Math.pow(level, level);
            }
            else if (rngenemy > 0.4) {
                enemychar = fishChar;
            }
            var obj = spawnRandom();
            enemies.push({x: obj.x, y: obj.y, hp: enemyhp, damage: enemydamage, char:enemychar});
            spawnEnemy(i);
        }
        for (var i = 0; i < 6; i++) {
            var obj = spawnRandom();
            tiles[obj.x][obj.y] = heartChar;
        }
        for (var i = 0; i < 6; i++) {
            var obj = spawnRandom();
            tiles[obj.x][obj.y] = weaponChar;
        }
        for (var i = 0; i < 3; i++) {
            var obj = spawnRandom();
            tiles[obj.x][obj.y] = stairsChar;
        }
    }
    else {
        player.x = -100;
        player.y = -100;
        var obj = spawnRandom();
        enemies.push({x: obj.x, y: obj.y, hp: 100, damage: 5, char: bossChar});
        obj = spawnRandom();
        player.x = obj.x;
        player.y = obj.y;
        
    }
    
    
}
function restartGame() {
    
    player = {x: 0, y:0, hp: 20, char:2, score: 0, dead: false, damage: 5, weapon:0};
    spawnLevel(1);
}

function death(message) {
    player.dead = true;
    deathmessage = message;
    drawUI();
}

function spawnRandom() {
    var xp, yp, blocked;
    do {
        blocked = false;
        var xp = Math.floor(Math.random()*40);
        var yp = Math.floor(Math.random()*30);
        if (tiles[xp][yp] !== 0) {
            blocked = true;
        }
        if (Math.abs(xp - player.x) <= 2 && Math.abs(yp - player.y) <= 2) {
            blocked = true;
        }
        for (var j = 0; j < enemies.length; j++) {
            if (enemies[j].x == xp && enemies[j].y == yp) {
                blocked = true;
            }
            
        }
    } while (blocked);
    return {x:xp, y:yp};
}



function spawnEnemy(enemyIndex) {
    var obj = spawnRandom();
    enemies[enemyIndex].x = obj.x;
    enemies[enemyIndex].y = obj.y;
}

function tileWithinLOS(x, y) {
    return (Math.pow(player.x-x, 2) + Math.pow(player.y-y, 2)) <= 8;
}


function updateEnemies() {
    explosions = [];
    for (var x = 0; x < 40; x++) {
        for (var y = 0; y < 30; y++) {
            if (tiles[x][y] == 177 || tiles[x][y] === 19) {
                tiles[x][y] = 0;
            }
        }
    }
    enemies = enemies.filter(function(enemy) {return enemy.hp > 0;});
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].char === 'w'.charCodeAt(0) && Math.abs(enemies[i].x-player.x) + Math.abs(enemies[i].y-player.y) <= 1) {
            enemies[i].char = 'W'.charCodeAt(0);
        }
        else if (enemies[i].char === 'W'.charCodeAt(0)) {
            for (var x = Math.max(enemies[i].x - 1, 0); x <= Math.min(enemies[i].x + 1, tilewidth-1); x++) {
                for (var y = Math.max(enemies[i].y - 1, 0); y <= Math.min(enemies[i].y + 1, tileheight-1); y++) {
                    
                    explosions.push({x: enemies[i].x, y:enemies[i].y, rad:1, dmg:9999, char:19});
                }
            }
        }
        else if (enemies[i].char === bossChar && Math.abs(enemies[i].x-player.x) + Math.abs(enemies[i].y-player.y) <= 1) {
        
            reduceHealth(player, enemies[i].damage);
        }
        else if (enemies[i].char >= '1'.charCodeAt(0) && enemies[i].char <= '4'.charCodeAt(0)) {
            enemies[i].char -= 1;
            if (enemies[i].char === '0'.charCodeAt(0)) {
                explosions.push({x: enemies[i].x, y:enemies[i].y, rad:2, dmg:20, char:177});
            }
        }
        else if (enemies[i].char === 'k'.charCodeAt(0) && tileWithinLOS(enemies[i].x, enemies[i].y)) {
            var xmod = 0, ymod = 0;
            if (Math.random() < 0.5) {
                xmod = (Math.round(Math.random()))?1:-1;
            }
            else {
                ymod = (Math.round(Math.random()))?1:-1;
            }
            moveTo(enemies[i], enemies[i].x+xmod, enemies[i].y+ymod);
        }
    }
    for (var i = 0; i < explosions.length; i++) {
        for (var x = Math.max(explosions[i].x - explosions[i].rad, 0); x <= Math.min(explosions[i].x + explosions[i].rad, tilewidth-1); x++) {
            for (var y = Math.max(explosions[i].y - explosions[i].rad, 0); y <= Math.min(explosions[i].y + explosions[i].rad, tileheight-1); y++) {
                if (tiles[x][y] !== stairsChar) {
                    tiles[x][y] = explosions[i].char;
                }
            }
        }
        for (var ei = 0; ei < enemies.length; ei++) {
            if (Math.abs(enemies[ei].x - explosions[i].x) <= explosions[i].rad &&
                Math.abs(enemies[ei].y - explosions[i].y) <= explosions[i].rad) {
                    reduceHealth(enemies[ei], explosions[i].dmg);
                }
        }
    }
    enemies = enemies.filter(function(enemy) {return enemy.hp > 0;});
}

function reduceHealth(entity, healthToReduce) {
    if (entity.hp <= 0) {
        return;
    }
    entity.hp -= healthToReduce;
    if (entity.hp <= 0){
        if (entity == player) {
            death("You perished in persuit of your boss!");
            return;
        }
        if (entity.char === '*'.charCodeAt(0)) {
            entity.char = '4'.charCodeAt(0);
            entity.hp = 1;
            return;
        }
        if (entity.char === bossChar) {
            player.score += 9001;
            death("You defeated your boss to win!  Insert epic theme music.")
        }
        if (entity.char === fishChar) {
            player.score += 200;
        }
        if (entity.char === 'k'.charCodeAt(0)) {
            player.score += 50;
        }
    }
}

function moveTo(objecttomove, x, y) {
    var blocked = false;
    if (x < 0 || x >= tilewidth || y < 0 || y >= tileheight) {
        return;
    }
    if (tiles[x][y] == 178) {
        return;
    }
    
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].x == x && enemies[i].y == y) {
            if (enemies[i].char == fishChar) {
                    moveTo(enemies[i], enemies[i].x-(objecttomove.x-enemies[i].x), enemies[i].y-(objecttomove.y-enemies[i].y));
            }
            else {
                reduceHealth(enemies[i], objecttomove.damage);
            }
            blocked = true;
        }
    }
    if (tiles[x][y] === heartChar && objecttomove === player) {
        player.hp += 20;
        tiles[x][y] = 0;
        blocked = true;
    }
    if (tiles[x][y] === weaponChar) {
        objecttomove.damage += 5;
        if (objecttomove === player) {
            objecttomove.weapon += 1;
        }
        tiles[x][y] = 0;
        blocked = true;
    }
    if (tiles[x][y] === stairsChar) {
        spawnLevel(level + 1);
        blocked = true;
    }
    if (!blocked) {
        
        objecttomove.x = x;
        objecttomove.y = y;
    }
    if (objecttomove === player) {
        player.score -= 1;
        updateEnemies();
        drawUI();
    }
    
}

window.onkeydown = function(e) {
    if (player.dead) {
        return;
    }
    var key = e.keyCode ? e.keyCode : e.which;
    if (key == 39) {//RIGHT
        moveTo(player, player.x + 1, player.y);
    }
    if (key == 37) {//LEFT
        moveTo(player, player.x - 1, player.y);
    }
    if (key == 40) {//DOWN
        moveTo(player, player.x, player.y + 1);
    }
    if (key == 38) {//UP
        moveTo(player, player.x, player.y - 1);
    }
    
}
function draw() {
    var cv = document.getElementById("gamecanvas");
    var ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var y = 0; y < tileheight; y++) {
        for (var x = 0; x < tilewidth; x++) {
            if (tileWithinLOS(x, y)) {
                ctx.drawImage(imageObj, (tiles[x][y]%16)*16, Math.floor(tiles[x][y]/16)*16, 16, 16, 16*x, 16*y, 16, 16);
        
                
            }
        }
    }
    for (var i = 0; i < enemies.length; i++) {
        if (tileWithinLOS(enemies[i].x, enemies[i].y)) {
            ctx.drawImage(imageObj, (enemies[i].char%16)*16, Math.floor(enemies[i].char/16)*16, 16, 16, 16*enemies[i].x, 16*enemies[i].y, 16, 16);
        }
    }
    
    
}