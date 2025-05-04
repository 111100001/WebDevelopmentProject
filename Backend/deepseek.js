//get references
const input = document.getElementById("letterInput");
const error = document.getElementById("errorMsg");
const sendBtn = document.getElementById("send");
const checkboxes = document.querySelectorAll('.checkbox-input');

//validate letter input
input.addEventListener("input", () => {
  const value = input.value;
  const letterOnly = value.replace(/[^a-zA-Zأ-ي]/g, "");
  input.value = letterOnly.charAt(0); //force only one letter

  if (letterOnly.length > 1) {
    showError("🚫 Only one letter!");
  } else {
    error.style.display = "none";
  }
});

//validate and send
sendBtn.addEventListener('click', async () => {
  if (!validateForm()) return;

  const selectedLetter = input.value;
  const selectedCategories = Array.from(document.querySelectorAll('.checkbox-input:checked'))
    .map(checkbox => checkbox.dataset.category);

  try {
    //show loading state
    sendBtn.disabled = true;
    sendBtn.textContent = 'جاري الإرسال...';

    //fetch questions from DeepSeek API
    const questions = await getQuestionsFromDeepSeek(selectedLetter, selectedCategories);

    //display the questions
    displayQuestions(questions);

    //reset UI
    document.getElementById('popup').classList.remove('show');
    input.value = '';
    checkboxes.forEach(cb => cb.checked = false);

  } catch (err) {
    showError("فشل في الحصول على الأسئلة: " + err.message);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'إرسال';
  }
});

// ✅ Form validation
function validateForm() {
  const letterValid = /^[a-zA-Zأ-ي]$/.test(input.value);
  const anyChecked = Array.from(checkboxes).some(cb => cb.checked);

  if (!letterValid) {
    showError("🚫 أدخل حرفًا واحدًا فقط (عربي أو إنجليزي)");
    return false;
  }

  if (!anyChecked) {
    showError("🚫 الرجاء اختيار تصنيف واحد على الأقل");
    return false;
  }

  return true;
}

// ✅ Display questions
function displayQuestions(questions) {
  const container = document.getElementById('questionContainer');
  container.innerHTML = '<p>الأسئلة هي:</p>';

  const questionsList = document.createElement('div');
  questionsList.className = 'questions-list';

  if (Array.isArray(questions)) {
    questions.forEach((question, index) => {
      const questionElement = document.createElement('p');
      questionElement.className = 'question';
      questionElement.innerHTML = `<strong>${index + 1}.</strong> ${question}`;
      questionsList.appendChild(questionElement);
    });
  } else {
    const questionElement = document.createElement('p');
    questionElement.className = 'question';
    questionElement.textContent = questions;
    questionsList.appendChild(questionElement);
  }

  container.appendChild(questionsList);
  container.closest('article').style.display = 'block';
}

// ✅ Fetch from DeepSeek API
async function getQuestionsFromDeepSeek(letter, categories) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-30a558372ecf4b8eab6f5ae19abf6aec'}
      ,
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{
        role: "user",
        content: `Generate 3 Arabic questions about ${categories.join(' أو ')} starting with letter ${letter}`
      }]
    })
  });

  const data = await response.json();
  return processApiResponse(data); //implement this function or return mock data
}

// ✅ Error message animation
function showError(message) {
  error.textContent = message;
  error.style.display = "block";
  error.classList.remove("shake");
  void error.offsetWidth; //force reflow for animation restart
  error.classList.add("shake");
}
