let score = 0;
let timeLeft = 20;
let gameStarted = false;
let gameEnded = false;
let timerInterval = null;

const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("message");
const dropButton = document.getElementById("dropButton");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const celebrationBox = document.getElementById("celebration");
const gameArea = document.querySelector(".game-area");

function updateScore() {
  scoreDisplay.textContent = score;
}

function updateTimer() {
  timerDisplay.textContent = timeLeft;
}

function showMessage(text) {
  messageDisplay.textContent = text;
}

function moveDropRandomly() {
  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;
  const buttonWidth = dropButton.offsetWidth;
  const buttonHeight = dropButton.offsetHeight;

  const maxX = areaWidth - buttonWidth - 10;
  const maxY = areaHeight - buttonHeight - 10;

  const randomX = Math.max(10, Math.floor(Math.random() * maxX));
  const randomY = Math.max(10, Math.floor(Math.random() * maxY));

  dropButton.style.left = `${randomX}px`;
  dropButton.style.top = `${randomY}px`;
}

function endGame() {
  gameEnded = true;
  gameStarted = false;
  clearInterval(timerInterval);
  dropButton.disabled = true;

  if (score >= 10) {
    showMessage("Amazing job! You collected enough water drops.");
    celebrationBox.classList.remove("hidden");
  } else {
    showMessage("Time is up. Try again and reach 10 points.");
    celebrationBox.classList.add("hidden");
  }
}

function startGame() {
  if (gameStarted) {
    return;
  }

  score = 0;
  timeLeft = 20;
  gameStarted = true;
  gameEnded = false;

  updateScore();
  updateTimer();
  showMessage("Game started! Click the water drop.");
  celebrationBox.classList.add("hidden");
  dropButton.disabled = false;
  moveDropRandomly();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function resetGame() {
  clearInterval(timerInterval);
  score = 0;
  timeLeft = 20;
  gameStarted = false;
  gameEnded = false;

  updateScore();
  updateTimer();
  showMessage('Press "Start Game" to begin.');
  celebrationBox.classList.add("hidden");
  dropButton.disabled = true;

  dropButton.style.left = "40%";
  dropButton.style.top = "35%";
}

dropButton.addEventListener("click", () => {
  if (!gameStarted || gameEnded) {
    return;
  }

  score++;
  updateScore();
  moveDropRandomly();

  if (score >= 10) {
    endGame();
  }
});

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

// Initial state
resetGame();
