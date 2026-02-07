import { BaseScreen } from './BaseScreen.js';
import { DOM } from '../utils/helpers.js';
import { state } from '../core/StateManager.js';
import { audio } from '../core/AudioManager.js';
import { QUOTES } from '../utils/constants.js';

export class HomeScreen extends BaseScreen {
    constructor() {
        super('home');
        this.quoteIndex = Math.floor(Math.random() * QUOTES.length);
    }

    render() {
        const container = DOM.create('div', 'screen-content');
        
        // Greeting
        this.greetingEl = DOM.create('h2', 'home-greeting', {
            style: 'font-family: "Klee One"; text-align: center; color: var(--primary); font-size: 32px; margin: 0;'
        });
        
        // Quote card
        const quoteCard = DOM.create('div', 'quote-card', {
            style: 'background: white; padding: 15px; border-radius: 20px; border: 2px dashed var(--secondary); margin: 15px 0; width: 100%; text-align: center; cursor: pointer; box-shadow: 0 4px 0 var(--shadow);'
        });
        
        this.quoteEl = DOM.create('p', '', {
            id: 'motivational-quote',
            style: 'font-family: "Klee One", cursive; color: #555; font-size: 18px; margin: 0;'
        });
        
        const quoteHint = DOM.create('div', '', {
            text: '(Tap to listen)',
            style: 'font-size: 10px; color: #aaa; margin-top: 5px;'
        });
        
        quoteCard.append(this.quoteEl, quoteHint);
        quoteCard.addEventListener('click', () => this.readQuote());
        
        // Stars display
        this.starsEl = DOM.create('div', '', {
            id: 'stars-total',
            style: 'font-family: "Klee One"; color: var(--blue); font-size: 20px; text-align: center;'
        });
        
        // Button grid
        const buttonGrid = DOM.create('div', 'home-grid', {
            style: 'display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; margin-top: 20px;'
        });
        
        // Create buttons
        const buttons = [
            { text: '📖 LEARN', color: 'var(--secondary)', screen: 'learn' },
            { text: '✏️ SPELL', color: 'var(--blue)', screen: 'spell' },
            { text: '🧩 MATCH', color: 'var(--purple)', screen: 'match' },
            { text: '🔥 CHALLENGE', color: 'var(--challenge)', screen: 'challenge' },
            { text: '📚 LIBRARY', color: 'var(--primary)', screen: 'library', wide: true }
        ];
        
        buttons.forEach(btn => {
            const button = DOM.create('button', 'action-btn', {
                text: btn.text,
                style: `
                    background: ${btn.color};
                    padding: 10px;
                    border-radius: 20px;
                    border: none;
                    color: white;
                    font-weight: 900;
                    cursor: pointer;
                    font-family: "Klee One", cursive;
                    font-size: 16px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    ${btn.wide ? 'grid-column: span 2;' : ''}
                `
            });
            button.addEventListener('click', () => this.navigateTo(btn.screen));
            buttonGrid.appendChild(button);
        });
        
        container.append(this.greetingEl, quoteCard, this.starsEl, buttonGrid);
        
        return container;
    }

    async onMount() {
        this.updateDisplay();
        
        // Subscribe to changes
        this.subscribe('user.name', () => this.updateDisplay());
        this.subscribe('user.totalStars', () => this.updateDisplay());
    }

    updateDisplay() {
        const userName = state.get('user.name');
        const totalStars = state.get('user.totalStars');
        
        this.greetingEl.textContent = `Hi ${userName}! 👋`;
        this.quoteEl.textContent = QUOTES[this.quoteIndex];
        this.starsEl.textContent = `🌟 ${totalStars} Mastery Stars`;
    }

    readQuote() {
        const quote = QUOTES[this.quoteIndex];
        audio.speak(quote);
    }
}
