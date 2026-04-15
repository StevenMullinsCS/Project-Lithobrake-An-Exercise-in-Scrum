export const name = "enemy";

// TODO: Correct variable names to follow coding standards.
// var enemyX = 5;
// var enemyY = 690;
var enemyWidth = 20;
var enemyHeight = 20;
var enemyRows = 5;
var enemyCols = 5;
var enemyOffset = 1;    // WIP, baseline variable for padding/offset formula between enemies.
// var enemySpeed = 5;  // Will eventually be used for enemy movement.


// Credit to BillMill's Breakout course in helping lead me in the right direction to start, specficially in row and column spawning.
export function DrawEnemy(ctx, canvasWidth)
{
    // Used to determine the offset based on the number of columns.
    // TODO: Make stay on screen consistently.
    // TODO: Refine formula to work off of a more centered starting position.
    enemyOffset = canvasWidth / enemyCols;
    
    // This loop creates rows.
    for (let i = 0; i < enemyRows; i++)
    {
        // This loop creates columns.
        for (let j = 0; j < enemyCols; j++)
        {
            ctx.beginPath();
            // TODO: Figure out how to do the offset for the Y axis.
            ctx.rect(20 + (enemyOffset * j), 5 + i, enemyWidth, enemyHeight)
            ctx.closePath();
            ctx.fill();
        }
    }
}

