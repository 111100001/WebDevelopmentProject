
  // Your existing Arabic letters array
const arabicLetters = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

console.log(arabicLetters.length);
let teamOneColor = "rgb(0, 151, 18)";
let teamTwoColor = "rgb(255, 130, 0)";

function getRandomLetterHexa() {
  const index = Math.floor(Math.random() * arabicLetters.length);
  return arabicLetters[index];
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.getElementById('randomBtn').addEventListener('click', () => {
  let cells = document.querySelectorAll('.hex');
  cells.forEach(cell => {
    // Reset letter
    cell.textContent = getRandomLetterHexa();

    // Reset background color
    cell.style.backgroundColor = "white";

    // Reset state
    cell.dataset.state = "0";
  });
});

const board = document.getElementById("board");

// Create a shuffled copy of the letters array
let shuffledLetters = [...arabicLetters];
shuffleArray(shuffledLetters);

for (let row = 0; row < 5; row++) {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("hex-row");
  if (row % 2 !== 0) rowDiv.classList.add("offset");

  for (let col = 0; col < 5; col++) {
    const index = row * 5 + col;
    const hex = document.createElement("div");
    hex.classList.add("hex");
    // Use the shuffled letters instead of ordered ones
    hex.textContent = shuffledLetters[index % shuffledLetters.length];
    rowDiv.appendChild(hex);
  }

  board.appendChild(rowDiv);
}

// The rest of your existing code remains the same...
document.querySelectorAll('.hex').forEach(cell => {
  cell.dataset.state = "0";
  let defaultColor = getComputedStyle(cell).backgroundColor;
  cell.dataset.state = "0";

  cell.addEventListener('click', () => {
    let state = parseInt(cell.dataset.state);
    state = (state + 1) % 3;
    cell.dataset.state = state;

    if (state === 0) {
      cell.style.backgroundColor = defaultColor;
    } else if (state === 1) {
      cell.style.backgroundColor = teamOneColor;
    } else if (state === 2) {
      cell.style.backgroundColor = teamTwoColor;
    }
  });
});

function getCellColor(cell) {
  return getComputedStyle(cell).backgroundColor;
}

window.onload = function () {
  const container = document.getElementById('fireworks-container');
  const winBtn = document.getElementById('winBtn');

  if (!container || !winBtn || typeof Fireworks !== "function") {
    console.error("Fireworks.js not loaded or elements not found");
    return;
  }

  const fireworks = new Fireworks(container, {
    autoresize: true,
    opacity: 0.5,
    acceleration: 1.05,
    friction: 0.97,
    gravity: 1.5,
    particles: 100,
    trace: 3,
    explosion: 5,
    intensity: 30,
    flickering: 50,
    hue: {
      min: 0,
      max: 360
    }
  });}

  winBtn.addEventListener('click', () => {
    fireworks.start();
    setTimeout(() => fireworks.stop(), 4000);
  });


 //Ai part

window.onload = function () {
  const aiBtn = document.getElementById("aiBtn");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");

  aiBtn.addEventListener("click", () => {
    popup.classList.add("show");

  });

  closePopup.addEventListener("click", () => {
    popup.classList.remove("show");
  });
};