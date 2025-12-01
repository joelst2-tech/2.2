const runBtn = document.getElementById('runBtn');
const textInput = document.getElementById('textInput');
const featureSelect = document.getElementById('featureSelect');
const toneSelect = document.getElementById('toneSelect');
const resultDiv = document.getElementById('result');
const copyBtn = document.getElementById('copyBtn');
const charCounter = document.getElementById('charCounter');
const presetButtons = document.querySelectorAll('.presetBtn');
const historyList = document.getElementById('historyList');
const toggleHistory = document.getElementById('toggleHistory');

let history = JSON.parse(localStorage.getItem('history') || '[]');

function updateHistory() {
  historyList.innerHTML = '';
  history.slice().reverse().forEach((item, idx) => {
    const div = document.createElement('div');
    div.classList.add('historyItem');
    div.textContent = item;
    div.addEventListener('click', () => {
      resultDiv.textContent = item;
    });
    historyList.appendChild(div);
  });
}

function saveHistory(text) {
  if (!text) return;
  history.push(text);
  if (history.length > 5) history.shift();
  localStorage.setItem('history', JSON.stringify(history));
  updateHistory();
}

updateHistory();

toggleHistory.addEventListener('click', () => {
  if (historyList.style.display === 'block') {
    historyList.style.display = 'none';
    toggleHistory.textContent = 'History ▼';
  } else {
    historyList.style.display = 'block';
    toggleHistory.textContent = 'History ▲';
  }
});

textInput.addEventListener('input', () => {
  const count = textInput.value.length;
  charCounter.textContent = `Characters: ${count}`;
  if (count > 100) {
    charCounter.classList.add('high');
  } else {
    charCounter.classList.remove('high');
  }
});

presetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    presetButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const action = btn.dataset.action;
    if(action === 'fixGrammar') featureSelect.value = 'rewrite';
    if(action === 'shorten') featureSelect.value = 'summarize';
    if(action === 'simplify') featureSelect.value = 'explain';
  });
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(resultDiv.textContent);
  copyBtn.textContent = 'Copied!';
  copyBtn.classList.add('copied');
  setTimeout(() => {
    copyBtn.textContent = 'Copy';
    copyBtn.classList.remove('copied');
  }, 1500);
});

runBtn.addEventListener('click', () => {
  const inputText = textInput.value.trim();
  const feature = featureSelect.value;
  const tone = toneSelect.value;

  if (!inputText) {
    resultDiv.textContent = "Please enter some text.";
    return;
  }

  // Loading animation
  resultDiv.innerHTML = '<div class="loadingDots"><span></span><span></span><span></span></div>';
  runBtn.disabled = true;

  setTimeout(() => {
    const simulatedResponse = `Simulated response: "${inputText}"\nFeature: ${feature}, Tone: ${tone}`;
    resultDiv.textContent = simulatedResponse;
    saveHistory(simulatedResponse);
    runBtn.disabled = false;
  }, 1000);
});