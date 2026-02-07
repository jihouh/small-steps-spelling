export const CONSTANTS = {
    STORAGE_KEYS: {
        WORD_LIST: 'ss_wordlist',
        USER_NAME: 'ss_username',
        TOTAL_STARS: 'engTotalStars',
        SETTINGS: {
            RANDOM: 'ss_random',
            DIFFICULTY: 'ss_difficulty',
            CHALLENGE_TIMER: 'ss_ch_timer',
            HIGH_SCORE: 'ss_ch_high'
        }
    },
    
    DEFAULTS: {
        USER_NAME: 'Student',
        DIFFICULTY: 50,
        CHALLENGE_TIMER: 60,
        RANDOMIZE: false
    },
    
    GAME: {
        CHALLENGE_SCORE_MATCH: 10,
        CHALLENGE_SCORE_SPELL: 20,
        MAX_STREAK_MULTIPLIER: 3,
        CONFETTI_PARTICLES: 150
    },
    
    UI: {
        MIN_TOUCH_TARGET: 44,
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 4000,
        LETTER_DELAY: 450
    }
};

export const QUOTES = [
    "Mistakes are proof that you are trying! 🌟",
    "Every small step leads to a giant leap! 🚀",
    "You are doing a fantastic job! Keep going! 🌈",
    "Learning is a superpower! 🦸‍♂️🦸‍♀️",
    "Believe in yourself! ✨",
    "Practice makes progress! ✏️",
    "You are a spelling superstar! ⭐",
    "Awesome work today! 🎈"
];

export const ACHIEVEMENTS = [
    { id: 'first_word', name: 'First Steps', desc: 'Spell your first word', icon: '🎯' },
    { id: 'streak_3', name: 'Getting Warm', desc: '3 correct in a row', icon: '🔥' },
    { id: 'streak_5', name: 'On Fire!', desc: '5 correct in a row', icon: '⚡' },
    { id: 'master_5', name: 'Word Collector', desc: 'Master 5 words', icon: '📚' },
    { id: 'master_10', name: 'Word Master', desc: 'Master 10 words', icon: '👑' },
    { id: 'challenge_50', name: 'Score Hunter', desc: 'Score 50 in challenge', icon: '🏆' },
    { id: 'challenge_100', name: 'Champion', desc: 'Score 100 in challenge', icon: '🥇' },
    { id: 'perfect_run', name: 'Perfectionist', desc: 'Perfect challenge run', icon: '💎' }
];