export const name = "enemy";

let enemies = [];
export { enemies };
// If enemy dimensions are too large, they may become clumped up depending on the number of rows and columns, be mindful of this when changing these variables.
var enemyWidth = 25;
var enemyHeight = 25;
var enemyRows = 5;
var enemyCols = 5;
var padding = 25;     // Adjusts the space between the enemies.
var topMargin = 25;   // Reserved free space at the top for UI elements.
var edgeMargin = .6;   // Determines how much area around the enemies is empty. The higher the percent, the smaller the margins get.
var enemySpeed = 1; // Determines the speed at which the enemy moves.

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
            enemies.push(
            {
                x: xStart + (j * (horizStep)),
                y: topMargin + enemyHeight + (vertStep * i),
                width: enemyWidth,
                height: enemyHeight    
            });
        }
    }
}

// Updates each enemy that is passed into the functions' position 
// TODO: Enemy positions get weirdly misaligned as the sprites move down the screen. Likely a way to update them all in real time, will research, but currently it is functional.
export function UpdateEnemy(e)
{
    // Checks the boundaries. Hardcoded the screen width for the moment, but plan to fix it to be based on the variable.
    if(e.x + enemySpeed <= 0 || (e.x + enemyWidth) + enemySpeed >= 400)
    {
        // Once the sprite collides with an edge, we multiple by the speed by -1 to change the direction it is moves in.
        enemySpeed *= -1
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
        UpdateEnemy(e);
        ctx.beginPath();
        ctx.rect(e.x, e.y, enemyWidth, enemyHeight);
        ctx.closePath();
        ctx.fill();
    }
}
