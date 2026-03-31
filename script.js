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
    dirtyMoveSpeed: 1800,
    dirtyPenalty: 1
  },
  normal: {
    name: "Normal",
    time: 20,
    goal: 10,
    cleanMoveSpeed: 900,
    dirtyMoveSpeed: 1400,
    dirtyPenalty: 1
  },
  hard: {
    name: "Hard",
    time: 15,
    goal: 13,
    cleanMoveSpeed: 700,
    dirtyMoveSpeed: 1000,
    dirtyPenalty: 2
  }
};

const milestoneMessages = [
  { score: 3, text: "Nice start! Keep collecting clean water." },
  { score: 5, text: "Great job! You're building momentum." },
  { score: 8, text: "Halfway there!" },
  { score: 10, text: "Amazing work! You're close to the goal." }
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

function getRandomPosition(buttonSize = 82) {
  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;

  const maxX = areaWidth - buttonSize;
  const maxY = areaHeight - buttonSize;

  const x = Math.floor(Math.random() * Math.max(maxX, 1));
  const y = Math.floor(Math.random() * Math.max(maxY, 1));

  return { x, y };
}

function positionElement(element, buttonSize = 82) {
  const { x, y } = getRandomPosition(buttonSize);
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
}

function showMilestone() {
  const foundMilestone = milestoneMessages.find((item) => item.score === score);

  if (foundMilestone) {
    milestoneDisplay.textContent = foundMilestone.text;
    milestoneDisplay.classList.remove("hidden");
  }
}

function startGame() {
  if (gameStarted) return;

  gameStarted = true;
  score = 0;
  timeLeft = difficultySettings[selectedMode].time;
  goal = difficultySettings[selectedMode].goal;

  celebrationBox.classList.add("hidden");
  gameOverBox.classList.add("hidden");
  milestoneDisplay.classList.add("hidden");
  milestoneDisplay.textContent = "";

  updateBoard();
  messageDisplay.textContent =
    "Game started! Click clean drops and avoid dirty droplets.";

  cleanDrop.classList.remove("hidden");
  dirtyDrop.classList.remove("hidden");

  positionElement(cleanDrop);
  positionElement(dirtyDrop);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(score >= goal);
    }
  }, 1000);

  cleanMoveInterval = setInterval(() => {
    positionElement(cleanDrop);
  }, difficultySettings[selectedMode].cleanMoveSpeed);

  dirtyMoveInterval = setInterval(() => {
    positionElement(dirtyDrop);
  }, difficultySettings[selectedMode].dirtyMoveSpeed);
}

function endGame(didWin) {
  clearInterval(timerInterval);
  clearInterval(cleanMoveInterval);
  clearInterval(dirtyMoveInterval);

  gameStarted = false;

  cleanDrop.classList.add("hidden");
  dirtyDrop.classList.add("hidden");

  if (didWin) {
    celebrationBox.classList.remove("hidden");
    gameOverBox.classList.add("hidden");
    messageDisplay.textContent =
      "Excellent work! You reached the clean water goal.";
  } else {
    celebrationBox.classList.add("hidden");
    gameOverBox.classList.remove("hidden");
    messageDisplay.textContent =
      "Time is up. Reset the game and try again.";
  }
}

function resetGame() {
  clearInterval(timerInterval);
  clearInterval(cleanMoveInterval);
  clearInterval(dirtyMoveInterval);

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

  positionElement(cleanDrop);
  showMilestone();

  if (score >= goal) {
    endGame(true);
  }
});

dirtyDrop.addEventListener("click", () => {
  if (!gameStarted) return;

  score -= difficultySettings[selectedMode].dirtyPenalty;

  if (score < 0) {
    score = 0;
  }

  scoreDisplay.textContent = score;
  messageDisplay.textContent =
    "Oops! That was a dirty droplet. Avoid those.";

  positionElement(dirtyDrop);
});

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setDifficulty(button.dataset.mode);
  });
});

updateBoard();
