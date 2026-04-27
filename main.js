import { Shoot, UpdateProjectile, DrawProjectile, CheckCollision, ClearProjectiles } from "./modules/projectile.js"
import { DrawEnemy, initEnemies, EnemyProjBehavior, EnemyCheckCollision, ResetEnemies, ClearEnemyProjectiles, ProceduralGenEnemies, ResetEnemiesAfterDeath, ResetEnemiesAfterGameOver } from "./modules/enemy.js"

//---- Canvas -- //
var canvas;
var ctx;
var canvasWidth; // canvas width for boundary calculation
var canvasHeight;
let hammer;


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

let tempLives = lives; // stored initial lives to be compared later


//---- Invisibility Frames --// 
const invisibleTimer = 4;
let isBlinking = false; // tracks if player is currently invulnerable
let isInvulnerable = false;



//---- Pause Function --//
let isPaused = false;


//---- Sound Effects --//
const playerShoot = new Audio("soundEffects\\mrfriends-pistol-shot-233473.mp3");
const playerDeath = new Audio("soundEffects\\freesound_community-pixel-death-66829.mp3");
const spawnEnemies = new Audio("soundEffects\\freesound_community-pixel-sound-effect-4-82881.mp3");



// If either key press is detected, corresponding bool is set to true.
function onKeyDown(evt)
{
    //spacebar shoots
    if (evt.keyCode == 32)
    {
        Shoot(playerX);

        if(gameStarted == true && gameOver == false && isPaused == false)
        {
            const shootingCopy = playerShoot.cloneNode();
            shootingCopy.play();
        }
        
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

//sourced from:
//https://github.com/hammerjs/hammer.js/
//ideally nothing more needs to be done with it...
function TouchControls() {
    hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammer.on('panstart', (e) => {
        if (e.center.x < canvasWidth / 2) {
            leftDown = true;
            rightDown = false;
        } else {
            rightDown = true;
            leftDown = false;
        }
    });

    hammer.on('panmove', (e) => {
        if (e.deltaX < 0) {
            leftDown = true;
            rightDown = false;
        } else if (e.deltaX > 0) {
            rightDown = true;
            leftDown = false;
        }
    });

    hammer.on('panend', () => {
        leftDown = false;
        rightDown = false;
    });

    hammer.on('tap', () => {
        Shoot(playerX);

        if(gameStarted == true && gameOver == false && isPaused == false)
        {
            const shootingCopy = playerShoot.cloneNode();
            shootingCopy.play();
        }
    });
}

//---- Game State Functions --//
function Init()
{
    canvas = document.getElementById("canvas");
    ctx = document.getElementById("canvas").getContext("2d");
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    //hammer stuff
    hammer = new window.Hammer(canvas);
    TouchControls();
}

function Start()
{

    var startPage = document.getElementById("startPage");
    
    startPage.classList.add("fade-out");

    

    document.getElementById("startPage").style.opacity = "0";
    
    // After the fade finishes, hide it completely so it doesn't block clicks
    setTimeout(() => {
        document.getElementById("startPage").style.display = "none";
        gameStarted = true;
        const spawnCopy = spawnEnemies.cloneNode();
        spawnCopy.play();
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


            ResetEnemiesAfterGameOver(canvasWidth)
            spawnEnemies.play();
            ClearProjectiles();
            ClearEnemyProjectiles();
            lives = 3;
            playerX = 175;             
            playerY = 700;
            gameOver = false;
            pauseButton.classList.remove("pauseDisabled");
            return;

        }, 500);
    
}

function GameOver()
{
    var gameOverPage = document.getElementById("gameOverPage");
    var pauseButton = document.getElementById("pauseButton");

    gameOverPage.style.display = "block";
    gameOverPage.classList.remove('fade-in');
    gameOverPage.classList.add('fade-out');

    pauseButton.classList.add("pauseDisabled");

    setTimeout(() => {
        gameOverPage.classList.remove('fade-out');
        gameOverPage.classList.add('fade-in');
    }, 50); 


    
}

function Pause()
{
    if(gameOver == true)
    {
        return;
    }

    if(isPaused == false)
    {
        isPaused = true;
        
    }
    else
    {
        isPaused = false;
    }
}

function PausePage()
{

    var pausePage = document.getElementById("pausePage");
    var pauseButton = document.getElementById("pauseButton");


    if(gameStarted == true)
    {
        pauseButton.style.display = "block";
    }

    

    if(isPaused == true)
    {
        pausePage.style.display = "block";
        pauseButton.classList.add("pauseDisabled");
    }
    else
    {
        pausePage.style.display = "none";
        pauseButton.classList.remove("pauseDisabled");
    }

    
    
    
}

//---- Player and Drawing Functions --//
function Player()
{

    if(gameOver == true)
    {
        ctx.clearRect(playerX, playerY, playerWidth, playerHeight);
        return;
    }

    // Once input is detected, the X position is moved based on left/right key press.
    // Value on the right determines the speed.
    if (rightDown && playerX < canvasWidth - playerWidth- 15) // boundary for right
        playerX += PLAYER_SPEED;
    else if (leftDown && playerX > 15) // boundary for left
        playerX -= PLAYER_SPEED;

    
    ctx.globalAlpha = isBlinking ? 0.2 : 1.0; //This is being constantly changed by the isBlinking variable in the BlinkPlayer Function.

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


function ResetPlayer()
{
    playerX = 175;             
    playerY = 700;

   
    BlinkPlayer();
}

function BlinkPlayer()
{
    
    isBlinking = true; // it starts blinking immediaelty
    VulnerableTimer();


    // the interval will change the isBlinking value for a set of 250 ms 
    // which will then cause the variable in the player functon to change 
    // the opactiy to 0.2 to 1.0 for a delay of 250 ms. This is repeateely 
    // happening for 4 seconds
    
    const blinkInterval = setInterval(() => {
        isBlinking = !isBlinking; 
    }, 250);

    
    setTimeout(() => {
        clearInterval(blinkInterval);
        isBlinking = false; 
    }, invisibleTimer * 1000);
}

function VulnerableTimer()
{
    isInvulnerable = true; 

    setTimeout(() => {
        isInvulnerable = false; 
    }, 4000);
}

//main game loop, everything that needs to run in an interval needs to go here
//---- The Main Game loop (where the game actually lives) --//
function GameLoop()
{
    if(!gameStarted || gameOver)
    {
        return;
    }

    if(isPaused == true)
    {
        PausePage();
        return;
    }
    else
    {
        PausePage();
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    DrawEnemy(ctx);
    Player();
    DrawLives();
    UpdateProjectile();
    CheckCollision();
    DrawProjectile(ctx); 
    EnemyProjBehavior(ctx);
    if(EnemyCheckCollision(playerX, playerY, playerWidth, playerHeight))//collison of enemy or collision of projectile
    {
        if (isInvulnerable)
        {
            return;
        }

        lives -= 1;
        playerDeath.play();

        if(lives > 0)
        {
            ResetPlayer();
        }
        else
        {
            gameOver = true;
            ctx.clearRect(playerX - 20, playerY - 20, playerWidth + 40, playerHeight + 40);
            Player(); // this is to make sure the player is cleared from the screen before the game over screen appears. 
            GameOver();
            ResetEnemiesAfterDeath();
            return;
        }
    }


    ProceduralGenEnemies(canvasWidth);
    
    

    
}

Init();
initEnemies(canvasWidth, canvasHeight);
setInterval(GameLoop, 10);

// Event listeners that wait for any keypress. Once a key is pressed or released, corresponding function from above is called.
window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;
window.Start = Start;
window.DrawLives = DrawLives;
window.GameOver = GameOver;
window.Restart = Restart;
window.ResetPlayer = ResetPlayer;
window.Pause = Pause;