import { BaseScreen } from './BaseScreen.js';
import { DOM } from '../utils/helpers.js';
import { state } from '../core/StateManager.js';
import { audio } from '../core/AudioManager.js';

export class LearnScreen extends BaseScreen {
    constructor() {
        super('learn');
        this.currentIndex = 0;
    }

    render() {
        const container = DOM.create('div', 'screen-content');
        
        this.instructionEl = DOM.create('div', 'instruction-text', {
            text: 'Tap word to hear spelling!'
        });
        
        this.imageEl = DOM.create('img', 'card-img', {
            alt: 'Learning image',
            loading: 'lazy'
        });
        
        this.wordEl = DOM.create('div', 'learn-word', {
            text: 'word',
            'aria-label': 'Current word'
        });
        this.wordEl.style.cssText = 'font-size: 3rem; color: var(--primary); font-family: "Comic Neue"; font-weight: bold; margin: 20px 0; cursor: pointer; text-transform: lowercase;';
        
        const controls = DOM.create('div', '', {
            style: 'display:flex; gap:15px; width: 100%;'
        });
        
        this.backBtn = DOM.create('button', 'action-btn', {
            text: '⬅️ BACK',
            style: 'background:var(--accent); color:black; flex:1;'
        });
        
        this.nextBtn = DOM.create('button', 'action-btn', {
            text: 'NEXT ➡️',
            style: 'background:var(--secondary); flex:1;'
        });
        
        controls.append(this.backBtn, this.nextBtn);
        container.append(this.instructionEl, this.imageEl, this.wordEl, controls);
        
        return container;
    }

    async onMount() {
        this.updateDisplay();
        
        // Subscribe to word list changes
        this.subscribe('progress.wordList', () => {
            if (this.isActive) this.updateDisplay();
        });
    }

    bindEvents() {
        this.wordEl.addEventListener('click', () => this.handleWordClick());
        this.backBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
        
        // Keyboard navigation
        this.keyHandler = (e) => {
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
            if (e.key === ' ') {
                e.preventDefault();
                this.handleWordClick();
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    }

    onUnmount() {
        document.removeEventListener('keydown', this.keyHandler);
    }

    getActiveWords() {
        return state.getActiveWords();
    }

    updateDisplay() {
        const words = this.getActiveWords();
        if (!words.length) {
            this.wordEl.textContent = 'No words available';
            this.imageEl.style.display = 'none';
            return;
        }
        
        // Ensure index is valid
        this.currentIndex = ((this.currentIndex % words.length) + words.length) % words.length;
        const word = words[this.currentIndex];
        
        this.currentWord = word;
        this.imageEl.src = word.img;
        this.imageEl.style.display = 'block';
        this.wordEl.textContent = word.word;
        this.wordEl.setAttribute('aria-label', `Word: ${word.word}`);
        
        // Announce for screen readers
        this.announce(`Showing word: ${word.word}`);
    }

    async handleWordClick() {
        if (!this.currentWord) return;
        
        this.wordEl.style.transform = 'scale(1.1)';
        setTimeout(() => this.wordEl.style.transform = '', 200);
        
        await audio.spellOut(this.currentWord.word);
    }

    navigate(direction) {
        const words = this.getActiveWords();
        if (!words.length) return;
        
        this.currentIndex += direction;
        this.updateDisplay();
        
        // Save position to state
        state.set('session.indices.learn', this.currentIndex);
    }

    announce(message) {
        // Create live region for screen readers
        let liveRegion = document.getElementById('aria-live');
        if (!liveRegion) {
            liveRegion = DOM.create('div', '', {
                id: 'aria-live',
                'aria-live': 'polite',
                'aria-atomic': 'true',
                style: 'position:absolute; left:-10000px;'
            });
            document.body.appendChild(liveRegion);
        }
        liveRegion.textContent = message;
    }
}