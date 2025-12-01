// ------------------------------
// ELEMENT REFERENCES
// ------------------------------
const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");

const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".Game-over");

const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");

// ------------------------------
// GRID CONFIG
// ------------------------------
const blockSize = 50; // Each grid cell = 50px

const cols = Math.floor(board.clientWidth / blockSize);
const rows = Math.floor(board.clientHeight / blockSize);

// Store blocks using keys like "row,col"
const blocks = {};

// ------------------------------
// GAME STATE VARIABLES
// ------------------------------
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let time = "00-00";

let snake = [{ x: 1, y: 3 }]; // Snake starting position
let direction = "right";

let foodPosition = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let movementInterval = null;
let timerInterval = null;

highScoreElement.innerText = highScore;

// ------------------------------
// CREATE GRID BOARD
// ------------------------------
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);

    blocks[`${r},${c}`] = block;
  }
}

// ------------------------------
// RENDER FUNCTION — Moves Snake
// ------------------------------
function render() {
  // Mark food
  blocks[`${foodPosition.x},${foodPosition.y}`].classList.add("food-color");

  // Determine new snake head position based on direction
  let head = { ...snake[0] };

  if (direction === "left") head.y--;
  if (direction === "right") head.y++;
  if (direction === "up") head.x--;
  if (direction === "down") head.x++;

  // ------------------------------
  // BORDER COLLISION → GAME OVER
  // ------------------------------
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(movementInterval);
    clearInterval(timerInterval);

    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }

  // ------------------------------
  // FOOD EATEN
  // ------------------------------
  if (head.x === foodPosition.x && head.y === foodPosition.y) {
    // Remove old food from board
    blocks[`${foodPosition.x},${foodPosition.y}`].classList.remove("food-color");

    // Create new food
    foodPosition = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };

    // Grow snake (no tail pop)
    snake.unshift(head);

    // Update score
    score += 10;
    scoreElement.innerText = score;

    // Update high score if beaten
    if (score > highScore) {
      highScore = score;
      highScoreElement.innerText = highScore;
      localStorage.setItem("highScore", highScore);
    }
  } else {
    // Normal movement → move head + remove tail
    snake.unshift(head);
    snake.pop();
  }

  // ------------------------------
  // DRAW SNAKE
  // ------------------------------
  document.querySelectorAll(".fill-color").forEach((b) =>
    b.classList.remove("fill-color")
  );

  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.add("fill-color");
  });
}

// ------------------------------
// TIMER FUNCTION
// ------------------------------
function startTimer() {
  timerInterval = setInterval(() => {
    let [m, s] = time.split("-").map(Number);

    if (s === 59) {
      m++;
      s = 0;
    } else {
      s++;
    }

    time = `${m}-${s}`;
    timeElement.innerText = time;
  }, 1000);
}

// ------------------------------
// START GAME BUTTON
// ------------------------------
startButton.addEventListener("click", () => {
  modal.style.display = "none";

  movementInterval = setInterval(render, 300);
  startTimer();
});

// ------------------------------
// RESTART GAME BUTTON
// ------------------------------
restartButton.addEventListener("click", restartGame);

function restartGame() {
  // Clear old intervals
  clearInterval(movementInterval);
  clearInterval(timerInterval);

  // Reset states
  snake = [{ x: 1, y: 3 }];
  direction = "right";
  score = 0;
  time = "00-00";

  scoreElement.innerText = score;
  timeElement.innerText = time;

  // Spawn new food
  blocks[`${foodPosition.x},${foodPosition.y}`].classList.remove("food-color");
  foodPosition = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  // Hide modal
  modal.style.display = "none";

  // Restart game
  movementInterval = setInterval(render, 300);
  startTimer();
}

// ------------------------------
// KEYBOARD CONTROLS
// ------------------------------
addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "down") direction = "up";
  if (event.key === "ArrowDown" && direction !== "up") direction = "down";
  if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (event.key === "ArrowRight" && direction !== "left") direction = "right";
});

// Initial board draw
render();
