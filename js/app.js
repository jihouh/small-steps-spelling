import { state } from './core/StateManager.js';
import { audio } from './core/AudioManager.js';
import { HomeScreen } from './screens/HomeScreen.js';
import { LearnScreen } from './screens/LearnScreen.js';
import { SpellScreen } from './screens/SpellScreen.js';
import { MatchScreen } from './screens/MatchScreen.js';
import { ChallengeScreen } from './screens/ChallengeScreen.js';
import { LibraryScreen } from './screens/LibraryScreen.js';
import { AdminScreen } from './screens/AdminScreen.js';

class Application {
    constructor() {
        this.screens = new Map();
        this.currentScreen = null;
        this.toastContainer = null;
        this.navHandlers = new Map();
    }

    init() {
        this.registerScreens();
        this.setupNavigation();
        this.setupToastContainer();
        this.setupServiceWorker();
        
        // Initial navigation
        this.navigateTo('home');
        
        // Expose for debugging
        window.app = this;
        window.state = state;
    }

    registerScreens() {
        this.screens.set('home', new HomeScreen());
        this.screens.set('learn', new LearnScreen());
        this.screens.set('spell', new SpellScreen());
        this.screens.set('match', new MatchScreen());
        this.screens.set('challenge', new ChallengeScreen());
        this.screens.set('library', new LibraryScreen());
        this.screens.set('admin', new AdminScreen());
    }

    setupNavigation() {
        // Handle nav bar clicks
        document.querySelectorAll('.nav-item').forEach(item => {
            const screenId = item.id.replace('nav-', '');
            const handler = (e) => {
                e.preventDefault();
                this.navigateTo(screenId);
            };
            item.addEventListener('click', handler);
            this.navHandlers.set(item, handler);
        });
    }

    setupToastContainer() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.toastContainer);
    }

    async navigateTo(screenId) {
        if (this.currentScreen === screenId) return;
        
        // Cleanup current screen
        if (this.currentScreen) {
            const current = this.screens.get(this.currentScreen);
            if (current) await current.unmount();
            
            // Update nav
            const navItem = document.getElementById(`nav-${this.currentScreen === 'library' ? 'lib' : this.currentScreen}`);
            if (navItem) navItem.classList.remove('active');
        }
        
        // Cancel any playing audio
        audio.stop();
        
        // Mount new screen
        this.currentScreen = screenId;
        const next = this.screens.get(screenId);
        if (next) {
            await next.mount();
            
            // Update nav
            const navId = screenId === 'library' ? 'nav-lib' : `nav-${screenId}`;
            const navItem = document.getElementById(navId);
            if (navItem) navItem.classList.add('active');
            
            // Update state
            state.set('session.currentScreen', screenId);
        }
    }

    showToast(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            background: ${type === 'error' ? 'var(--primary)' : type === 'success' ? 'var(--success)' : 'var(--blue)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            font-family: 'Klee One', cursive;
            font-weight: bold;
        `;
        
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW registered:', reg))
                .catch(err => console.log('SW registration failed:', err));
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Application().init());
} else {
    new Application().init();
}