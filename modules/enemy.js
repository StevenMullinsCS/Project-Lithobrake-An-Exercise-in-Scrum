export const name = "enemy";

let enemies = [];
// If enemy dimensions are too large, they may become clumped up depending on the number of rows and columns, be mindful of this when changing these variables.
var enemyWidth = 20;
var enemyHeight = 20;
var enemyRows = 5;
var enemyCols = 5;
var padding = 25;     // Adjusts the space between the enemies.
var topMargin = 25;   // Reserved free space at the top for UI elements.
var edgeMargin = .6;   // Determines how much area around the enemies is empty. The higher the percent, the smaller the margins get.
// var enemySpeed = 5;  // Will eventually be used for enemy movement.

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

// Iteratively draw the enemies onto the gameplay area based on the amount of enemies in the array produced by initEnemies
export function DrawEnemy(ctx) 
{
    
    for (let i = 0; i < enemies.length; i++)
    {
        const e = enemies[i];
        console.log(e);
        ctx.beginPath();
        ctx.rect(e.x, e.y, enemyWidth, enemyHeight);
        ctx.closePath();
        ctx.fill();
    }
}


