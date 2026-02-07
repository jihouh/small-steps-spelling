import { CONSTANTS } from '../utils/constants.js';
import { EventEmitter } from '../utils/helpers.js';

export class ChallengeEngine extends EventEmitter {
    constructor(config) {
        super();
        this.config = {
            timeLimit: 60,
            words: [],
            ...config
        };
        
        this.state = {
            score: 0,
            streak: 0,
            timeRemaining: this.config.timeLimit,
            currentTask: null,
            isRunning: false,
            isPaused: false,
            stats: {
                correct: 0,
                incorrect: 0,
                practiceWords: new Set(),
                startTime: null,
                endTime: null
            }
        };
        
        this.timer = null;
        this.visibilityHandler = null;
    }

    start() {
        if (this.state.isRunning) return;
        
        this.state.isRunning = true;
        this.state.stats.startTime = Date.now();
        this.state.timeRemaining = this.config.timeLimit;
        
        this.setupVisibilityHandling();
        this.startTimer();
        this.nextTask();
        
        this.emit('start', { timeLimit: this.config.timeLimit });
    }

    setupVisibilityHandling() {
        this.visibilityHandler = () => {
            if (document.hidden) {
                this.pause();
            } else {
                // Optional: Auto-resume or wait for user
                // this.resume();
            }
        };
        document.addEventListener('visibilitychange', this.visibilityHandler);
    }

    startTimer() {
        this.emit('tick', { timeRemaining: this.state.timeRemaining });
        
        this.timer = setInterval(() => {
            if (this.state.isPaused) return;
            
            this.state.timeRemaining--;
            this.emit('tick', { timeRemaining: this.state.timeRemaining });
            
            if (this.state.timeRemaining <= 0) {
                this.end();
            } else if (this.state.timeRemaining <= 10) {
                this.emit('warning', { timeRemaining: this.state.timeRemaining });
            }
        }, 1000);
    }

    pause() {
        if (!this.state.isRunning || this.state.isPaused) return;
        this.state.isPaused = true;
        this.emit('pause');
    }

    resume() {
        if (!this.state.isRunning || !this.state.isPaused) return;
        this.state.isPaused = false;
        this.emit('resume');
    }

    nextTask() {
        const word = this.selectWeightedWord();
        const type = this.state.currentTask?.type === 'match' ? 'spell' : 'match';
        
        this.state.currentTask = {
            word,
            type,
            options: type === 'match' ? this.generateOptions(word) : null,
            startTime: Date.now()
        };
        
        this.emit('task', this.state.currentTask);
    }

    selectWeightedWord() {
        // Weight by inverse success count (spaced repetition)
        const weights = this.config.words.map(w => ({
            word: w,
            weight: 1 / ((w.count || 0) + 1)
        }));
        
        const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const item of weights) {
            random -= item.weight;
            if (random <= 0) return item.word;
        }
        
        return weights[0].word;
    }

    generateOptions(correctWord) {
        const options = [correctWord];
        const otherWords = this.config.words
            .filter(w => w.word !== correctWord.word)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
        
        options.push(...otherWords);
        return options.sort(() => 0.5 - Math.random());
    }

    submitAnswer(answer) {
        const task = this.state.currentTask;
        const isCorrect = task.type === 'match' 
            ? answer === task.word.word
            : answer === task.word.word.replace(/\s/g, '');
        
        const timeTaken = Date.now() - task.startTime;
        
        if (isCorrect) {
            this.handleCorrect(timeTaken);
        } else {
            this.handleIncorrect();
        }
        
        return isCorrect;
    }

    handleCorrect(timeTaken) {
        this.state.streak++;
        this.state.stats.correct++;
        
        // Calculate score with multipliers
        const basePoints = this.state.currentTask.type === 'match' 
            ? CONSTANTS.GAME.CHALLENGE_SCORE_MATCH 
            : CONSTANTS.GAME.CHALLENGE_SCORE_SPELL;
        
        const streakMultiplier = Math.min(
            1 + (this.state.streak - 1) * 0.5,
            CONSTANTS.GAME.MAX_STREAK_MULTIPLIER
        );
        
        const speedBonus = Math.max(0, Math.floor((5000 - timeTaken) / 1000));
        const points = Math.floor(basePoints * streakMultiplier) + speedBonus;
        
        this.state.score += points;
        
        this.emit('correct', {
            points,
            streak: this.state.streak,
            totalScore: this.state.score
        });
        
        // Brief delay before next task
        setTimeout(() => this.nextTask(), 600);
    }

    handleIncorrect() {
        this.state.streak = 0;
        this.state.stats.incorrect++;
        this.state.stats.practiceWords.add(this.state.currentTask.word.word);
        
        this.emit('incorrect', {
            correctAnswer: this.state.currentTask.word.word,
            practiceWords: Array.from(this.state.stats.practiceWords)
        });
    }

    end() {
        if (!this.state.isRunning) return;
        
        this.state.isRunning = false;
        this.state.stats.endTime = Date.now();
        
        clearInterval(this.timer);
        document.removeEventListener('visibilitychange', this.visibilityHandler);
        
        const duration = Math.floor(
            (this.state.stats.endTime - this.state.stats.startTime) / 1000
        );
        
        this.emit('end', {
            score: this.state.score,
            stats: {
                ...this.state.stats,
                practiceWords: Array.from(this.state.stats.practiceWords),
                duration
            }
        });
    }

    quit() {
        this.end();
        this.emit('quit');
    }

    getState() {
        return { ...this.state };
    }
}