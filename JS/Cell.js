// Arabic letters array
const arabicLetters = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ',
  'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق',
  'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

// Game state
const gameState = {
  teamOneColor: "rgb(0, 151, 18)",
  teamTwoColor: "rgb(255, 130, 0)",
  currentLetter: '',
  selectedCategories: [],
  usedLetters: []
};

// DOM Elements
const elements = {
  board: document.getElementById('board'),
  randomBtn: document.getElementById('randomBtn'),
  aiBtn: document.getElementById('aiBtn'),
  winBtn: document.getElementById('winBtn'),
  popup: document.getElementById('popup'),
  closePopup: document.getElementById('closePopup'),
  sendBtn: document.getElementById('send'),
  letterInput: document.getElementById('letterInput'),
  errorMsg: document.getElementById('errorMsg'),
  questionContainer: document.getElementById('questionContainer'), // Now matches
  checkboxes: document.querySelectorAll('.checkbox-input'),
  fireworksContainer: document.getElementById('fireworks-container')

};

// Initialize the game
function initGame() {
  createBoard();
  setupEventListeners();
}

// Create the game board
function createBoard() {
  elements.board.innerHTML = '';
  
  for (let row = 0; row < 5; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = `hex-row ${row % 2 ? 'offset' : ''}`;
    
    for (let col = 0; col < 5; col++) {
      const hex = document.createElement('div');
      hex.className = 'hex';
      hex.addEventListener('click', handleHexClick);
      rowDiv.appendChild(hex);
    }
    elements.board.appendChild(rowDiv);
  }
  updateBoard();
}

// Update board with random letters
function updateBoard() {
  const availableLetters = arabicLetters.filter(letter => !gameState.usedLetters.includes(letter));
  const letters = [...availableLetters]
    .sort(() => 0.5 - Math.random())
    .slice(0, 25);
  
  document.querySelectorAll('#board .hex').forEach((hex, i) => {
    hex.textContent = letters[i] || '';
    hex.style.backgroundColor = 'white';
    hex.dataset.state = '0';
  });
}

// Handle hexagon clicks
function handleHexClick(e) {
  const states = ['white', gameState.teamOneColor, gameState.teamTwoColor];
  const currentState = parseInt(e.target.dataset.state);
  const nextState = (currentState + 1) % 3;
  
  e.target.dataset.state = nextState;
  e.target.style.backgroundColor = states[nextState];
}

// Setup all event listeners
function setupEventListeners() {
  // Randomize button
  elements.randomBtn.addEventListener('click', updateBoard);
  
  // AI Popup
  elements.aiBtn.addEventListener('click', () => elements.popup.classList.add('show'));
  elements.closePopup.addEventListener('click', () => elements.popup.classList.remove('show'));
  
  // Letter input validation
  elements.letterInput.addEventListener('input', (e) => {
    const value = e.target.value;
    const arabicLetter = value.replace(/[^أ-ي]/g, "");
    e.target.value = arabicLetter;
    if (arabicLetter.length > 1) showError("🚫 حرف واحد فقط!");
    else elements.errorMsg.style.display = 'none';
  });
  
  // Send button (form submission)
  elements.sendBtn.addEventListener('click', handleFormSubmission);
  
  // Fireworks
  setupFireworks();
}

// Handle form submission
async function handleFormSubmission() {

  if (!elements.questionContainer) {
    showError("System error: Missing question display area");
    return;
  }

  if (!validateForm()) return;

  gameState.currentLetter = elements.letterInput.value;
  gameState.selectedCategories = Array.from(elements.checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.dataset.category);

  try {
    setLoadingState(true);
    const questions = await getQuestionsFromDeepSeek();
    displayQuestions(questions);
    resetForm();
    
    // Mark letter as used
    gameState.usedLetters.push(gameState.currentLetter);
    updateBoard();
  } catch (error) {
    showError("فشل في الحصول على الأسئلة: " + error.message);
  } finally {
    setLoadingState(false);
  }
}

// Validate form inputs
function validateForm() {
  if (!elements.letterInput.value) {
    showError("🚫 الرجاء إدخال حرف");
    return false;
  }
  
  // if (gameState.usedLetters.includes(elements.letterInput.value)) {
  //   showError("🚫 هذا الحرف مستخدم بالفعل");
  //   return false;
  // }
  
  if (![...elements.checkboxes].some(cb => cb.checked)) {
    showError("🚫 الرجاء اختيار فئة واحدة على الأقل");
    return false;
  }
  
  return true;
}

// Display questions in container
// Modified display function to show Q&A
function displayQuestions(questions) {
  if (!elements.questionContainer) {
    console.error("Question container element not found!");
    return;
  }

  let html = '<h3>الأسئلة والأجوبة:</h3>';
  
  if (Array.isArray(questions)) {
    questions.forEach((item, index) => {
      html += `
        <div class="qna-item">
          <p><strong>${index + 1}. ${item.question}</strong></p>
          <p class="answer"><em>الجواب: ${item.answer || 'لا يوجد جواب'}</em></p>
        </div>
      `;
    });
  } else {
    html += `<p>${questions}</p>`;
  }

  elements.questionContainer.innerHTML = html;
}

// Get questions from DeepSeek API
async function getQuestionsFromDeepSeek() {
  const prompt = `
  أنت مساعد ذكي في إعداد أسئلة مسابقات باللغة العربية.
  
  مطلوب منك توليد 3 أسئلة وأجوبة، بحيث:
  
  1. يكون الحرف المستهدف هو: "${gameState.currentLetter}"
  2. تحتوي **صيغة السؤال** على شيء يبدأ بهذا الحرف (مثلاً: "مدينة تبدأ بحرف م").
  3. ويجب أن تبدأ **الإجابة** أيضًا بنفس الحرف "${gameState.currentLetter}".
  4. تجاهل "ال" التعريف عند الحكم على الحرف (مثال: "المدينة" تعتبر من "م").
  5. يجب أن تكون الإجابة قصيرة، من كلمتين كحد أقصى.
  6.  تتنوع المواضيع بين: "${gameState.selectedCategories}.
  7. أرجع الناتج بصيغة JSON بهذا الشكل:
  
  [
    {
      "question": "ما اسم نبي يبدأ بحرف م وذُكر في القرآن؟",
      "answer": "محمد"
    },
    {
      "question": "ما اسم مدينة مقدسة تبدأ بحرف م؟",
      "answer": "مكة"
    },
    {
      "question": "ما اسم أكلة شعبية تبدأ بحرف م وتُطبخ في الخليج؟",
      "answer": "مجبوس"
    },
    {
      "question": "ما اسم غزوة شهيرة تبدأ بحرف م وقعت في الإسلام؟",
      "answer": "مؤتة"
    },
    {
      "question": "ما اسم حيوان بحرف م يعيش في الغابة؟",
      "answer": "مها"
    }
  ]
  `;
  


  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'API key' // 🔴 Replace with your key
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) throw new Error("API request failed");
    
    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    return content.questions || content; // Handle different response formats

  } catch (error) {
    console.error("API Error:", error);
    // Fallback data
    return [
      {
        question: `ما أشهر نبات يبدأ بحرف ${gameState.currentLetter}؟`,
        answer: "الجواب النموذجي هنا"
      }
    ];
  }
}

// Modified display function to show Q&A
function displayQuestions(qnaPairs) {
  elements.questionContainer.innerHTML = '<h3>الأسئلة والأجوبة:</h3>';
  
  const list = document.createElement('div');
  qnaPairs.forEach((item, index) => {
    const qnaElement = document.createElement('div');
    qnaElement.className = 'qna-item';
    qnaElement.innerHTML = `
      <p><strong>السؤال ${index + 1}:</strong> ${item.question}</p>
      <p class="answer"><strong>الجواب:</strong> ${item.answer}</p>
    `;
    list.appendChild(qnaElement);
  });
  
  elements.questionContainer.appendChild(list);
}

// Fireworks setup
function setupFireworks() {
  if (typeof Fireworks === 'function' && elements.fireworksContainer) {
    const fireworks = new Fireworks({
      target: elements.fireworksContainer,
      hue: { min: 0, max: 360 },
      acceleration: 1.05,
      brightness: { min: 50, max: 80 },
      decay: { min: 0.015, max: 0.03 },
      delay: { min: 30, max: 60 }
    });
    
    elements.winBtn.addEventListener('click', () => {
      fireworks.start();
      setTimeout(() => fireworks.stop(), 4000);
    });
  }
}

// Helper functions
function showError(msg) {
  elements.errorMsg.textContent = msg;
  elements.errorMsg.style.display = 'block';
  
  // Shake animation
  elements.errorMsg.classList.remove('shake');
  void elements.errorMsg.offsetWidth;
  elements.errorMsg.classList.add('shake');
  console.log(msg)
}

function setLoadingState(isLoading) {
  elements.sendBtn.disabled = isLoading;
  elements.sendBtn.textContent = isLoading ? 'جاري الإرسال...' : 'إرسال';
}

function resetForm() {
  elements.popup.classList.remove('show');
  elements.letterInput.value = '';
  elements.checkboxes.forEach(cb => cb.checked = false);
  elements.errorMsg.style.display = 'none';
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// At the bottom of your JS:
document.addEventListener('DOMContentLoaded', () => {
  // Verify element exists
  if (!document.getElementById('questionContainer')) {
    console.error("Critical: Question container missing from DOM");
    return;
  }
  initGame();
});


window.addEventListener('resize', () => {
  console.log("Window width: ", window.innerWidth);
});

console.log("Initial width: ", window.innerWidth);
