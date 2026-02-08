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
let spellInput = '';
let currentSpellWord = '';

function showScreen(screenId) {
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
    }
    
    window.scrollTo(0, 0);
}

// ===== RENDER HOME =====
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
        </div>
    `;
}

// ===== RENDER LEARN =====
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

// ===== RENDER SPELL (NEW!) =====
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
    
    // Remove spaces for spelling
    const cleanWord = currentSpellWord.replace(/\s/g, '');
    const difficulty = getDifficulty();
    const totalLetters = cleanWord.length;
    const hiddenCount = Math.ceil(totalLetters * (difficulty / 100));
    
    // Choose which positions to hide
    const hidePositions = [];
    while (hidePositions.length < hiddenCount) {
        const pos = Math.floor(Math.random() * totalLetters);
        if (!hidePositions.includes(pos)) hidePositions.push(pos);
    }
    hidePositions.sort((a, b) => a - b);
    
    // Build slots HTML
    let slotsHTML = '';
    for (let i = 0; i < totalLetters; i++) {
        const isHidden = hidePositions.includes(i);
        const letter = cleanWord[i];
        slotsHTML += `<div class="spell-slot ${isHidden ? 'empty' : 'filled'}" data-index="${i}">${isHidden ? '' : letter}</div>`;
    }
    
    // Build letter pool (scrambled)
    const poolLetters = cleanWord.split('').sort(() => 0.5 - Math.random());
    let poolHTML = '';
    poolLetters.forEach((letter, idx) => {
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
    const slots = document.querySelectorAll('.spell-slot.empty');
    const cleanWord = currentSpellWord.replace(/\s/g, '');
    
    if (spellInput.length < slots.length) {
        // Find next empty slot
        const emptySlots = document.querySelectorAll('.spell-slot.empty:not(.has-letter)');
        if (emptySlots.length > 0) {
            const slot = emptySlots[0];
            slot.textContent = letter;
            slot.classList.add('has-letter');
            spellInput += letter;
            
            // Visual feedback
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => btn.style.transform = 'scale(1)', 100);
            
            speak(letter);
            
            // Check if complete
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
        // Correct!
        speak('Great job! ' + currentSpellWord);
        saveWordProgress(currentSpellWord);
        
        // Visual celebration
        document.querySelector('.spell-slots').style.animation = 'bounce 0.5s';
        
        setTimeout(() => {
            spellIndex++;
            renderSpell();
        }, 1500);
    } else {
        // Wrong
        speak('Try again');
        document.querySelector('.spell-slots').style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.querySelector('.spell-slots').style.animation = '';
            // Clear after delay
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

// ===== RENDER MATCH =====
function renderMatch() {
    document.getElementById('match').innerHTML = `
        <p class="coming-soon">Match mode coming soon!</p>
        <button class="home-btn" onclick="showScreen('home')">Back to Home</button>
    `;
}

// ===== RENDER CHALLENGE =====
function renderChallenge() {
    document.getElementById('challenge').innerHTML = `
        <p class="coming-soon">Challenge mode coming soon!</p>
        <button class="home-btn" onclick="showScreen('home')">Back to Home</button>
    `;
}

// ===== RENDER LIBRARY =====
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
