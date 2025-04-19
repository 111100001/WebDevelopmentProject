const arabicLetters = [
    "ب", "د", "و", "ص", "ق",
    "ث", "ه", "ض", "ي", "ح",
    "م", "ز", "ش", "ط", "ك",
    "ث", "ظ", "س", "ر", "أ",
    "ج", "ع", "هـ", "غ", "ذ"
  ];
  
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
  