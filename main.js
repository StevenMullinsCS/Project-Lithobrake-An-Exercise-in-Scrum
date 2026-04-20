import { Shoot, UpdateProjectile, DrawProjectile } from "./modules/projectile.js"

//---- Canvas -- //
var canvas;
var ctx;
var canvasWidth; // canvas width for boundary calculation
var canvasHeight;

//---- Player -- //
var playerWidth = 40; // replaced both width and height names for these variable names
var playerHeight = 40;
const PLAYER_SPEED = 3;   // Speed at which the player moves.
let playerX = 175;             // Center/Home position for player. Outside of player scope to allow for persistance after changes.
let playerY = 700;
let rightDown = false;
let leftDown = false;
var color = "rgb(243, 239, 239)";


//---- Page Boolean Values --//
var gameStarted = false;
var gameOver = false;


//---- Lives --//
let lives = 3;
//icon lives 
const iconWidth = 20;
const iconHeight = 20;
const iconX = 15; // 
const iconY = 720;  




//---- Functions --//

//----- Key Press Detection -----//
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


//---- Game State Functions --//
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

    document.getElementById("startPage").style.opacity = "0";
    
    // After the fade finishes, hide it completely so it doesn't block clicks
    setTimeout(() => {
        document.getElementById("startPage").style.display = "none";
    }, 1000);


}

function Restart()
{
    var gameOverPage = document.getElementById("gameOverPage");
    
    gameOverPage.classList.remove("fade-in");
    gameOverPage.classList.add("fade-out");


    setTimeout(() => 
        {
            gameOverPage.style.display = "none";
            gameOverPage.classList.remove("fade-out");

            lives = 3;
            gameOver = false;
            playerX = 175;             
            playerY = 700;

        }, 500);
    
}

function GameOver()
{
    var gameOverPage = document.getElementById("gameOverPage");
    gameOverPage.style.display = "block";
    gameOverPage.classList.remove('fade-in');
    gameOverPage.classList.add('fade-out');


    setTimeout(() => {
        gameOverPage.classList.remove('fade-out');
        gameOverPage.classList.add('fade-in');
    }, 50); 
}


//---- Player and Drawing Functions --//
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


// Draws the live icon and the number of lives on the 
// left side on the screen. When the player gets close 
// it will fade so that it can be clean gameplay.
function DrawLives()
{
    ctx.clearRect(0, 750, 150, 50); 

    let isNearHUD = (playerX < 65);  

    if (isNearHUD) 
    {
        ctx.globalAlpha = 0.2;
    } 
    else 
    {
        ctx.globalAlpha = 1.0;
    }


    // the mini icon

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(iconX + (iconWidth / 2), iconY); 
    ctx.lineTo(iconX, iconY + iconHeight); 
    ctx.lineTo(iconX + iconWidth, iconY + iconHeight);
    ctx.closePath();
    ctx.fill();

    // draws the number of live "x3"

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`x${lives}`, iconX + iconWidth + 15, iconY + iconHeight - 5);

    ctx.globalAlpha = 1.0;
        
}

//main game loop, everything that needs to run in an interval needs to go here

//---- The Main Game loop (where the game actually lives) --//
function GameLoop()
{
    if(!gameStarted || gameOver)
    {
        return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    Player();
    DrawLives();
    UpdateProjectile();
    DrawProjectile(ctx);


    /*
    if()//collison of enemy or collision of projectile
    {
        lives -= 1;

        if(lives > 0)
        {
            playerX = 175;             
            playerY = 700;
        }
        else
        {
            GameOver();
            return
        }
    }
    */

    if (lives <= 0)
    {
        gameOver = true;
        GameOver();
        return;
    }
}

Init();
setInterval(GameLoop, 10);

// Event listeners that wait for any keypress. Once a key is pressed or released, corresponding function from above is called.
window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;
window.Start = Start;
window.DrawLives = DrawLives;
window.GameOver = GameOver;
window.Restart = Restart;
// this allows the lives variable to be changed 
// inside the code manually so i can chnage the 
// lives to 0 in order to trigger the game over screen. 
// Once collision detection is added this will be no longer needed.
Object.defineProperty(window, 'lives', {
    get: () => lives,
    set: (val) => { lives = val; DrawLives(); }
});