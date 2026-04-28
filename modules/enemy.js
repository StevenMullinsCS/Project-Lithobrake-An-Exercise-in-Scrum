export const name = "enemy";

let enemies = [];
export { enemies };
// If enemy dimensions are too large, they may become clumped up depending on the number of rows and columns, be mindful of this when changing these variables.
var enemyWidth = 25;
var enemyHeight = 25;

var enemySpriteWidth = 60;
var enemySpriteHeight = 60;


var enemyRows = 5;
var enemyCols = 5;
var padding = 50;     // Adjusts the space between the enemies.
var topMargin = 25;   // Reserved free space at the top for UI elements.


// calculating the max enemies the game can spawn within a specific area by using the padding and sizes of each enemy
var hSpace = enemyWidth + padding;
var vSpace = enemyHeight + padding;
var maxCol = Math.floor(400 / hSpace);
var maxRow = Math.floor(300 / vSpace);
var maxEnemies = maxCol * maxRow;

//this is for how much time after all enemies are dead to spawn a new wave of enemies all at once
var spawnTimer = 0;
var spawnDeplay = 300;

// this calculates how many enemies are being added each wave by capping the enemies at 48 and setting starting enemies when game is over
var enemiesAdded = 5;
var startingEnemies = enemyRows * enemyCols;
var currentEnemies = enemyRows * enemyCols;





var edgeMargin = .65;   // Determines how much area around the enemies is empty. The higher the percent, the smaller the margins get.
var enemySpeed = 1; // Determines the speed at which the enemy moves.

let projectiles = [];
let projOffset = 15;
let projSpeed = 10;
let projW = 2.5;
let projH = 25;
let projDelay = 120; // Cooldown logic. This is galaga, not a bullet hell, so we only want one projectile launched at a time, at least for now.
let projCD = projDelay; // projCD iteratively is reduced, but is set/reset to projDelay after hitting 0.

// enemy attacking rate variables //
let cooldownDecrease = 20;
let minProjDelay = 40;

// -- enemy state variables --
let enemyState = ["Diver", "Shooter", "Both"];

//-- blinking variables --//
var isBlinking = false;
var isInvulnerable = false;
var enemyVulnerablity = 2;


//-- sound effects --//
const laserShot = new Audio("soundEffects\\ribhavagrawal-laser-shot-ingame-230500.mp3");
const spawnEnemies = new Audio("soundEffects\\freesound_community-pixel-sound-effect-4-82881.mp3");



//-- Assets --//
const shooterSprite = new Image();
shooterSprite.src = "assets/shooter.png";
const diverSprite = new Image();
diverSprite.src = "assets/diver.png";
const bothSprite = new Image();
bothSprite.src = "assets/both.png";

// Help with this function is from: https://chatgpt.com/c/69ec590b-1fac-83ea-9cf4-a6a25f0a5845
export function ProceduralGenEnemies(canvasWidth)
{
    // when all enemies die, it has a 3 second delay until the next wave starts(feel free to change this value)
    if(enemies.length == 0)
    {
        spawnTimer++;

        // projDelay and projCD are basically values that determine how fast enemies can attack after a 20 percentage decrease in delay making it faster
        if(spawnTimer >= spawnDeplay)
        {
            currentEnemies = Math.min(currentEnemies + enemiesAdded, maxEnemies);
            projDelay = Math.max(projDelay - cooldownDecrease, minProjDelay);
            projCD = projDelay;
            ResetEnemies(canvasWidth);
            spawnTimer = 0;
        }
    }
    else
    {
        spawnTimer = 0;
    }

    
}



export function initEnemies(canvasWidth) {
    // Formulas and their implementation determined through working with Google Gemini. Debugging is also present in the chat.
    // The conversation log can be found at: https://gemini.google.com/share/bb4e01533925
    // the logic will now have to be changed here to put the specific type of enemies to there designated rows. (This hasnt been started on)


    // creates an enemy one at a time, the rows and colums are calculated to determine how many enemies need to be added to the collection (array)
    // enemyCols is to visually see the spacing of the enemies because if you have maxCol varaible it forces the enemies to be more compacted by fitting them
    // so we set enemyCol to five to fit 5 enemies for each column, keeping the original spacing the same.
    // when enemies that are created are equal to the current enemies that are suppose to be on the field it stops generating enemies. It does this calculation before hand
    

    //Going to be working on the animation to where they spread out and back in the near future

    let enemiesCreated = 0;
    enemyCols = 5;
    enemyRows = Math.ceil(currentEnemies / enemyCols);

    var xStart = (canvasWidth - (canvasWidth * edgeMargin)) / 2;
    var horizStep = ((canvasWidth * edgeMargin) - enemyWidth) / (enemyCols - 1);
    var vertStep = enemyHeight + padding;

    for (let i = 0; i < enemyRows; i++) {
        for (let j = 0; j < enemyCols; j++) {
            

            if (enemiesCreated >= currentEnemies) 
            {
                return;
            }


            let randomEnemy = Math.floor(Math.random() * enemyState.length);

            enemies.push(
                {
                    x: xStart + (j * (horizStep)),
                    y: topMargin + enemyHeight + (vertStep * i),
                    width: enemyWidth,
                    height: enemyHeight,
                    type: enemyState[randomEnemy]
                });

                enemiesCreated++;
        }
    }

    

    const spawnCopy = spawnEnemies.cloneNode();
    spawnCopy.play();

     

}

// Updates each enemy that is passed into the functions' position 
export function UpdateEnemy(e) {
    // Checks the boundaries. Hardcoded the screen width for the moment, but plan to fix it to be based on the variable.
    let leftSpriteEdge = e.x;
    let rightSpriteEdge = e.x + enemySpriteWidth;

    if (
        leftSpriteEdge + enemySpeed <= 0 ||
        rightSpriteEdge + enemySpeed >= 400
    ) {
        enemySpeed *= -1;
    }
    else {
        e.x += enemySpeed;
    }
}

export function ResetEnemies(canvasWidth) {
    enemies.length = 0
    projectiles.length = 0;
    enemySpeed = 1;
    initEnemies(canvasWidth);
    BlinkEnemies();

    const spawnCopy = spawnEnemies.cloneNode();
    spawnCopy.play();
}

export function ResetEnemiesAfterGameOver(canvasWidth) {
    enemies.length = 0
    projectiles.length = 0;
    enemySpeed = 1;
    initEnemies(canvasWidth);

    const spawnCopy = spawnEnemies.cloneNode();
    spawnCopy.play();
}




export function BlinkEnemies()
{
    
    isBlinking = true; // it starts blinking immediaelty
    EnemyVulnerableTimer();


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
    }, enemyVulnerablity * 1000);
}

export function EnemyVulnerableTimer()
{
    isInvulnerable = true; 

    setTimeout(() => {
        isInvulnerable = false; 
    }, enemyVulnerablity * 1000);
}

// this function resets all enemies back to theire original values after game is over
export function ResetEnemiesAfterDeath()
{
    currentEnemies = startingEnemies;
    spawnTimer = 0;
    projDelay = 120;
    projCD = projDelay;
}

// Iteratively draw the enemies onto the gameplay area based on the amount of enemies in the array produced by initEnemies
// source for creating the shapes: https://chatgpt.com/share/69ec5cd2-9e2c-83ea-acc4-4bb5a12db495  the pyramid and circle with feet shape
export function DrawEnemy(ctx) {
    for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        UpdateEnemy(e);

        ctx.save();
        ctx.globalAlpha = isBlinking ? 0.2 : 1.0;


        if (e.type == "Diver") 
        {
            ctx.drawImage(diverSprite, e.x, e.y, enemySpriteWidth, enemySpriteHeight);
        }
        else if (e.type == "Shooter") 
        {
            ctx.drawImage(shooterSprite, e.x, e.y, enemySpriteWidth, enemySpriteHeight);
        }
        else 
        {
            ctx.drawImage(bothSprite, e.x, e.y, enemySpriteWidth, enemySpriteHeight)
        }

        ctx.restore();
    }
}

/* Projectile logic below. Heavily takes after that of projectile.js */
//Possible TODO: Refactor into own class or projectile?
export function DetermineAttacker(ctx) {
    for (let e of enemies)   // Iterate through each enemy, determine if they are going to fire or stay inactive. 
    {

        if (e.type == "Diver") {
            continue; // This is where the diving attack logic will be once its implemented. 
            // For now, Diver type enemies do not fire projectiles, 
            // so we skip to the next enemy in the array.
        }
        else if (e.type == "Shooter") {
            // Going to implement the shooting logic in this block.
            var firingChance;
            Math.floor(firingChance = Math.random() * 1000); // 2% chance to fire.
            if (firingChance > 980) {
                EnemyShoot(ctx, e.x, e.y, e.type);
                const laserShotCopy = laserShot.cloneNode();
                laserShotCopy.play();
                projCD = projDelay; // Reset cooldown timer.
                break;
            }

        }
        else {
            // Both have chance to either dive or shoot but since diving is not implemented yet, they will only shoot for now.
            var firingChance;
            Math.floor(firingChance = Math.random() * 1000); // 2% chance to fire.
            if (firingChance > 980) {
                EnemyShoot(ctx, e.x, e.y, e.type);
                const laserShotCopy = laserShot.cloneNode();
                laserShotCopy.play();
                projCD = projDelay; // Reset cooldown timer.
                break;
            }

            /*
            let randomAttack = Math.floor(Math.random() * 2) + 1;

            if(randomAttack == 1)
            {
                var firingChance;
                Math.floor(firingChance = Math.random() * 1000); // 2% chance to fire.
                if (firingChance > 980) {
                      EnemyShoot(ctx, e.x, e.y);
                     projCD = projDelay; // Reset cooldown timer.
                     break;
                }
            }
            else
            {
                diver logic
            }

            */
        }







    }
}

// Push the enemy's projectile onto the array.
export function EnemyShoot(ctx, enemyX, enemyY, enemyType) {
    projectiles.push({
        x: enemyX,
        y: enemyY,
        type: enemyType
    });
}

// Update the projectile to move it downwards across the canvas.
export function UpdateProjectile() {


    if (projCD != 0) {
        projCD -= 1;
    }
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].y += projSpeed;
    }
    projectiles = projectiles.filter(p => p.y < 800);
}

// Draw every projectile in the array.
// Changed it to where it shoots color bullets depending on which type the enemy is
export function DrawProjectile(ctx) {

    for (let p of projectiles) 
    {
        ctx.save();

        if(p.type == "Shooter")
        {
            ctx.fillStyle = "blue";
        }
        else
        {
            ctx.fillStyle = "red";
        }
        ctx.beginPath();
        ctx.rect(p.x, p.y, projW, projH);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }


}

export function ClearEnemyProjectiles() {
    projectiles = [];
}

// One method to integrate the enemy's projectile behavior.
export function EnemyProjBehavior(ctx) {
    if (isInvulnerable == true)
    {
        UpdateProjectile();
        DrawProjectile(ctx);
        return;
    }

    if (projCD === 0) // An enemy is randomly chosen after CD hits 0.
    {
        DetermineAttacker(ctx);
    }
    UpdateProjectile();
    DrawProjectile(ctx);
}

// Check to see if enemy projectile strikes the player. Return true if the player is hit.
export function EnemyCheckCollision(playerX, playerY, playerW, playerH) {
    for (let i = 0; i < projectiles.length; i++) {
        if (projectiles[i].x < playerX + playerW &&
            projectiles[i].x + projW > playerX &&
            projectiles[i].y < playerY + playerH &&
            projectiles[i].y + projH > playerY) {
            projectiles.splice(i, 1);
            return true;
        }
    }
}

export function EnemyVulnerableChecker()
{
    return isInvulnerable;
}