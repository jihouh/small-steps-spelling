// Simple EventEmitter implementation
export class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (e) {
                console.error('Event handler error:', e);
            }
        });
    }

    once(event, callback) {
        const onceCallback = (data) => {
            this.off(event, onceCallback);
            callback(data);
        };
        this.on(event, onceCallback);
    }
}

// DOM utilities
export const DOM = {
    create(tag, classes = '', attributes = {}) {
        const el = document.createElement(tag);
        if (classes) el.className = classes;
        Object.entries(attributes).forEach(([key, val]) => {
            if (key === 'text') el.textContent = val;
            else if (key === 'html') el.innerHTML = val;
            else el.setAttribute(key, val);
        });
        return el;
    },

    $(selector, context = document) {
        return context.querySelector(selector);
    },

    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },

    clear(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
};

// Validation utilities
export const validators = {
    isValidWord(word) {
        return typeof word === 'string' 
            && word.length > 0 
            && word.length <= 50
            && /^[a-zA-Z\s]+$/.test(word);
    },

    isValidUrl(url) {
        try {
            const parsed = new URL(url);
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
            return false;
        }
    },

    sanitizeHTML(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
};

// Animation utilities
export const animations = {
    async confetti(options = {}) {
        if (typeof confetti === 'undefined') return;
        
        const defaults = {
            particleCount: CONSTANTS?.GAME?.CONFETTI_PARTICLES || 100,
            spread: 70,
            origin: { y: 0.6 }
        };
        
        return confetti({ ...defaults, ...options });
    },

    shake(element) {
        element.style.animation = 'shake 0.5s';
        setTimeout(() => element.style.animation = '', 500);
    },

    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms`;
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }
};