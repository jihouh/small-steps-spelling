// ===== CONSTANTS =====
const QUOTES = [
    "Mistakes are proof that you are trying! 🌟",
    "Every small step leads to a giant leap! 🚀",
    "You are doing a fantastic job! Keep going! 🌈",
    "Learning is a superpower! 🦸‍♂️🦸‍♀️",
    "Believe in yourself! ✨",
    "Practice makes progress! ✏️",
    "You are a spelling superstar! ⭐",
    "Awesome work today! 🎈"
];

const DEFAULT_WORDS = [
    { word: 'cake', img: 'https://img.freepik.com/premium-vector/delicious-cake-clipart-vector-art-illustration_761413-18518.jpg?w=400', count: 0, active: true },
    { word: 'milk', img: 'https://thumb.ac-illust.com/c2/c29d5122113fb72d9178ad85e1e854c3_t.jpeg?w=400', count: 0, active: true },
    { word: 'bread', img: 'https://img.freepik.com/premium-vector/isolated-loaf-bread-slice-illustration_1274264-15470.jpg?w=400', count: 0, active: true },
    { word: 'butter', img: 'https://img.freepik.com/premium-vector/impressao_753212-2904.jpg?w=400', count: 0, active: true },
    { word: 'sandwich', img: 'https://img.freepik.com/premium-vector/kids-drawing-vector-illustration-cartoon-sandwich-icon-isolated-white_760559-3160.jpg?w=400', count: 0, active: true },
    { word: 'rice', img: 'https://img.freepik.com/premium-vector/bowl-full-rice-vector-illustration_621660-2012.jpg?w=400', count: 0, active: true },
    { word: 'soup', img: 'https://img.freepik.com/premium-vector/pumpkin-soup-bowl-isolated-white-background-traditional-autumn-thanksgiving-food-vector-illustration_693602-124.jpg', count: 0, active: true },
    { word: 'food', img: 'https://img.freepik.com/premium-photo/authentic-chinese-food-photo-spring-rolls-noodles-dumplings-rice_1088041-52973.jpg?semt=ais_hybrid&w=740&q=80', count: 0, active: true },
    { word: 'porridge', img: 'https://img.freepik.com/premium-photo/traditional-chinese-porridge-rice-gruel-bowl_45583-882.jpg', count: 0, active: true },
    { word: 'noodle', img: 'https://img.freepik.com/premium-vector/hakka-noodles-vector-illustration_621660-3511.jpg?semt=ais_hybrid&w=400', count: 0, active: true },
    { word: 'jelly', img: 'https://img.freepik.com/premium-vector/cartoon-sweet-dessert-pink-jelly-plate-vector-illustration_87850-525.jpg?w=400', count: 0, active: true },
    { word: 'biscuit', img: 'https://img.freepik.com/free-vector/biscuit-cookies-cracker-with-cream-vector_1441-775.jpg?semt=ais_hybrid&w=400', count: 0, active: true },
    { word: 'cheese', img: 'https://img.freepik.com/premium-vector/cheese-board-cheese-dices-slices-vector-art_1290085-8070.jpg?semt=ais_hybrid&w=400', count: 0, active: true },
    { word: 'ice cream', img: 'https://img.freepik.com/free-vector/delicious-ice-cream-cones_1308-174629.jpg?semt=ais_hybrid&w=400', count: 0, active: true },
    { word: 'chocolate', img: 'https://img.freepik.com/premium-vector/chocolate-opened-package-white-background_269543-2547.jpg?semt=ais_user_personalization&w=400', count: 0, active: true },
    { word: 'mango', img: 'https://img.freepik.com/free-vector/whole-mango-cut-pieces-3d-illustration-cartoon-drawing-yellow-tasty-fruit-natural-food-product-with-vitamins-3d-style-white-background-food-fruits-healthy-eating-concept_778687-1633.jpg?semt=ais_hybrid&w=400', count: 0, active: true },
    { word: 'grapes', img: 'https://img.freepik.com/premium-vector/picture-bunch-grapes-with-green-leaf_909058-7592.jpg?semt=ais_hybrid&w=400', count: 0, active: true },
    { word: 'pineapple', img: 'https://img.freepik.com/premium-photo/large-fresh-ripe-fruit-pineapple-fruit-summer_262193-1325.jpg?semt=ais_hybrid&w=400', count: 0, active: true },
    { word: 'papaya', img: 'https://img.freepik.com/premium-vector/papaya-isolated-white-background_1291186-77.jpg?semt=ais_hybrid&w=400', count: 0, active: true },
    { word: 'banana', img: 'https://img.freepik.com/free-vector/vector-ripe-yellow-banana-bunch-isolated-white-background_1284-45456.jpg?semt=ais_hybrid&w=400', count: 0, active: true }
];

// ===== STATE =====
function getStorage(key, defaultVal) {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? item : defaultVal;
    } catch (e) {
        return defaultVal;
    }
}

function getJSON(key, defaultVal) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
        return defaultVal;
    }
}

function setStorage(key, val) {
    try {
        localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    } catch (e) {}
}

function getWordList() {
    return getJSON('ss_wordlist', DEFAULT_WORDS);
}

function getUserName() {
    return getStorage('ss_username', 'Student');
}

function getTotalStars() {
    return parseInt(getStorage('engTotalStars', '0'));
}

function getDifficulty() {
    return parseInt(getStorage('ss_difficulty', '50'));
}

function getChallengeTimer() {
    return parseInt(getStorage('ss_ch_timer', '60'));
}

function getHighScore() {
    return parseInt(getStorage('ss_ch_high', '0'));
}

function saveWordProgress(word) {
    const list = getWordList();
    const item = list.find(w => w.word === word);
    if (item) {
        item.count++;
        const currentStars = getTotalStars();
        setStorage('engTotalStars', currentStars + 1);
        setStorage('ss_wordlist', list);
        return true;
    }
    return false;
}

// ===== AUDIO =====
function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
}

async function spellOut(word) {
    speak(word);
    await delay(1000);
    for (let char of word) {
        if (char !== ' ') {
            speak(char);
            await delay(400);
        }
    }
    await delay(300);
    speak(word);
}

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// ===== NAVIGATION =====
let currentScreen = 'home';
let learnIndex = 0;
let spellIndex = 0;
let matchIndex = 0;
let spellInput = '';
let currentSpellWord = '';

function showScreen(screenId) {
    // Stop challenge if running
    if (challengeTimer) {
        clearInterval(challengeTimer);
        challengeTimer = null;
    }
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        currentScreen = screenId;
        
        const navBtn = document.querySelector(`button[onclick="showScreen('${screenId}')"]`);
        if (navBtn) navBtn.classList.add('active');
        
        if (screenId === 'home') renderHome();
        else if (screenId === 'learn') renderLearn();
        else if (screenId === 'spell') renderSpell();
        else if (screenId === 'match') renderMatch();
        else if (screenId === 'challenge') renderChallenge();
        else if (screenId === 'library') renderLibrary();
        else if (screenId === 'admin') renderAdmin();
    }
    
    window.scrollTo(0, 0);
}

// ===== HOME =====
function renderHome() {
    const container = document.getElementById('home');
    const userName = getUserName();
    const totalStars = getTotalStars();
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    
    container.innerHTML = `
        <h2 style="color: #FF6B6B; font-family: cursive; font-size: 32px; margin-bottom: 10px;">Hi ${userName}! 👋</h2>
        
        <div class="quote-card" onclick="speak('${quote.replace(/'/g, "\\'")}')">
            <p>${quote}</p>
            <small>(Tap to listen)</small>
        </div>
        
        <div class="stars-display">🌟 ${totalStars} Mastery Stars</div>
        
        <div class="button-grid">
            <button class="btn btn-learn" onclick="showScreen('learn')">📖 LEARN</button>
            <button class="btn btn-spell" onclick="showScreen('spell')">✏️ SPELL</button>
            <button class="btn btn-match" onclick="showScreen('match')">🧩 MATCH</button>
            <button class="btn btn-challenge" onclick="showScreen('challenge')">🔥 CHALLENGE</button>
            <button class="btn btn-library" onclick="showScreen('library')">📚 LIBRARY</button>
            <button class="btn btn-admin" onclick="showScreen('admin')">⚙️ PARENT SETTINGS</button>
        </div>
    `;
}

// ===== LEARN =====
function renderLearn() {
    const container = document.getElementById('learn');
    const words = getWordList().filter(w => w.active);
    
    if (!words.length) {
        container.innerHTML = '<p class="coming-soon">No words available.</p>';
        return;
    }
    
    learnIndex = ((learnIndex % words.length) + words.length) % words.length;
    const word = words[learnIndex];
    
    container.innerHTML = `
        <p style="color: #555; font-size: 18px; margin-bottom: 10px;">Tap word to hear spelling!</p>
        <img src="${word.img}" class="word-image" alt="${word.word}">
        <div class="word-text" onclick="spellOut('${word.word}')">${word.word}</div>
        <div class="nav-buttons">
            <button class="nav-btn btn-back" onclick="prevLearn()">⬅️ BACK</button>
            <button class="nav-btn btn-next" onclick="nextLearn()">NEXT ➡️</button>
        </div>
    `;
}

function nextLearn() {
    learnIndex++;
    renderLearn();
}

function prevLearn() {
    learnIndex--;
    if (learnIndex < 0) learnIndex = 0;
    renderLearn();
}

// ===== SPELL =====
function renderSpell() {
    const container = document.getElementById('spell');
    const words = getWordList().filter(w => w.active);
    
    if (!words.length) {
        container.innerHTML = '<p class="coming-soon">No words available.</p>';
        return;
    }
    
    spellIndex = ((spellIndex % words.length) + words.length) % words.length;
    const wordObj = words[spellIndex];
    currentSpellWord = wordObj.word;
    spellInput = '';
    
    const cleanWord = currentSpellWord.replace(/\s/g, '');
    const difficulty = getDifficulty();
    const totalLetters = cleanWord.length;
    const hiddenCount = Math.ceil(totalLetters * (difficulty / 100));
    
    const hidePositions = [];
    while (hidePositions.length < hiddenCount) {
        const pos = Math.floor(Math.random() * totalLetters);
        if (!hidePositions.includes(pos)) hidePositions.push(pos);
    }
    hidePositions.sort((a, b) => a - b);
    
    let slotsHTML = '';
    for (let i = 0; i < totalLetters; i++) {
        const isHidden = hidePositions.includes(i);
        const letter = cleanWord[i];
        slotsHTML += `<div class="spell-slot ${isHidden ? 'empty' : 'filled'}" data-index="${i}">${isHidden ? '' : letter}</div>`;
    }
    
    const poolLetters = cleanWord.split('').sort(() => 0.5 - Math.random());
    let poolHTML = '';
    poolLetters.forEach((letter) => {
        poolHTML += `<button class="letter-btn" onclick="handleLetterClick('${letter}', this)">${letter}</button>`;
    });
    
    container.innerHTML = `
        <p style="color: #555; font-size: 18px; margin-bottom: 10px;">Spell the word!</p>
        <img src="${wordObj.img}" class="word-image" alt="${currentSpellWord}">
        <div class="spell-slots">${slotsHTML}</div>
        <div class="letter-pool">${poolHTML}</div>
        <div class="nav-buttons">
            <button class="nav-btn btn-back" onclick="prevSpell()">⬅️ BACK</button>
            <button class="nav-btn" style="background: #ff9f43; color: white;" onclick="handleBackspace()">⌫ DELETE</button>
        </div>
    `;
}

function handleLetterClick(letter, btn) {
    const cleanWord = currentSpellWord.replace(/\s/g, '');
    
    if (spellInput.length < cleanWord.length) {
        const emptySlots = document.querySelectorAll('.spell-slot.empty:not(.has-letter)');
        if (emptySlots.length > 0) {
            const slot = emptySlots[0];
            slot.textContent = letter;
            slot.classList.add('has-letter');
            spellInput += letter;
            
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => btn.style.transform = 'scale(1)', 100);
            
            speak(letter);
            
            if (spellInput.length === cleanWord.length) {
                checkSpelling();
            }
        }
    }
}

function handleBackspace() {
    const filledSlots = document.querySelectorAll('.spell-slot.has-letter');
    if (filledSlots.length > 0) {
        const lastSlot = filledSlots[filledSlots.length - 1];
        lastSlot.textContent = '';
        lastSlot.classList.remove('has-letter');
        spellInput = spellInput.slice(0, -1);
    }
}

function checkSpelling() {
    const cleanWord = currentSpellWord.replace(/\s/g, '');
    const slots = document.querySelectorAll('.spell-slot');
    let spelledWord = '';
    slots.forEach(slot => spelledWord += slot.textContent);
    
    if (spelledWord === cleanWord) {
        speak('Great job! ' + currentSpellWord);
        saveWordProgress(currentSpellWord);
        document.querySelector('.spell-slots').style.animation = 'bounce 0.5s';
        setTimeout(() => {
            spellIndex++;
            renderSpell();
        }, 1500);
    } else {
        speak('Try again');
        document.querySelector('.spell-slots').style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.querySelector('.spell-slots').style.animation = '';
            setTimeout(() => {
                spellInput = '';
                document.querySelectorAll('.spell-slot.has-letter').forEach(slot => {
                    slot.textContent = '';
                    slot.classList.remove('has-letter');
                });
            }, 500);
        }, 500);
    }
}

function prevSpell() {
    spellIndex--;
    if (spellIndex < 0) spellIndex = 0;
    renderSpell();
}

// ===== MATCH =====
function renderMatch() {
    const container = document.getElementById('match');
    const words = getWordList().filter(w => w.active);
    
    if (!words.length) {
        container.innerHTML = '<p class="coming-soon">No words available.</p>';
        return;
    }
    
    matchIndex = ((matchIndex % words.length) + words.length) % words.length;
    const correctWord = words[matchIndex];
    
    // Get 2 random wrong answers
    const otherWords = words
        .filter(w => w.word !== correctWord.word)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
    
    const options = [correctWord, ...otherWords].sort(() => 0.5 - Math.random());
    
    let buttonsHTML = '';
    options.forEach(opt => {
        buttonsHTML += `<button class="match-btn" onclick="checkMatch('${opt.word}', '${correctWord.word}')">${opt.word}</button>`;
    });
    
    container.innerHTML = `
        <p style="color: #555; font-size: 18px; margin-bottom: 10px;">Find the matching word!</p>
        <img src="${correctWord.img}" class="word-image" alt="What is this?">
        <div style="width: 100%; max-width: 400px;">${buttonsHTML}</div>
        <div class="nav-buttons">
            <button class="nav-btn btn-back" onclick="prevMatch()">⬅️ BACK</button>
            <button class="nav-btn btn-next" onclick="nextMatch()">SKIP ➡️</button>
        </div>
    `;
}

function checkMatch(selected, correct) {
    if (selected === correct) {
        speak('Great job! ' + correct);
        saveWordProgress(correct);
        const btn = event.target;
        btn.style.background = '#2ecc71';
        btn.style.color = 'white';
        setTimeout(() => {
            matchIndex++;
            renderMatch();
        }, 1000);
    } else {
        speak('Try again');
        const btn = event.target;
        btn.style.animation = 'shake 0.5s';
        btn.style.borderColor = '#FF6B6B';
    }
}

function nextMatch() {
    matchIndex++;
    renderMatch();
}

function prevMatch() {
    matchIndex--;
    if (matchIndex < 0) matchIndex = 0;
    renderMatch();
}

// ===== CHALLENGE =====
let challengeTimer = null;
let challengeTimeLeft = 0;
let challengeScore = 0;
let challengeCorrect = 0;
let challengeWrong = 0;
let challengePracticeWords = [];
let challengeTaskType = 'match';
let challengeCurrentWord = null;

function renderChallenge() {
    const container = document.getElementById('challenge');
    const words = getWordList().filter(w => w.active);
    
    if (!words.length) {
        container.innerHTML = '<p class="coming-soon">No words available. Add words in settings.</p>';
        return;
    }
    
    // Reset challenge
    challengeTimeLeft = getChallengeTimer();
    challengeScore = 0;
    challengeCorrect = 0;
    challengeWrong = 0;
    challengePracticeWords = [];
    challengeTaskType = 'match';
    
    container.innerHTML = `
        <div class="challenge-hud">
            <div class="hud-item">
                <span class="hud-label">Best</span>
                <span class="hud-value" id="ch-high">${getHighScore()}</span>
            </div>
            <div class="hud-item">
                <span class="hud-label">Time</span>
                <span class="hud-value" id="ch-time">${formatTime(challengeTimeLeft)}</span>
            </div>
            <div class="hud-item">
                <span class="hud-label">Score</span>
                <span class="hud-value" id="ch-score">0</span>
            </div>
        </div>
        <div id="challenge-area"></div>
    `;
    
    startChallengeTimer();
    nextChallengeTask();
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function startChallengeTimer() {
    updateChallengeHUD();
    
    challengeTimer = setInterval(() => {
        challengeTimeLeft--;
        updateChallengeHUD();
        
        if (challengeTimeLeft <= 0) {
            endChallenge();
        } else if (challengeTimeLeft <= 10) {
            document.getElementById('ch-time').style.color = '#FF6B6B';
        }
    }, 1000);
}

function updateChallengeHUD() {
    document.getElementById('ch-time').textContent = formatTime(challengeTimeLeft);
    document.getElementById('ch-score').textContent = challengeScore;
}

function nextChallengeTask() {
    const words = getWordList().filter(w => w.active);
    const area = document.getElementById('challenge-area');
    
    // Alternate between match and spell
    challengeTaskType = challengeTaskType === 'match' ? 'spell' : 'match';
    challengeCurrentWord = words[Math.floor(Math.random() * words.length)];
    const cleanWord = challengeCurrentWord.word.replace(/\s/g, '');
    
    if (challengeTaskType === 'match') {
        // Match task
        const otherWords = words
            .filter(w => w.word !== challengeCurrentWord.word)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
        const options = [challengeCurrentWord, ...otherWords].sort(() => 0.5 - Math.random());
        
        let buttonsHTML = '';
        options.forEach(opt => {
            buttonsHTML += `<button class="match-btn" onclick="handleChallengeMatch('${opt.word}')">${opt.word}</button>`;
        });
        
        area.innerHTML = `
            <p class="challenge-instruction">Match it!</p>
            <img src="${challengeCurrentWord.img}" class="word-image" alt="Match this">
            <div style="width: 100%; max-width: 400px;">${buttonsHTML}</div>
        `;
    } else {
        // Spell task
        let slotsHTML = '';
        for (let i = 0; i < cleanWord.length; i++) {
            slotsHTML += `<div class="spell-slot empty" id="ch-slot-${i}"></div>`;
        }
        
        const poolLetters = cleanWord.split('').sort(() => 0.5 - Math.random());
        let poolHTML = '';
        poolLetters.forEach((letter) => {
            poolHTML += `<button class="letter-btn" onclick="handleChallengeLetter('${letter}')">${letter}</button>`;
        });
        
        area.innerHTML = `
            <p class="challenge-instruction">Spell it!</p>
            <img src="${challengeCurrentWord.img}" class="word-image" alt="Spell this">
            <div class="spell-slots">${slotsHTML}</div>
            <div class="letter-pool">${poolHTML}</div>
        `;
    }
}

let challengeSpellInput = '';

function handleChallengeMatch(selected) {
    if (selected === challengeCurrentWord.word) {
        challengeScore += 10;
        challengeCorrect++;
        speak('Great!');
        setTimeout(nextChallengeTask, 400);
    } else {
        speak('Try again');
        challengeWrong++;
        if (!challengePracticeWords.includes(challengeCurrentWord.word)) {
            challengePracticeWords.push(challengeCurrentWord.word);
        }
    }
    updateChallengeHUD();
}

function handleChallengeLetter(letter) {
    const cleanWord = challengeCurrentWord.word.replace(/\s/g, '');
    
    if (challengeSpellInput.length < cleanWord.length) {
        const slot = document.getElementById(`ch-slot-${challengeSpellInput.length}`);
        slot.textContent = letter;
        slot.classList.add('has-letter');
        challengeSpellInput += letter;
        
        if (challengeSpellInput === cleanWord) {
            challengeScore += 20;
            challengeCorrect++;
            speak('Excellent!');
            challengeSpellInput = '';
            setTimeout(nextChallengeTask, 400);
        } else if (challengeSpellInput.length === cleanWord.length) {
            speak('Try again');
            challengeWrong++;
            if (!challengePracticeWords.includes(challengeCurrentWord.word)) {
                challengePracticeWords.push(challengeCurrentWord.word);
            }
            setTimeout(() => {
                challengeSpellInput = '';
                for (let i = 0; i < cleanWord.length; i++) {
                    const s = document.getElementById(`ch-slot-${i}`);
                    s.textContent = '';
                    s.classList.remove('has-letter');
                }
            }, 600);
        }
    }
    updateChallengeHUD();
}

function endChallenge() {
    clearInterval(challengeTimer);
    challengeTimer = null;
    
    // Save high score
    const currentHigh = getHighScore();
    if (challengeScore > currentHigh) {
        setStorage('ss_ch_high', challengeScore);
    }
    
    // Show results
    document.getElementById('res-score').textContent = challengeScore;
    document.getElementById('res-correct').textContent = challengeCorrect;
    document.getElementById('res-wrong').textContent = challengeWrong;
    
    const practiceDiv = document.getElementById('res-practice');
    if (challengePracticeWords.length > 0) {
        practiceDiv.innerHTML = challengePracticeWords.map(w => 
            `<span class="practice-tag">${w}</span>`
        ).join('');
    } else {
        practiceDiv.innerHTML = '<p style="color: #888;">Perfect! No mistakes! 🌟</p>';
    }
    
    document.getElementById('results-overlay').style.display = 'flex';
}

function closeResults() {
    document.getElementById('results-overlay').style.display = 'none';
    showScreen('home');
}

// ===== ADMIN =====
function renderAdmin() {
    const container = document.getElementById('admin');
    const words = getWordList();
    
    let wordListHTML = '';
    words.forEach((w, i) => {
        wordListHTML += `
            <div class="word-item">
                <label>
                    <input type="checkbox" ${w.active ? 'checked' : ''} onchange="toggleWord(${i})">
                    <span>${w.word}</span>
                </label>
                <span>🌟 ${w.count}</span>
            </div>
        `;
    });
    
    container.innerHTML = `
        <h2 style="color: #555; margin-bottom: 20px;">⚙️ Parent Settings</h2>
        
        <div class="admin-section">
            <h3>Student Name</h3>
            <input type="text" class="admin-input" id="admin-name" value="${getUserName()}" placeholder="Enter name">
            <button class="home-btn" onclick="saveName()" style="width: 100%; margin-top: 10px;">Save Name</button>
        </div>
        
        <div class="admin-section">
            <h3>Spelling Difficulty</h3>
            <p style="color: #777; font-size: 14px;">How many letters to hide: <strong id="diff-val">${getDifficulty()}%</strong></p>
            <input type="range" class="slider" min="0" max="100" step="25" value="${getDifficulty()}" 
                   oninput="updateDifficulty(this.value)">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #999;">
                <span>Easy (0%)</span>
                <span>Hard (100%)</span>
            </div>
        </div>
        
        <div class="admin-section">
            <h3>Challenge Timer</h3>
            <p style="color: #777; font-size: 14px;">Duration: <strong id="timer-val">${getChallengeTimer()} seconds</strong></p>
            <input type="range" class="slider" min="30" max="180" step="30" value="${getChallengeTimer()}" 
                   oninput="updateTimer(this.value)">
        </div>
        
        <div class="admin-section">
            <h3>Add New Word</h3>
            <input type="text" class="admin-input" id="new-word" placeholder="Word (e.g., apple)">
            <input type="text" class="admin-input" id="new-img" placeholder="Image URL">
            <button class="home-btn" onclick="addWord()" style="width: 100%; margin-top: 10px;">Add Word</button>
        </div>
        
        <div class="admin-section">
            <h3>Word List (${words.filter(w => w.active).length} active)</h3>
            <div class="word-list">${wordListHTML}</div>
        </div>
        
        <div class="admin-section">
            <h3>Progress</h3>
            <p>Total Stars: 🌟 ${getTotalStars()}</p>
            <p>Challenge High Score: ${getHighScore()}</p>
            <button class="danger-btn" onclick="resetAll()">⚠️ RESET ALL PROGRESS</button>
        </div>
        
        <button class="home-btn" onclick="showScreen('home')" style="margin-top: 20px;">Back to Home</button>
    `;
}

function saveName() {
    const name = document.getElementById('admin-name').value.trim();
    if (name) {
        setStorage('ss_username', name);
        alert('Name saved!');
    }
}

function updateDifficulty(val) {
    document.getElementById('diff-val').textContent = val + '%';
    setStorage('ss_difficulty', val);
}

function updateTimer(val) {
    document.getElementById('timer-val').textContent = val + ' seconds';
    setStorage('ss_ch_timer', val);
}

function toggleWord(index) {
    const list = getWordList();
    list[index].active = !list[index].active;
    setStorage('ss_wordlist', list);
    renderAdmin();
}

function addWord() {
    const word = document.getElementById('new-word').value.trim().toLowerCase();
    const img = document.getElementById('new-img').value.trim();
    
    if (!word || !img) {
        alert('Please enter both word and image URL');
        return;
    }
    
    if (!/^[a-z\s]+$/.test(word)) {
        alert('Word must contain only letters');
        return;
    }
    
    const list = getWordList();
    if (list.find(w => w.word === word)) {
        alert('Word already exists!');
        return;
    }
    
    list.push({ word, img, count: 0, active: true });
    setStorage('ss_wordlist', list);
    
    document.getElementById('new-word').value = '';
    document.getElementById('new-img').value = '';
    
    renderAdmin();
    alert('Word added!');
}

function resetAll() {
    if (confirm('⚠️ Are you sure? This will delete ALL progress!')) {
        setStorage('ss_wordlist', DEFAULT_WORDS);
        setStorage('engTotalStars', '0');
        setStorage('ss_ch_high', '0');
        setStorage('ss_username', 'Student');
        alert('All progress reset!');
        renderAdmin();
    }
}

// ===== LIBRARY =====
function renderLibrary() {
    const container = document.getElementById('library');
    const words = getWordList().filter(w => w.active);
    
    let html = '<p style="color: #555; margin-bottom: 10px;">Tap word to hear it!</p><div class="library-list">';
    
    words.forEach(w => {
        html += `
            <div class="library-item" onclick="speak('${w.word}')">
                <span>${w.word}</span>
                <span>🌟 ${w.count}</span>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ===== START =====
document.addEventListener('DOMContentLoaded', function() {
    showScreen('home');
});
