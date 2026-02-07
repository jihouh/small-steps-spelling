import { CONSTANTS } from '../utils/constants.js';
import { DEFAULT_WORDS } from '../../assets/data/defaultWords.js';

class StateManager {
    constructor() {
        this.state = this.loadInitialState();
        this.listeners = new Map();
        this.batchUpdate = false;
        this.pendingUpdates = new Set();
    }

    loadInitialState() {
        return {
            user: {
                name: this.getStorage(CONSTANTS.STORAGE_KEYS.USER_NAME, CONSTANTS.DEFAULTS.USER_NAME),
                totalStars: parseInt(this.getStorage(CONSTANTS.STORAGE_KEYS.TOTAL_STARS, '0')),
                achievements: this.getStorage('ss_achievements', []).split(',').filter(Boolean)
            },
            settings: {
                randomize: this.getStorage(CONSTANTS.STORAGE_KEYS.SETTINGS.RANDOM, 'false') === 'true',
                difficulty: parseInt(this.getStorage(CONSTANTS.STORAGE_KEYS.SETTINGS.DIFFICULTY, CONSTANTS.DEFAULTS.DIFFICULTY)),
                challengeTimer: parseInt(this.getStorage(CONSTANTS.STORAGE_KEYS.SETTINGS.CHALLENGE_TIMER, CONSTANTS.DEFAULTS.CHALLENGE_TIMER))
            },
            progress: {
                wordList: this.loadWordList(),
                challengeHighScore: parseInt(this.getStorage(CONSTANTS.STORAGE_KEYS.SETTINGS.HIGH_SCORE, '0')),
                sessions: []
            },
            session: {
                currentScreen: 'home',
                indices: { learn: 0, match: 0, spell: 0 },
                challenge: {
                    active: false,
                    score: 0,
                    streak: 0,
                    timer: null,
                    timeRemaining: 0,
                    stats: { correct: 0, wrong: 0, practiceWords: new Set() }
                }
            }
        };
    }

    getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item !== null ? item : defaultValue;
        } catch (e) {
            console.warn('localStorage unavailable:', e);
            return defaultValue;
        }
    }

    loadWordList() {
        try {
            const stored = localStorage.getItem(CONSTANTS.STORAGE_KEYS.WORD_LIST);
            if (!stored) return [...DEFAULT_WORDS];
            
            const parsed = JSON.parse(stored);
            // Validate structure
            if (!Array.isArray(parsed)) return [...DEFAULT_WORDS];
            
            return parsed.map(w => ({
                word: String(w.word || ''),
                img: String(w.img || ''),
                count: parseInt(w.count) || 0,
                active: Boolean(w.active)
            })).filter(w => w.word && w.img);
        } catch (e) {
            console.error('Failed to load word list:', e);
            return [...DEFAULT_WORDS];
        }
    }

    // Reactive state access
    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.state);
    }

    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, this.state);
        
        const oldValue = target[lastKey];
        target[lastKey] = value;
        
        if (!this.batchUpdate) {
            this.notify(path, value, oldValue);
        } else {
            this.pendingUpdates.add(path);
        }
        
        this.persist(path, value);
        return this;
    }

    batch(callback) {
        this.batchUpdate = true;
        callback(this);
        this.batchUpdate = false;
        
        this.pendingUpdates.forEach(path => {
            const value = this.get(path);
            this.notify(path, value);
        });
        this.pendingUpdates.clear();
    }

    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, new Set());
        }
        this.listeners.get(path).add(callback);
        
        // Return unsubscribe function
        return () => this.listeners.get(path).delete(callback);
    }

    notify(path, newValue, oldValue) {
        // Notify specific path listeners
        const specificListeners = this.listeners.get(path);
        if (specificListeners) {
            specificListeners.forEach(cb => cb(newValue, oldValue, path));
        }
        
        // Notify wildcard listeners
        const wildcardListeners = this.listeners.get('*');
        if (wildcardListeners) {
            wildcardListeners.forEach(cb => cb(newValue, oldValue, path));
        }
    }

    persist(path, value) {
        // Map state paths to storage keys
        const storageMap = {
            'user.name': CONSTANTS.STORAGE_KEYS.USER_NAME,
            'user.totalStars': CONSTANTS.STORAGE_KEYS.TOTAL_STARS,
            'settings.randomize': CONSTANTS.STORAGE_KEYS.SETTINGS.RANDOM,
            'settings.difficulty': CONSTANTS.STORAGE_KEYS.SETTINGS.DIFFICULTY,
            'settings.challengeTimer': CONSTANTS.STORAGE_KEYS.SETTINGS.CHALLENGE_TIMER,
            'progress.wordList': CONSTANTS.STORAGE_KEYS.WORD_LIST,
            'progress.challengeHighScore': CONSTANTS.STORAGE_KEYS.SETTINGS.HIGH_SCORE
        };

        const key = storageMap[path];
        if (key) {
            try {
                const storageValue = typeof value === 'object' 
                    ? JSON.stringify(value) 
                    : String(value);
                localStorage.setItem(key, storageValue);
            } catch (e) {
                console.error('Failed to persist:', path, e);
            }
        }
    }

    // Helper methods
    getActiveWords(randomize = null) {
        const shouldRandomize = randomize ?? this.state.settings.randomize;
        const active = this.state.progress.wordList.filter(w => w.active);
        
        if (shouldRandomize) {
            return [...active].sort(() => 0.5 - Math.random());
        }
        return active;
    }

    incrementWordCount(word) {
        const list = this.state.progress.wordList;
        const item = list.find(w => w.word === word);
        if (item) {
            item.count++;
            this.set('progress.wordList', [...list]);
            this.set('user.totalStars', this.state.user.totalStars + 1);
            return true;
        }
        return false;
    }

    resetProgress() {
        const resetList = this.state.progress.wordList.map(w => ({
            ...w,
            count: 0
        }));
        
        this.batch(state => {
            state.set('progress.wordList', resetList);
            state.set('user.totalStars', 0);
            state.set('progress.challengeHighScore', 0);
            state.set('user.achievements', []);
        });
    }

    exportData() {
        return {
            version: 2,
            exportedAt: new Date().toISOString(),
            user: this.state.user,
            settings: this.state.settings,
            progress: {
                wordList: this.state.progress.wordList,
                challengeHighScore: this.state.progress.challengeHighScore
            }
        };
    }

    importData(data) {
        if (!data || data.version !== 2) {
            throw new Error('Invalid or incompatible data format');
        }

        this.batch(state => {
            if (data.user) {
                state.set('user.name', data.user.name);
                state.set('user.totalStars', data.user.totalStars || 0);
            }
            if (data.settings) {
                state.set('settings.randomize', data.settings.randomize ?? false);
                state.set('settings.difficulty', data.settings.difficulty ?? 50);
                state.set('settings.challengeTimer', data.settings.challengeTimer ?? 60);
            }
            if (data.progress?.wordList) {
                state.set('progress.wordList', data.progress.wordList);
            }
            if (data.progress?.challengeHighScore) {
                state.set('progress.challengeHighScore', data.progress.challengeHighScore);
            }
        });

        return true;
    }
}

export const state = new StateManager();
export default state;