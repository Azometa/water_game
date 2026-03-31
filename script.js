const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const goalDisplay = document.getElementById("goalDisplay");
const difficultyDisplay = document.getElementById("difficultyDisplay");
const messageDisplay = document.getElementById("message");
const milestoneDisplay = document.getElementById("milestone");

const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

const cleanDrop = document.getElementById("cleanDrop");
const dirtyDrop = document.getElementById("dirtyDrop");
const gameArea = document.getElementById("gameArea");

const celebrationBox = document.getElementById("celebration");
const gameOverBox = document.getElementById("gameOverBox");

const difficultyButtons = document.querySelectorAll(".difficulty-btn");

const difficultySettings = {
  easy: {
    name: "Easy",
    time: 25,
    goal: 8,
    cleanMoveSpeed: 1200,
    dirtyMoveSpeed: 1700,
    penalty: 1
  },
  normal: {
    name: "Normal",
    time: 20,
    goal: 10,
    cleanMoveSpeed: 900,
    dirtyMoveSpeed: 1350,
    penalty: 1
  },
  hard: {
    name: "Hard",
    time: 15,
    goal: 13,
    cleanMoveSpeed: 650,
    dirtyMoveSpeed: 1000,
    penalty: 2
  }
};

const milestoneMessages = [
  { score: 3, text: "Nice start! Keep collecting clean drops." },
  { score: 5, text: "Great job! You are building momentum." },
  { score: 8, text: "Halfway there!" },
  { score: 10, text: "Amazing work! You are close to the goal." }
];

let selectedMode = "normal";
let score = 0;
let timeLeft = difficultySettings[selectedMode].time;
let goal = difficultySettings[selectedMode].goal;
let gameStarted = false;

let timerInterval = null;
let cleanMoveInterval = null;
let dirtyMoveInterval = null;

function updateBoard() {
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  goalDisplay.textContent = goal;
  difficultyDisplay.textContent = difficultySettings[selectedMode].name;
}

function clearGameIntervals() {
  clearInterval(timerInterval);
  clearInterval(cleanMoveInterval);
  clearInterval(dirtyMoveInterval);
}

function setDifficulty(mode) {
  if (gameStarted) return;

  selectedMode = mode;
  timeLeft = difficultySettings[mode].time;
  goal = difficultySettings[mode].goal;

  difficultyButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });

  updateBoard();
  milestoneDisplay.classList.add("hidden");
  milestoneDisplay.textContent = "";
  messageDisplay.textContent = `Difficulty set to ${difficultySettings[mode].name}. Press "Start Game" to begin.`;
}

function getDropSize(element) {
  return {
    width: element.offsetWidth || 78,
    height: element.offsetHeight || 96
  };
}

function getRandomPosition(element) {
  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;
  const { width, height } = getDropSize(element);

  const maxX = Math.max(0, areaWidth - width);
  const maxY = Math.max(0, areaHeight - height);

  return {
    x: Math.floor(Math.random() * (maxX + 1)),
    y: Math.floor(Math.random() * (maxY + 1))
  };
}

function moveElement(element) {
  const { x, y } = getRandomPosition(element);
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
}

function showMilestone() {
  const matched = milestoneMessages.find((item) => item.score === score);

  if (matched) {
    milestoneDisplay.textContent = matched.text;
    milestoneDisplay.classList.remove("hidden");
  }
}

function startGame() {
  if (gameStarted) return;

  gameStarted = true;
  score = 0;
  timeLeft = difficultySettings[selectedMode].time;
  goal = difficultySettings[selectedMode].goal;

  clearGameIntervals();

  celebrationBox.classList.add("hidden");
  gameOverBox.classList.add("hidden");
  milestoneDisplay.classList.add("hidden");
  milestoneDisplay.textContent = "";

  updateBoard();
  messageDisplay.textContent = "Game started! Click clean drops and avoid dirty droplets.";

  cleanDrop.classList.remove("hidden");
  dirtyDrop.classList.remove("hidden");

  moveElement(cleanDrop);
  moveElement(dirtyDrop);

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(score >= goal);
    }
  }, 1000);

  cleanMoveInterval = setInterval(() => {
    moveElement(cleanDrop);
  }, difficultySettings[selectedMode].cleanMoveSpeed);

  dirtyMoveInterval = setInterval(() => {
    moveElement(dirtyDrop);
  }, difficultySettings[selectedMode].dirtyMoveSpeed);
}

function endGame(didWin) {
  clearGameIntervals();
  gameStarted = false;

  cleanDrop.classList.add("hidden");
  dirtyDrop.classList.add("hidden");

  if (didWin) {
    celebrationBox.classList.remove("hidden");
    gameOverBox.classList.add("hidden");
    messageDisplay.textContent = "Excellent work! You reached the goal.";
  } else {
    celebrationBox.classList.add("hidden");
    gameOverBox.classList.remove("hidden");
    messageDisplay.textContent = "Time is up. Reset the game and try again.";
  }
}

function resetGame() {
  clearGameIntervals();
  gameStarted = false;
  score = 0;
  timeLeft = difficultySettings[selectedMode].time;
  goal = difficultySettings[selectedMode].goal;

  cleanDrop.classList.add("hidden");
  dirtyDrop.classList.add("hidden");
  celebrationBox.classList.add("hidden");
  gameOverBox.classList.add("hidden");
  milestoneDisplay.classList.add("hidden");
  milestoneDisplay.textContent = "";

  updateBoard();
  messageDisplay.textContent = 'Press "Start Game" to begin.';
}

cleanDrop.addEventListener("click", () => {
  if (!gameStarted) return;

  score += 1;
  scoreDisplay.textContent = score;

  showMilestone();
  moveElement(cleanDrop);

  if (score >= goal) {
    endGame(true);
  }
});

dirtyDrop.addEventListener("click", () => {
  if (!gameStarted) return;

  score -= difficultySettings[selectedMode].penalty;
  if (score < 0) score = 0;

  scoreDisplay.textContent = score;
  messageDisplay.textContent = "Oops! That was a dirty droplet.";
  moveElement(dirtyDrop);
});

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setDifficulty(button.dataset.mode);
  });
});

updateBoard();
