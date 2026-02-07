import { CONSTANTS } from '../utils/constants.js';

class AudioManager {
    constructor() {
        this.queue = [];
        this.isPlaying = false;
        this.currentUtterance = null;
        this.preferredVoice = null;
        this.settings = {
            rate: 0.85,      // Slower for children
            pitch: 1.0,
            volume: 1.0
        };
        
        this.init();
    }

    init() {
        // Load voices when available
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => this.selectVoice();
            this.selectVoice();
        }
    }

    selectVoice() {
        const voices = window.speechSynthesis.getVoices();
        
        // Priority: Child-friendly voices
        const preferred = [
            'Samantha',      // macOS
            'Google UK English Female',
            'Microsoft Zira',
            'Victoria',      // Older macOS
            'Female'         // Generic fallback
        ];

        for (const name of preferred) {
            const found = voices.find(v => v.name.includes(name));
            if (found) {
                this.preferredVoice = found;
                break;
            }
        }

        // Fallback to any English voice
        if (!this.preferredVoice) {
            this.preferredVoice = voices.find(v => v.lang.startsWith('en'));
        }
    }

    async speak(text, options = {}) {
        if (!window.speechSynthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Cancel current speech for immediate feedback
        if (options.immediate) {
            this.stop();
        }

        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            
            utterance.voice = this.preferredVoice;
            utterance.rate = options.rate ?? this.settings.rate;
            utterance.pitch = options.pitch ?? this.settings.pitch;
            utterance.volume = options.volume ?? this.settings.volume;
            utterance.lang = 'en-US';

            utterance.onstart = () => {
                this.isPlaying = true;
                this.currentUtterance = utterance;
            };

            utterance.onend = () => {
                this.isPlaying = false;
                this.currentUtterance = null;
                resolve();
            };

            utterance.onerror = (e) => {
                console.error('Speech error:', e);
                this.isPlaying = false;
                resolve();
            };

            window.speechSynthesis.speak(utterance);
        });
    }

    async spellOut(word) {
        const cleanWord = word.toLowerCase().trim();
        
        // Speak full word first
        await this.speak(cleanWord);
        await this.delay(800);
        
        // Spell each letter
        for (const char of cleanWord) {
            if (char !== ' ') {
                await this.speak(char, { rate: 0.7 });
                await this.delay(CONSTANTS.UI.LETTER_DELAY);
            }
        }
        
        // Repeat full word
        await this.delay(300);
        await this.speak(cleanWord);
    }

    async playSequence(items) {
        for (const item of items) {
            if (typeof item === 'string') {
                await this.speak(item);
            } else if (item.text) {
                await this.speak(item.text, item.options);
                if (item.delay) await this.delay(item.delay);
            }
        }
    }

    stop() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        this.isPlaying = false;
        this.currentUtterance = null;
        this.queue = [];
    }

    pause() {
        if (window.speechSynthesis?.paused === false) {
            window.speechSynthesis.pause();
        }
    }

    resume() {
        if (window.speechSynthesis?.paused === true) {
            window.speechSynthesis.resume();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Preload/cache common phrases
    preload() {
        // Warm up the speech engine
        const silent = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(silent);
    }
}

export const audio = new AudioManager();
export default audio;