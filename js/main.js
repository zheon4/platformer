const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game constants
const GRAVITY = 0.6;
const FRICTION = 0.8;

// Player object
const player = {
  x: 100,
  y: 300,
  width: 32,
  height: 32,
  vx: 0,
  vy: 0,
  speed: 5,
  jumpPower: -13,
  onGround: false,
  color: "#6339f0"
};

// Platforms array (x, y, width, height)
const platforms = [
  { x: 0, y: 460, width: 800, height: 40 },   // Ground floor
  { x: 200, y: 360, width: 150, height: 20 }, // Low platform
  { x: 450, y: 270, width: 150, height: 20 }, // Mid platform
  { x: 180, y: 180, width: 150, height: 20 }  // High platform
];

// Track pressed keys
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.code] = true));
window.addEventListener("keyup", (e) => (keys[e.code] = false));

const perFrameAccel = player.speed/12
function update() {
  // Horizontal movement
  if (keys["ArrowLeft"] || keys["KeyA"]) {
    player.vx = Math.max(player.vx - perFrameAccel, -player.speed);
  } else if (keys["ArrowRight"] || keys["KeyD"]) {
    player.vx = Math.min(player.vx +perFrameAccel, player.speed);
  } else {
    player.vx *= FRICTION; // Smooth stop
  }

  // Jumping
  if ((keys["Space"] || keys["ArrowUp"] || keys["KeyW"]) && player.onGround) {
    player.vy = player.jumpPower;
    player.onGround = false;
  }

  // Apply gravity
  player.vy += GRAVITY;

  // Update positions
  player.x += player.vx;
  player.y += player.vy;

  // Keep player inside left/right screen edges
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // Platform collision check (landing on top)
  player.onGround = false;
  for (const plat of platforms) {
    const isFalling = player.vy >= 0;
    const withinX = player.x + player.width > plat.x && player.x < plat.x + plat.width;
    const hitTop = player.y + player.height >= plat.y && player.y + player.height - player.vy <= plat.y;

    if (isFalling && withinX && hitTop) {
      player.y = plat.y - player.height;
      player.vy = 0;
      player.onGround = true;
    }
  }
}

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw platforms
  ctx.fillStyle = "#533483";
  for (const plat of platforms) {
    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
  }

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  ctx.fillStyle = "#030202";
  ctx.font = "16px monospace";
  ctx.fillText(`Position: (${Math.round(player.x)}, ${Math.round(player.y)})`, 15, 25);
  ctx.fillText(`Velocity: (${player.vx.toFixed(2)}, ${player.vy.toFixed(2)})`, 15, 45);
}

// Main 60fps game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
