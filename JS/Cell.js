const arabicLetters = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
]

console.log(arabicLetters.length)
let teamOneColor ="rgb(0, 151, 18)"; 
let teamTwoColor ="rgb(255, 130, 0";

  function getRandomLetter() {
    const index = Math.floor(Math.random() * arabicLetters.length);
    return arabicLetters[index];
  }
  document.getElementById('randomBtn').addEventListener('click', () => {
    let cells = document.querySelectorAll('.hex');
    cells.forEach(cell => {
       // Reset letter
    cell.textContent = getRandomLetter();

    // Reset background color
    cell.style.backgroundColor = "white"; // ← your default .hex color

    // Reset state
    cell.dataset.state = "0";
    });
  });

  function getLetter() {}

  const board = document.getElementById("board");
  
  for (let row = 0; row < 5; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("hex-row");
    if (row % 2 !== 0) rowDiv.classList.add("offset");
    
    for (let col = 0; col < 5; col++) {
      const index = row * 5 + col;
      const hex = document.createElement("div");
      hex.classList.add("hex");
      hex.textContent = arabicLetters[index];
      rowDiv.appendChild(hex);
    }
  
    board.appendChild(rowDiv);
  }


  // a listenr when user want to change the color of a cell
  document.querySelectorAll('.hex').forEach(cell => {
    cell.dataset.state = "0"; // Start at state 0 (default)

    // Store the original color from CSS
    let defaultColor = getComputedStyle(cell).backgroundColor;
    cell.dataset.state = "0";

  
    cell.addEventListener('click', () => {
      let state = parseInt(cell.dataset.state);
  
      state = (state + 1) % 3; // Cycle between 0 → 1 → 2 → 0
  
      cell.dataset.state = state;
      
      if (state === 0) {
        cell.style.backgroundColor = defaultColor; // default
      } else if (state === 1) {
        cell.style.backgroundColor = teamOneColor; // green
      } else if (state === 2) {
        cell.style.backgroundColor = teamTwoColor; // blue
      }
    });
  });
  
  function getCellColor(cell) {
    return getComputedStyle(cell).backgroundColor;
  }
  
  