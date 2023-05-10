// Define game constants
const BLOCK_SIZE = 20;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;
const SNAKE_SPEED = 100; // in milliseconds
const DIRECTIONS = {
  37: { x: -1, y: 0 }, // left arrow
  38: { x: 0, y: -1 }, // up arrow
  39: { x: 1, y: 0 }, // right arrow
  40: { x: 0, y: 1 } // down arrow
};

// Define game variables
let canvas;
let ctx;
let snake;
let food;
let score;

// Define game objects
class Snake {
  constructor() {
    this.body = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }];
    this.direction = DIRECTIONS[39]; // start moving right
  }

  move() {
    // Get current head position
    let head = this.body[0];

    // Create new head position based on direction
    let newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y
    };

    // Add new head to beginning of body
    this.body.unshift(newHead);

    // Remove tail if snake did not eat food
    if (!this.ateFood) {
      this.body.pop();
    } else {
      this.ateFood = false;
    }
  }

  ateFood() {
    // Check if head of snake is on the same position as the food
    let head = this.body[0];
    return head.x === food.x && head.y === food.y;
  }

  draw() {
    this.body.forEach(block => {
      ctx.fillStyle = "green";
      ctx.fillRect(
        block.x * BLOCK_SIZE,
        block.y * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE
      );
    });
  }

  checkCollision() {
    // Check if snake collided with wall
    let head = this.body[0];
    if (
      head.x < 0 ||
      head.x >= GAME_WIDTH / BLOCK_SIZE ||
      head.y < 0 ||
      head.y >= GAME_HEIGHT / BLOCK_SIZE
    ) {
      return true;
    }

    // Check if snake collided with itself
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }

    return false;
  }
}

class Food {
  constructor() {
    this.spawn();
  }

  spawn() {
    // Generate random position for food
    this.x = Math.floor(Math.random() * (GAME_WIDTH / BLOCK_SIZE));
    this.y = Math.floor(Math.random() * (GAME_HEIGHT / BLOCK_SIZE));
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.x * BLOCK_SIZE,
      this.y * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  }
}

// Handle keyboard input
function handleKeyDown(event) {
  // Change direction of snake based on key pressed
  let newDirection = DIRECTIONS[event.keyCode];
  if (newDirection) {
    snake.direction = newDirection;
  }
}


// Main game loop
function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Move snake
  snake.move();

  // Check for collision
  if (snake.checkCollision()) {
    // End game
    clearInterval(gameInterval);
    alert("Game over!");
    return;
  }

  // Check if snake ate food
  if (snake.ateFood()) {
    // Spawn new food
    food.spawn();

    // Update score
    score++;
  }

  // Draw game objects
  food.draw();
  snake.draw();

  // Update score display
  document.getElementById("score").innerHTML = "Score: " + score;
}

// Initialize game
function init() {
  // Get canvas element
  canvas = document.getElementById("canvas");

  // Set canvas dimensions
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;

  // Get canvas context
  ctx = canvas.getContext("2d");

  // Create game objects
  snake = new Snake();
  food = new Food();
  score = 0;

  // Set up keyboard input
  document.addEventListener("keydown", handleKeyDown);

  // Start game loop
  gameInterval = setInterval(gameLoop, SNAKE_SPEED);
}

// Start game when page loads
window.onload = init;
