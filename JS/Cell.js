// Your existing Arabic letters array
const arabicLetters = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

console.log(arabicLetters.length);
let teamOneColor = "rgb(0, 151, 18)";
let teamTwoColor = "rgb(255, 130, 0)";

// Function to shuffle and get unique letters
function getUniqueLetters(count) {
  const shuffled = [...arabicLetters].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Initialize or randomize the board
function updateBoard() {
  const cells = document.querySelectorAll('#board .hex'); // ✅ scoped to board only
  const uniqueLetters = getUniqueLetters(cells.length);
  
  cells.forEach((cell, index) => {
    cell.textContent = uniqueLetters[index];
    cell.style.backgroundColor = "white";
    cell.dataset.state = "0";
  });
}


// Create the initial board structure
function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let row = 0; row < 5; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("hex-row");
    if (row % 2 !== 0) rowDiv.classList.add("offset");

    for (let col = 0; col < 5; col++) {
      const hex = document.createElement("div");
      hex.classList.add("hex");
      rowDiv.appendChild(hex);
    }
    board.appendChild(rowDiv);
  }
  
  // Set initial unique letters
  updateBoard();
  
  
  // Add click listeners
  document.querySelectorAll('.hex').forEach(cell => {
    const defaultColor = getComputedStyle(cell).backgroundColor;
    cell.dataset.state = "0";

    cell.addEventListener('click', () => {
      const state = (parseInt(cell.dataset.state) + 1) % 3;
      cell.dataset.state = state;
      
      cell.style.backgroundColor = 
        state === 0 ? defaultColor :
        state === 1 ? teamOneColor : teamTwoColor;
    });
  });
}

// Initialize on page load
window.onload = function() {
  createBoard();

  // Randomize button
  document.getElementById('randomBtn').addEventListener('click', updateBoard);
  
  // Fireworks setup
  const container = document.getElementById('fireworks-container');
  const winBtn = document.getElementById('winBtn');
  
  if (container && winBtn && typeof Fireworks === "function") {
    const fireworks = new Fireworks(container, {
      // ... your existing fireworks config
    });
    
    winBtn.addEventListener('click', () => {
      fireworks.start();
      setTimeout(() => fireworks.stop(), 4000);
    });
  }
  
  // AI Popup setup
  const aiBtn = document.getElementById("aiBtn");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");
  
  if (aiBtn && popup && closePopup) {
    aiBtn.addEventListener("click", () => popup.classList.add("show"));
    closePopup.addEventListener("click", () => popup.classList.remove("show"));
  }
};

document.querySelectorAll('#popup .hexagonPopWindow').forEach(cell => {
  cell.dataset.state = "0"; // Initial state

  cell.addEventListener('click', () => {
    if (cell.dataset.state === "0") {
      cell.style.backgroundColor = "yellow";
      cell.dataset.state = "1";
    } else {
      cell.style.backgroundColor = "rgb(210, 75, 75)";
      cell.dataset.state = "0";
    }
  });
});
