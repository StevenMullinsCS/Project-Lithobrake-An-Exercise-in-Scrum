import { Shoot, UpdateProjectile, DrawProjectile } from "./modules/projectile.js"

var canvas;
var ctx;
var WIDTH;
var HEIGHT;
const PLAYER_SPEED = 10;   // Speed at which the player moves.
let playerX = 175;             // Center/Home position for player. Outside of player scope to allow for persistance after changes.
let rightDown = false;
let leftDown = false;

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
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    //return setInterval(Player, 10);
}

//draw a square for the player
//x cord, y cord, width, and height
function Player()
{
    // Clears the canvas of the rectangle. Without this, it smears across screen.
    //ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Once input is detected, the X position is moved based on left/right key press.
    // Value on the right determines the speed.
    if (rightDown) 
        playerX += PLAYER_SPEED;
    else if (leftDown)
        playerX -= PLAYER_SPEED;
    // Drawing logic rect([x cord], [y cord], [width], [height])
    ctx.beginPath();
    ctx.rect(playerX, 700, 40, 40);
    ctx.closePath();
    ctx.fill();
}

//main game loop, everything that needs to run in an interval needs to go here
function GameLoop()
{
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    Player();
    UpdateProjectile();
    DrawProjectile(ctx);
}

Init();
setInterval(GameLoop, 10);

// Event listeners that wait for any keypress. Once a key is pressed or released, corresponding function from above is called.
window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;