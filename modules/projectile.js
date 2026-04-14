export const name = "projectile";

let projectiles = [];

//push a projectile into the array 
export function Shoot(playerX) 
{
    projectiles.push({
        x: playerX + 10,
        y: 680
    });
}

//for every projectile, move it up the screen
export function UpdateProjectile() 
{
    for (let i = 0; i < projectiles.length; i++)
    {
        projectiles[i].y -= 10;
    }

    //all projectiles on screen (i think idk i found it somewhere online)
    projectiles = projectiles.filter(p => p.y > 0);
}

//for every projectile in the array, draw them
export function DrawProjectile(ctx) 
{
    for (let p of projectiles)
    {
        ctx.beginPath();
        ctx.rect(p.x, p.y, 10, 20);
        ctx.closePath();
        ctx.fill();
    }
}