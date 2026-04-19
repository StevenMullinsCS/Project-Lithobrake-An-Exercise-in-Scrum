import { Shoot, UpdateProjectile, DrawProjectile, CheckCollision } from "./modules/projectile.js"
import { DrawEnemy, initEnemies } from "./modules/enemy.js"

var canvas;
var ctx;
var canvasWidth; // canvas width for boundary calculation
var canvasHeight;
var playerWidth = 40; // replaced both width and height names for these variable names
var playerHeight = 40;
const PLAYER_SPEED = 5;   // Speed at which the player moves.
let playerX = 175;             // Center/Home position for player. Outside of player scope to allow for persistance after changes.
let playerY = 700;
let rightDown = false;
let leftDown = false;
var color = "rgb(243, 239, 239)";
var gameStarted = false;


// If either key press is detected, corresponding bool is set to true.
function onKeyDown(evt)
{
    //spacebar shoots
    if (evt.keyCode == 32)
    {
        Shoot(playerX);
    }
    if (evt.keyCode == 37)
        leftDown = true;
    else if (evt.keyCode == 39)
        rightDown = true
}

// Corresponding bool is set to false when key press is released.
function onKeyUp(evt)
{
    if (evt.keyCode == 37)
        leftDown = false;
    else if (evt.keyCode == 39)
        rightDown = false;
}

//get elements of the canvas
//set variables WIDTH and HEIGHT to width and height
function Init()
{
    canvas = document.getElementById("canvas");
    ctx = document.getElementById("canvas").getContext("2d");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

function Start()
{

    var startPage = document.getElementById("startPage");
    
    startPage.classList.add("fade-out");

    gameStarted = true;

    document.getElementById("startScreen").style.opacity = "0";
    
    // After the fade finishes, hide it completely so it doesn't block clicks
    setTimeout(() => {
        document.getElementById("startScreen").style.display = "none";
    }, 1000);


}
//draw a square for the player
//x cord, y cord, width, and height
function Player()
{

    // Once input is detected, the X position is moved based on left/right key press.
    // Value on the right determines the speed.
    if (rightDown && playerX < canvasWidth - playerWidth- 15) // boundary for right
        playerX += PLAYER_SPEED;
    else if (leftDown && playerX > 15) // boundary for left
        playerX -= PLAYER_SPEED;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(playerX + (playerWidth / 2), playerY); 
    ctx.lineTo(playerX, playerY + playerHeight); 
    ctx.lineTo(playerX + playerWidth, playerY + playerHeight);
    ctx.closePath();
    ctx.fill();
}

//main game loop, everything that needs to run in an interval needs to go here
function GameLoop()
{
    if(!gameStarted)
    {
        return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    DrawEnemy(ctx);
    Player();
    UpdateProjectile();
    CheckCollision();
    DrawProjectile(ctx);
}

Init();
initEnemies(canvasWidth, canvasHeight);
setInterval(GameLoop, 10);

// Event listeners that wait for any keypress. Once a key is pressed or released, corresponding function from above is called.
window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;
window.Start = Start;
