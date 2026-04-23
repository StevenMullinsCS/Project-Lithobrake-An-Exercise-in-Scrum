export const name = "projectile";
import { enemies } from "./enemy.js"

let projectiles = [];
let projOffset = 15;
let projY = 680;
let projSpeed = 10;
let projW = 10;
let projH = 20;

//push a projectile into the array 
export function Shoot(playerX) 
{
    projectiles.push({
        x: playerX + projOffset,
        y: projY
    });
}

//for every projectile, move it up the screen
export function UpdateProjectile() 
{


    for (let i = 0; i < projectiles.length; i++)
    {
        projectiles[i].y -= projSpeed;
    }

    //all projectiles on screen (i think idk i found it somewhere online)
    projectiles = projectiles.filter(p => p.y > 0);
}

//for every projectile in the array, draw them
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

export function CheckCollision()
{
    //checking every projectile with every enemy
    //not efficient in big scale, I'd say pretty ok to do here since projectiles will be limited
    for (let i = 0; i < projectiles.length; i++)
    {
        let p = projectiles[i];

        for (let j = 0; j < enemies.length; j++)
        {
            let e = enemies[j];

            if (
                p.x < e.x + e.width &&
                p.x + projW > e.x &&
                p.y < e.y + e.height &&
                p.y + projH > e.y
            ) {
                //js array manip is weird, splicing replaces the object in the array
                projectiles.splice(i, 1);
                enemies.splice(j, 1);
                break;
            }
        }
    }
}