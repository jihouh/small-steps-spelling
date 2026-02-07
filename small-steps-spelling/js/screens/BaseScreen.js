import { DOM } from '../utils/helpers.js';
import { state } from '../core/StateManager.js';
import { audio } from '../core/AudioManager.js';

export class BaseScreen {
    constructor(id, options = {}) {
        this.id = id;
        this.element = document.getElementById(id);
        this.options = options;
        this.subscriptions = [];
        this.isActive = false;
    }

    // Lifecycle methods
    async mount() {
        this.isActive = true;
        this.element.classList.add('active-screen');
        DOM.clear(this.element);
        
        const content = this.render();
        if (content) {
            this.element.appendChild(content);
        }
        
        await this.onMount();
        this.bindEvents();
    }

    async unmount() {
        this.isActive = false;
        this.element.classList.remove('active-screen');
        
        // Cleanup subscriptions
        this.subscriptions.forEach(unsub => unsub());
        this.subscriptions = [];
        
        this.onUnmount();
    }

    // Override these in subclasses
    render() {
        // Return DOM element or DocumentFragment
        return null;
    }

    async onMount() {
        // Screen-specific initialization
    }

    onUnmount() {
        // Cleanup
    }

    bindEvents() {
        // Event binding
    }

    // Helpers
    subscribe(path, callback) {
        const unsub = state.subscribe(path, callback);
        this.subscriptions.push(unsub);
        return unsub;
    }

    speak(text, options) {
        return audio.speak(text, options);
    }

    navigateTo(screenId) {
        window.app.navigateTo(screenId);
    }

    showToast(message, type = 'info') {
        window.app.showToast(message, type);
    }
}