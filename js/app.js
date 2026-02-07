// ===== CONSTANTS =====
const CONSTANTS = {
    STORAGE_KEYS: {
        WORD_LIST: 'ss_wordlist',
        USER_NAME: 'ss_username',
        TOTAL_STARS: 'engTotalStars',
        RANDOM: 'ss_random',
        DIFFICULTY: 'ss_difficulty',
        CHALLENGE_TIMER: 'ss_ch_timer',
        HIGH_SCORE: 'ss_ch_high'
    }
};

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

// ===== STATE MANAGER =====
const StateManager = {
    get(key, defaultVal) {
        try {
            const item = localStorage.getItem(key);
            return item !== null ? item : defaultVal;
        } catch (e) {
            return defaultVal;
        }
    },
    
    getJSON(key, defaultVal) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultVal;
        } catch (e) {
            return defaultVal;
        }
    },
    
    set(key, val) {
        try {
            localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
        } catch (e) {
            console.warn('Storage failed:', e);
        }
    },
    
    getWordList() {
        return this.getJSON(CONSTANTS.STORAGE_KEYS.WORD_LIST, DEFAULT_WORDS);
    },
    
    getUserName() {
        return this.get(CONSTANTS.STORAGE_KEYS.USER_NAME, 'Student');
    },
    
    getTotalStars() {
        return parseInt(this.get(CONSTANTS.STORAGE_KEYS.TOTAL_STARS, '0'));
    }
};

// ===== AUDIO =====
const AudioManager = {
    speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.85;
        u.lang = 'en-US';
        window.speechSynthesis.speak(u);
    },
    
    async spellOut(word) {
        this.speak(word);
        await this.delay(1000);
        for (let char of word) {
            if (char !== ' ') {
                this.speak(char);
                await this.delay(400);
            }
        }
        await this.delay(300);
        this.speak(word);
    },
    
    delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
};

// ===== SCREEN MANAGEMENT =====
let currentScreen = 'home';
let learnIndex = 0;

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // Show new screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        screen.style.display = 'flex';
        currentScreen = screenId;
        
        // Update nav button
        const navBtn = document.querySelector(`button[onclick="showScreen('${screenId}')"]`);
        if (navBtn) navBtn.classList.add('active');
        
        // Render screen content
        if (screenId === 'home') renderHome();
        else if (screenId === 'learn') renderLearn();
        else if (screenId === 'spell') renderSpell();
        else if (screenId === 'match') renderMatch();
        else if (screenId === 'challenge') renderChallenge();
        else if (screenId === 'library') renderLibrary();
    }
}

// ===== RENDER FUNCTIONS =====

function renderHome() {
    const container = document.getElementById('home');
    const userName = StateManager.getUserName();
    const totalStars = StateManager.getTotalStars();
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    
    container.innerHTML = `
        <h2 style="color: #FF6B6B; font-family: cursive; font-size: 32px;">Hi ${userName}! 👋</h2>
        
        <div onclick="AudioManager.speak('${quote.replace(/'/g, "\\'")}')" 
             style="background: white; padding: 20px; border-radius: 20px; border: 2px dashed #4ECDC4; margin: 15px; cursor: pointer; max-width: 400px;">
            <p style="font-family: cursive; color: #555; font-size: 18px; margin: 0;">${quote}</p>
            <small style="color: #aaa;">(Tap to listen)</small>
        </div>
        
        <div style="color: #45aaf2; font-size: 20px; margin: 10px;">🌟 ${totalStars} Mastery Stars</div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 90%; max-width: 400px; margin-top: 20px;">
            <button onclick="showScreen('learn')" style="background: #4ECDC4; color: white; border: none; padding: 20px; border-radius: 15px; font-size: 18px; cursor: pointer;">📖 LEARN</button>
            <button onclick="showScreen('spell')" style="background: #45aaf2; color: white; border: none; padding: 20px; border-radius: 15px; font-size: 18px; cursor: pointer;">✏️ SPELL</button>
            <button onclick="showScreen('match')" style="background: #a55eea; color: white; border: none; padding: 20px; border-radius: 15px; font-size: 18px; cursor: pointer;">🧩 MATCH</button>
            <button onclick="showScreen('challenge')" style="background: #eb4d4b; color: white; border: none; padding: 20px; border-radius: 15px; font-size: 18px; cursor: pointer;">🔥 CHALLENGE</button>
            <button onclick="showScreen('library')" style="background: #FF6B6B; color: white; border: none; padding: 20px; border-radius: 15px; font-size: 18px; cursor: pointer; grid-column: span 2;">📚 LIBRARY</button>
        </div>
    `;
}

function renderLearn() {
    const container = document.getElementById('learn');
    const words = StateManager.getWordList().filter(w => w.active);
    
    if (!words.length) {
        container.innerHTML = '<p>No words available. Add words in settings.</p>';
        return;
    }
    
    learnIndex = learnIndex % words.length;
    const word = words[learnIndex];
    
    container.innerHTML = `
        <p style="color: #555; font-size: 20px;">Tap word to hear spelling!</p>
        <img src="${word.img}" style="width: 300px; max-width: 90%; height: 200px; object-fit: contain; border-radius: 20px; border: 5px solid #4ECDC4; background: white;">
        <div onclick="AudioManager.spellOut('${word.word}')" 
             style="font-size: 48px; color: #FF6B6B; font-weight: bold; margin: 20px; cursor: pointer; text-transform: lowercase; font-family: 'Comic Neue', cursive;">
            ${word.word}
        </div>
        <div style="display: flex; gap: 15px; width: 90%; max-width: 400px;">
            <button onclick="prevLearn()" style="flex: 1; padding: 15px; background: #FFE66D; border: none; border-radius: 10px; cursor: pointer;">⬅️ BACK</button>
            <button onclick="nextLearn()" style="flex: 1; padding: 15px; background: #4ECDC4; color: white; border: none; border-radius: 10px; cursor: pointer;">NEXT ➡️</button>
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

function renderSpell() {
    const container = document.getElementById('spell');
    container.innerHTML = `
        <p style="color: #555; font-size: 20px;">Spell mode coming soon!</p>
        <button onclick="showScreen('home')" style="padding: 15px 30px; background: #4ECDC4; color: white; border: none; border-radius: 10px; cursor: pointer;">Back to Home</button>
    `;
}

function renderMatch() {
    const container = document.getElementById('match');
    container.innerHTML = `
        <p style="color: #555; font-size: 20px;">Match mode coming soon!</p>
        <button onclick="showScreen('home')" style="padding: 15px 30px; background: #4ECDC4; color: white; border: none; border-radius: 10px; cursor: pointer;">Back to Home</button>
    `;
}

function renderChallenge() {
    const container = document.getElementById('challenge');
    container.innerHTML = `
        <p style="color: #555; font-size: 20px;">Challenge mode coming soon!</p>
        <button onclick="showScreen('home')" style="padding: 15px 30px; background: #4ECDC4; color: white; border: none; border-radius: 10px; cursor: pointer;">Back to Home</button>
    `;
}

function renderLibrary() {
    const container = document.getElementById('library');
    const words = StateManager.getWordList().filter(w => w.active);
    
    let html = '<p style="color: #555;">Tap word to hear it!</p><div style="width: 90%; max-width: 500px;">';
    
    words.forEach(w => {
        html += `
            <div onclick="AudioManager.speak('${w.word}')" 
                 style="background: white; padding: 15px; margin: 10px 0; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border: 2px solid #e0e0e0;">
                <span style="font-size: 24px; text-transform: lowercase; font-weight: bold; color: #555;">${w.word}</span>
                <span style="color: #f1c40f;">🌟 ${w.count}</span>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ===== START APP =====
document.addEventListener('DOMContentLoaded', function() {
    showScreen('home');
});
