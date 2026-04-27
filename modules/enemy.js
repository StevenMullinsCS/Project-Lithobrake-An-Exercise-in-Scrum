export const name = "enemy";

/* Enemy Variables */
let enemies = [];
export { enemies };
var enemyWidth = 25; // If enemy dimensions are too large, they may become clumped up depending on the number of rows and columns, be mindful of this when changing these variables.
var enemyHeight = 25;
var enemyRows = 5;
var enemyCols = 5;
var padding = 25;     // Adjusts the space between the enemies.
var topMargin = 25;   // Reserved free space at the top for UI elements.
var edgeMargin = .6; // Determines how much area around the enemies is empty. The higher the percent, the smaller the margins get.
var enemySpeed = 1; // Determines the speed at which the enemy moves.
var enemyType = "";
var extra = Math.floor(Math.random() * 3); // Used to determine which enemy type gets an extra enemy. Outside of loop to avoid it getting reset.
/* Projectile Variables */
let projectiles = []; 
let projOffset = 15; 
let projSpeed = 10;
let projW = 2.5; 
let projH = 25;
let projDelay = 120; // Cooldown logic. This is galaga, not a bullet hell, so we only want one projectile launched at a time, at least for now.
let projCD = projDelay; // projCD iteratively is reduced, but is set/reset to projDelay after hitting 0.

export function initEnemies(canvasWidth) {
    // Formulas and their implementation determined through working with Google Gemini. Debugging is also present in the chat.
    // The conversation log can be found at: https://gemini.google.com/share/bb4e01533925
    var xStart = (canvasWidth - (canvasWidth * edgeMargin)) / 2;
    var horizStep = ((canvasWidth * edgeMargin) - enemyWidth) / (enemyCols - 1);
    for (let i = 0; i < enemyRows; i++)
    {   
        for (let j = 0; j < enemyCols; j++)
        {
            var vertStep = enemyHeight + padding;
            let type = EnemySetType(i, extra);
            enemies.push(
            {
                x: xStart + (j * (horizStep)),
                y: topMargin + enemyHeight + (vertStep * i),
                width: enemyWidth,
                height: enemyHeight,
                enemyType: type
            });
        }
    }
}

// Updates each enemy that is passed into the functions' position 
export function UpdateEnemy(e)
{
    // Checks the boundaries. Hardcoded the screen width for the moment, but plan to fix it to be based on the variable.
    if(e.x + enemySpeed <= 0 || (e.x + enemyWidth) + enemySpeed >= 400)
    {
        // Once the sprite collides with an edge, we multiple by the speed by -1 to change the direction it is moves in.
        enemySpeed *= -1;
    }
    else
    {
        // Moves the enemy along the X axis at a rate defined in the enemySpeed variable if the enemy is not at the edge.
        e.x += enemySpeed;
    }
}

// Iteratively draw the enemies onto the gameplay area based on the amount of enemies in the array produced by initEnemies
export function DrawEnemy(ctx) 
{
    for (let i = 0; i < enemies.length; i++)
    {
        const e = enemies[i];
        var color; // Added for debugging.
        UpdateEnemy(e);
        switch(e.enemyType) // Here, the actual enemy sprites will be applied. Color changing is only here for the sake of debugging, testing.
        {
        case "S":
            color = "rgb(255, 0, 0)";
            break;
        case "D":
            color = "rgb(0, 255, 0)";
            break;
        case "M":
            color = "rgb(0, 0, 255)";
            break;
        case "":
            color= "rgb(243, 239, 239)";
            break;
        }   
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(e.x, e.y, enemyWidth, enemyHeight);
        ctx.closePath();
        ctx.fill();
    }
}

/* Projectile logic below. Heavily takes after that of projectile.js */
//Possible TODO: Refactor into own class or projectile?
export function DetermineAttacker(ctx)
{
    for(let e of enemies)   // Iterate through each enemy, determine if they are going to fire or stay inactive. 
    {
        var firingChance;
        Math.floor(firingChance = Math.random() * 1000); // 2% chance to fire.
        if(firingChance > 980)
        {
            EnemyShoot(ctx, e.x, e.y);
            projCD = projDelay; // Reset cooldown timer.
            break;
        }
    }
}

// Push the enemy's projectile onto the array.
export function EnemyShoot(ctx, enemyX, enemyY)
{
            projectiles.push({
                x: enemyX,
                y: enemyY
            });

}

// Update the projectile to move it downwards across the canvas.
export function UpdateProjectile()
{
    if(projCD != 0)
    {   
        projCD -= 1;
    }
    for(let i = 0; i < projectiles.length; i++)
    {
        projectiles[i].y += projSpeed;
    }
    projectiles = projectiles.filter(p => p.y < 800);
}

// Draw every projectile in the array.
export function DrawProjectile(ctx)
{
    for(let p of projectiles)
    {
        ctx.beginPath();
        ctx.rect(p.x, p.y, projW, projH);
        ctx.closePath();
        ctx.fill();
    }
}

export function  EnemySetType(i, extra)
{
    // Individual Variables for rows
    var shooterRows; 
    var diverRows;
    var multiAttackRows;
    // If rows are not divisible by 3, we will set a row type to randomly have an extra row.
    if(enemyRows % 3 != 0)
    {
        // Row calculations for other rows only done once, then rounded in logic.
        var otherRows = enemyRows / 3;
        if(extra == 0)
        {
            // Divers gets remainder
            shooterRows = Math.ceil(otherRows); // One value gets rounded up,
            multiAttackRows = Math.floor(otherRows); // One gets rounded down.
            // The above calcs ensure that the remainders get split in a way that still ensures on smaller numbers, like 4, that there is one extra, but as it scales up, there isnt one absurdly large block of extras for one type.
            diverRows = enemyRows - (shooterRows + multiAttackRows); // Randomly selected value gets whatevers left to add.
        }
        else if(extra == 1)
        {
            // Multis gets remainder   
            shooterRows = Math.ceil(otherRows);
            diverRows = Math.floor(enemyRows / 3);
            multiAttackRows = enemyRows - (shooterRows + diverRows);
        }
        else
        {
            // Shooters gets remainder
            diverRows = Math.ceil(otherRows); 
            multiAttackRows = Math.floor(otherRows);
            shooterRows = enemyRows - (diverRows + multiAttackRows);
        }
    }
    else 
    {
        // If the number of rows is divisible by 3, we can have even numbered rows. Variable used just so calculation is performed once, not repeated for performance sake.
        var rows = enemyRows / 3;
        shooterRows = rows;
        diverRows = rows;
        multiAttackRows = rows; 
    }
    if(i < shooterRows) // Follows the iteration of the initEnemies loop to ensure that the rows are properly assigned.
    {
        return "S"; // Shooters
    }
    if(i < diverRows + shooterRows) // We add what has been iterated through to avoid it never checking these conditions. We do this again for "M". 
    {
        return "D"; // Divers
    }
    if(i < multiAttackRows + diverRows + shooterRows)
    {
        return "M"; // Multiattackers
    }
}

// One method to integrate the enemy's projectile behavior.
export function EnemyProjBehavior(ctx)
{   
    // TODO: Add logic for running enemy attack type based on the enemy type.
    if(projCD === 0) // An enemy is randomly chosen after CD hits 0.
    {
        DetermineAttacker(ctx);
    }
    UpdateProjectile();
    DrawProjectile(ctx);
}

// Check to see if enemy projectile strikes the player. Return true if the player is hit.
export function EnemyCheckCollision(playerX, playerY, playerW, playerH)
{
    for(let i = 0; i < projectiles.length; i++)
    {
        if(projectiles[i].x < playerX  + playerW && 
           projectiles[i].x + projW > playerX &&
           projectiles[i].y < playerY + playerH &&
           projectiles[i].y + projH > playerY)
        {
            projectiles.splice(i, 1);
            return true;
        }
    }
}