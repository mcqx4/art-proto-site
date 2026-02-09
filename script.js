/* ============================================
   RETRO TECH-NOIR VHS PORTFOLIO
   Art Proto — JavaScript
   ============================================ */

// ============================================
// GENERATIVE BACKGROUND CANVAS
// ============================================

class GenerativeBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.gridSize = 50;
        this.time = 0;

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const cols = Math.ceil(this.canvas.width / this.gridSize);
        const rows = Math.ceil(this.canvas.height / this.gridSize);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                this.particles.push({
                    x: i * this.gridSize,
                    y: j * this.gridSize,
                    baseX: i * this.gridSize,
                    baseY: j * this.gridSize,
                    size: Math.random() * 3 + 2,
                    speedX: 0,
                    speedY: 0,
                    life: Math.random()
                });
            }
        }

    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });

        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = e.clientX;
            this.targetMouse.y = e.clientY;
        });
    }

    animate() {
        this.time += 0.01;

        // Smooth mouse following
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;

        this.ctx.fillStyle = 'rgba(10, 14, 26, 0.15)'; // Increased opacity for better contrast
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Calculate distance from mouse
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 200;

            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                particle.speedX -= (dx / distance) * force * 2;
                particle.speedY -= (dy / distance) * force * 2;
            }

            // Return to base position
            particle.speedX += (particle.baseX - particle.x) * 0.02;
            particle.speedY += (particle.baseY - particle.y) * 0.02;

            // Apply friction
            particle.speedX *= 0.9;
            particle.speedY *= 0.9;

            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Update life for pulsing effect
            particle.life += 0.02;

            // Draw particle
            const alpha = 0.5 + Math.sin(particle.life) * 0.3; // Increased brightness
            const size = particle.size + Math.sin(particle.life * 2) * 0.5;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
            this.ctx.fill();

            // Draw connecting lines
            this.particles.forEach(other => {
                const dist = Math.sqrt(
                    Math.pow(particle.x - other.x, 2) +
                    Math.pow(particle.y - other.y, 2)
                );

                if (dist < 80 && dist > 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - dist / 80)})`; // Increased line opacity
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });

        // Draw noise/static effect
        this.drawNoise();

        requestAnimationFrame(() => this.animate());
    }

    drawNoise() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < 0.001) {
                const noise = Math.random() * 50;
                data[i] += noise;     // R
                data[i + 1] += noise; // G
                data[i + 2] += noise; // B
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
    }
}

// ============================================
// VHS TIMECODE
// ============================================

class VHSTimecode {
    constructor(element) {
        this.element = element;
        this.startTime = Date.now();
        this.update();
    }

    update() {
        const elapsed = Date.now() - this.startTime;
        const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');

        this.element.textContent = `${hours}:${minutes}:${seconds}`;

        requestAnimationFrame(() => this.update());
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================

class SmoothScroll {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (href === '#') return; // skip bare # links
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll(
            '.section-header, .terminal-block, .data-block, .skill-card, .project-card, .contact-card'
        );
        this.init();
    }

    init() {
        this.elements.forEach(el => el.classList.add('fade-in'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.elements.forEach(el => observer.observe(el));
    }
}

// ============================================
// NAVIGATION ACTIVE STATE
// ============================================

class NavigationHighlight {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${entry.target.id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.3
            }
        );

        this.sections.forEach(section => observer.observe(section));
    }
}

// ============================================
// GLITCH EFFECT
// ============================================

class GlitchEffect {
    constructor() {
        this.elements = document.querySelectorAll('.title-line');
        this.bindEvents();
    }

    bindEvents() {
        this.elements.forEach(el => {
            el.addEventListener('mouseenter', () => this.triggerGlitch(el));
        });
    }

    triggerGlitch(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'glitch 0.3s ease';
    }
}

// ============================================
// PROJECT CARDS HOVER
// ============================================

class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.bindEvents();
    }

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMove(e, card));
            card.addEventListener('mouseleave', (e) => this.handleLeave(e, card));
        });
    }

    handleMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    }

    handleLeave(e, card) {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
    }
}

// ============================================
// AI CHAT WIDGET
// ============================================

class VoiceAgent {
    constructor() {
        this.agentId = 'agent_0701kgw80rpefhw824fqvyf3wrzv';
        this.widget = document.getElementById('voice-agent');
        this.toggle = document.getElementById('voice-toggle');
        this.panel = document.getElementById('voice-panel');
        this.closeBtn = document.getElementById('voice-panel-close');
        this.statusText = document.getElementById('voice-status-text');
        this.statusDot = document.getElementById('voice-status-dot');
        this.modeEl = document.getElementById('voice-mode');
        this.canvas = document.getElementById('voice-canvas');
        this.transcript = document.getElementById('voice-transcript');
        this.muteBtn = document.getElementById('voice-mute');
        this.callBtn = document.getElementById('voice-call');
        this.callIcon = document.getElementById('voice-call-icon');
        this.endBtn = document.getElementById('voice-end');

        this.ctx = this.canvas.getContext('2d');
        this.conversation = null;
        this.isOpen = false;
        this.isConnected = false;
        this.isMuted = false;
        this.animFrameId = null;

        this.bindEvents();
        this.drawIdle();
    }

    bindEvents() {
        this.toggle.addEventListener('click', () => this.togglePanel());
        this.closeBtn.addEventListener('click', () => this.closePanel());
        this.callBtn.addEventListener('click', () => this.startConversation());
        this.endBtn.addEventListener('click', () => this.endConversation());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
    }

    togglePanel() {
        this.isOpen = !this.isOpen;
        this.panel.classList.toggle('active', this.isOpen);
    }

    closePanel() {
        this.isOpen = false;
        this.panel.classList.remove('active');
    }

    async startConversation() {
        if (this.isConnected) return;

        this.setStatus('CONNECTING...');
        this.callBtn.disabled = true;
        this.callIcon.textContent = '...';

        try {
            const sdk = window.client;
            const Conversation = sdk?.Conversation;
            if (!Conversation) {
                console.error('ElevenLabs SDK not loaded. window.client:', sdk);
                this.setStatus('SDK ERROR');
                this.callBtn.disabled = false;
                this.callIcon.textContent = 'START';
                return;
            }
            console.log('ElevenLabs SDK loaded, starting session...');

            await navigator.mediaDevices.getUserMedia({ audio: true });

            this.conversation = await Conversation.startSession({
                agentId: this.agentId,
                onConnect: () => {
                    this.isConnected = true;
                    this.widget.classList.add('active');
                    this.setStatus('PROTO_AI // ONLINE');
                    this.callBtn.disabled = true;
                    this.endBtn.disabled = false;
                    this.muteBtn.disabled = false;
                    this.callIcon.textContent = 'LIVE';
                    this.startVisualizer();
                },
                onDisconnect: () => {
                    this.handleDisconnect();
                },
                onModeChange: ({ mode }) => {
                    this.setMode(mode);
                },
                onMessage: (message) => {
                    this.handleMessage(message);
                },
                onStatusChange: ({ status }) => {
                    if (status === 'connecting') this.setStatus('CONNECTING...');
                    if (status === 'connected') this.setStatus('PROTO_AI // ONLINE');
                    if (status === 'disconnected') this.handleDisconnect();
                },
                onError: (error) => {
                    console.error('VoiceAgent error:', error);
                    this.setStatus('ERROR // RETRY');
                    this.handleDisconnect();
                }
            });
        } catch (err) {
            console.error('Failed to start conversation:', err);
            this.setStatus('MIC DENIED');
            this.callBtn.disabled = false;
            this.callIcon.textContent = 'START';
        }
    }

    async endConversation() {
        if (this.conversation) {
            await this.conversation.endSession();
            this.conversation = null;
        }
        this.handleDisconnect();
    }

    handleDisconnect() {
        this.isConnected = false;
        this.widget.classList.remove('active');
        this.setStatus('PROTO_AI // READY');
        this.setMode('');
        this.callBtn.disabled = false;
        this.endBtn.disabled = true;
        this.muteBtn.disabled = true;
        this.callIcon.textContent = 'START';
        this.isMuted = false;
        this.muteBtn.classList.remove('muted');
        this.muteBtn.querySelector('.voice-btn-icon').textContent = 'MIC';
        this.stopVisualizer();
        this.drawIdle();
    }

    toggleMute() {
        if (!this.conversation) return;
        this.isMuted = !this.isMuted;
        this.conversation.setMicMuted(this.isMuted);
        this.muteBtn.classList.toggle('muted', this.isMuted);
        this.muteBtn.querySelector('.voice-btn-icon').textContent = this.isMuted ? 'MUTED' : 'MIC';
    }

    setStatus(text) {
        this.statusText.textContent = text;
    }

    setMode(mode) {
        const labels = {
            listening: '[ LISTENING ]',
            speaking: '[ SPEAKING ]',
            thinking: '[ THINKING... ]',
            '': ''
        };
        this.modeEl.textContent = labels[mode] || '';
    }

    handleMessage(message) {
        if (!message) return;

        let text = '';
        let type = '';

        if (message.source === 'ai' && message.message) {
            text = message.message;
            type = 'agent';
        } else if (message.source === 'user' && message.message) {
            text = message.message;
            type = 'user';
        }

        if (!text) return;

        const line = document.createElement('div');
        line.className = `voice-transcript-line voice-transcript-line--${type}`;
        const label = type === 'agent' ? 'PROTO_AI' : 'YOU';
        line.innerHTML = `<span class="voice-transcript-label">${label}</span>${text}`;
        this.transcript.appendChild(line);
        this.transcript.scrollTop = this.transcript.scrollHeight;
    }

    // Audio visualizer
    startVisualizer() {
        this.stopVisualizer();
        const draw = () => {
            this.animFrameId = requestAnimationFrame(draw);
            this.drawBars();
        };
        draw();
    }

    stopVisualizer() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    drawBars() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);

        let spectrum = null;
        let color = '0, 212, 255'; // cyan

        if (this.conversation) {
            const out = this.conversation.getOutputByteFrequencyData?.();
            const inp = this.conversation.getInputByteFrequencyData?.();

            if (out && out.some(v => v > 0)) {
                spectrum = out;
                color = '0, 255, 136'; // green when agent speaks
            } else if (inp && inp.some(v => v > 0)) {
                spectrum = inp;
                color = '0, 212, 255'; // cyan when user speaks
            }
        }

        const barCount = 32;
        const barWidth = (w / barCount) - 2;
        const gap = 2;

        if (spectrum) {
            const step = Math.floor(spectrum.length / barCount);
            for (let i = 0; i < barCount; i++) {
                const val = spectrum[i * step] / 255;
                const barH = Math.max(2, val * h * 0.85);
                const x = i * (barWidth + gap);
                const y = (h - barH) / 2;

                this.ctx.fillStyle = `rgba(${color}, ${0.3 + val * 0.7})`;
                this.ctx.fillRect(x, y, barWidth, barH);

                // Glow
                this.ctx.shadowColor = `rgba(${color}, 0.5)`;
                this.ctx.shadowBlur = 6;
                this.ctx.fillRect(x, y, barWidth, barH);
                this.ctx.shadowBlur = 0;
            }
        } else {
            // Idle: flat lines with slight ambient animation
            const time = Date.now() / 1000;
            for (let i = 0; i < barCount; i++) {
                const val = 0.05 + Math.sin(time * 1.5 + i * 0.3) * 0.03;
                const barH = Math.max(2, val * h);
                const x = i * (barWidth + gap);
                const y = (h - barH) / 2;
                this.ctx.fillStyle = `rgba(${color}, 0.25)`;
                this.ctx.fillRect(x, y, barWidth, barH);
            }
        }

        // Scanline effect
        this.ctx.fillStyle = 'rgba(10, 14, 26, 0.15)';
        for (let y = 0; y < h; y += 4) {
            this.ctx.fillRect(0, y, w, 2);
        }
    }

    drawIdle() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);

        const barCount = 32;
        const barWidth = (w / barCount) - 2;
        const gap = 2;

        for (let i = 0; i < barCount; i++) {
            const barH = 2;
            const x = i * (barWidth + gap);
            const y = (h - barH) / 2;
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
            this.ctx.fillRect(x, y, barWidth, barH);
        }

        // Scanline
        this.ctx.fillStyle = 'rgba(10, 14, 26, 0.15)';
        for (let y = 0; y < h; y += 4) {
            this.ctx.fillRect(0, y, w, 2);
        }
    }
}

// ============================================
// TYPING EFFECT
// ============================================

class TypingEffect {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    start() {
        this.element.textContent = '';
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// ============================================
// CURSOR TRAIL
// ============================================

class CursorTrail {
    constructor() {
        this.trail = [];
        this.trailLength = 10;
        this.init();
    }

    init() {
        for (let i = 0; i < this.trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            dot.style.cssText = `
                position: fixed;
                width: ${8 - i * 0.5}px;
                height: ${8 - i * 0.5}px;
                background: rgba(0, 212, 255, ${0.5 - i * 0.04});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
                transform: translate(-50%, -50%);
            `;
            document.body.appendChild(dot);
            this.trail.push({ element: dot, x: 0, y: 0 });
        }

        document.addEventListener('mousemove', (e) => this.update(e));
    }

    update(e) {
        this.trail[0].x = e.clientX;
        this.trail[0].y = e.clientY;

        for (let i = 1; i < this.trail.length; i++) {
            this.trail[i].x += (this.trail[i - 1].x - this.trail[i].x) * 0.3;
            this.trail[i].y += (this.trail[i - 1].y - this.trail[i].y) * 0.3;
        }

        this.trail.forEach(dot => {
            dot.element.style.left = `${dot.x}px`;
            dot.element.style.top = `${dot.y}px`;
        });
    }
}

// ============================================
// MAGNETIC BUTTONS
// ============================================

class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.project-link, .contact-card, .ai-toggle');
        this.bindEvents();
    }

    bindEvents() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => this.handleMove(e, button));
            button.addEventListener('mouseleave', (e) => this.handleLeave(e, button));
        });
    }

    handleMove(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }

    handleLeave(e, button) {
        button.style.transform = 'translate(0, 0)';
    }
}

// ============================================
// RANDOM GLITCH
// ============================================

class RandomGlitch {
    constructor() {
        this.elements = document.querySelectorAll('.title-line--accent, .project-title');
        this.scheduleGlitch();
    }

    scheduleGlitch() {
        const delay = 3000 + Math.random() * 7000;
        setTimeout(() => {
            this.triggerRandomGlitch();
            this.scheduleGlitch();
        }, delay);
    }

    triggerRandomGlitch() {
        const element = this.elements[Math.floor(Math.random() * this.elements.length)];
        if (element) {
            element.classList.add('glitch-text');
            element.setAttribute('data-text', element.textContent);

            setTimeout(() => {
                element.classList.remove('glitch-text');
            }, 200);
        }
    }
}

// ============================================
// ASCII PORTRAIT GALLERY
// ============================================

class ASCIIPortrait {
    constructor() {
        this.terminal = document.querySelector('.ascii-terminal');
        this.portrait = document.getElementById('ascii-portrait');
        this.coords = document.getElementById('ascii-coords');
        this.viewport = document.querySelector('.ascii-viewport');

        this.currentIndex = 0;
        this.arts = [];
        this.targetSize = 80; // Square size in characters

        if (this.terminal && this.portrait) {
            this.loadArts();
            this.bindEvents();
            this.startRandomGlitch();
        } else {
            console.warn('ASCII terminal or portrait element not found');
        }
    }

    loadArts() {
        // Only main portrait art - load from file content directly
        const rawArts = [
            // Art 1 - Main portrait
`ÏüÇü666666666ÇÇ6ÇÇÞGÞÇÞÞÇ66zü6ÇÞÞÞÅÅgÇÇ6üü6ÏÏÏüÏüüÏü6ü6üÏüÏÏÏÏÏÇÇ6üÏ6üüüüüÏÞÇÞíÏÏzÏÏÏÏÏzÏÏzzzzííííí—
6ÞGÞGGGGGGGGGÞÞGGÅÇzÏüzÇÞ6ÅüÞÏí{ü66ÇÞgÅÅÅÅÅÅggÞÇÇÇÇÞÞÇÞÞÞGGGGgGÇÞÞGÞG66ÞGÞGgGgÇÇÇÇÇÞÞÇÇÇÇ6ÇÇü6ÇÇÇÇÇí
üÞGgÞÞGGGÞÞÞÞÇggííÞÅÅÅ6Ï›          {ügÇ—6{ÞÞÅÅÅÆÆÆÅgÞüÇÞÇG6ÞÞÞGÞÞÞÇ6ggÞgG6Þ6üüÇGGÞÞÞÞÞÞÇGÇÇ666ÇÇÇÇ6Ï
6GGGgÞGGGgÞÇGgÅGÆÆÇí                    Ïí6 {6{ÇÅggÇÆGÆÇGgGÇÞÇÅGGgÅÅÅgÆÆÅÅÅgÆüz{{zzÞ66Þ6ÇÇÇ666ÇÇÇÇGz
6GGGGGGÞÞGÆÆÆÅÅü›                                íÅÅÅ{ÆgÅÏÇGgÅÅgÇÇ6Çg6Ïz6ügÆÆÆÆÅGGzz66ÇÇüÏÏü6ÇÇ6ÞÇÇÏ
6ÞÞGggGÅÆÆG— —                                      ››íÅgíGgÅ6ÅÅügÅ—› z        ÅÅgÆÅÞ{ÞüÇÇÇü6zÇÞÇÞG6
6gGÞüzÞÞü›                                             6› zÇzGG›› Æ         —6{—{   üÞÅÏzÇ66ÞÇÇ66ÞG6
ÇGÇÞÆÅz                                                  6{Ï              ›{     zgGGz  Ç6zÇüÇ6ÇÞ6Þü
zÇG{›  ›z6í›                                                   íÆz—{ Åü ›    —›      {íÅg  ÅzgÞÞÞÞGÏ
ÇÅGz›ÆÆÅÇ ›                                                                             zÏÅí ÏügÅGGÇ
—ÏüÇzgÏü                                                    {ÅÆÅ—ÅÅGÞÞü—                 ›ü{G—››GÅÅÇ
{G{üÆgíüí›                                                    ›  {›{    ›   ›              ízÇÅÇ› Æg
6ÆÏ6G›üzí                                                                         ›          ÏzÏÅü›z
Ï6{ÅÏgÞ—                                                                                       ÞüÅÆ 
Çg6Þ{Ï{                                                                         {                ÅÏÅ
zGüü››                                                                                          — ü{
GÅÏ››6                                                                             {              6›
 › z—                                               ›—›——› ›                                       z
 zÏ              í                                ›—›››››››››                                       
   z›—        Æ{                               ›———————{í{—››—›                     ›               
íG{6        6                              ›››››———{—{——›››››    ›                                  
—Å  í—                                       › ››››››››—zÏí{{—›—                                    
        {                                ›››—————{{ízzí{{››  ›                                      
                                       ›››      ›››     ›—{íÏüí{—›››                                
                                       ››››———{{——{{ízüüü{—    ›››                                  
                                          ›››››——{—————   {66ü{——››——›                              
                                      ››››————›———›———{üGü{—›——{íz———›                              
 —                                    › ››——››———{—{{{í{——ÇgÆÅÅÇz{üÏz{› ›                           
  z                                  ››››››››——————{{——{6ü{              —                          
                                 ›—{{{{{{———{———————{—{{›                                           
    {                                   {{——›——————————›       ›››—{—                               
  {{                                      —›——›———————›   ›———››——›››››››                           
—z                                          ›››››———›››  ››                                         
 í›{                             ›                ››                                                
                                                   ››         —{íí{——                               
   ››                                            ›—›                                                
                                                 {z—                                       ›        
      í›{›                                      ›—{—              ›    ›                            
                                                ›{{{›                 ››                        z   
                                                —{íí{   ›         ›››››                             
                                                ›{{í{››››—{›      ›  ›››››                          
                                                ›—{{— ››››————›——›—————››››                         
                                                ›{{{— › ›››—›—{———››———›››                          
 ›z                                             —ÏÏí{—— ››———————————›››››  ›                       
gÆÆÆÆüzÆ   ›ÏÏÆz       Ï                       ›{{zzí{—›››———›››—————›››››  {                       
ÞGÞÇ—   üÆÆÆ6ÇÇ  Æz{íÆÏ ›                      ›{üízz{—    ›————››———›››    í                    ÆÆ6
GÅÅÅÆÆÆÆÆÆgÅgz —Æz {{                         ››{üííí{—  ›   ››››››››  ›    z    ›        —6ÆÆÆÆGüz 
ÇgggGggÞGGgÅÆÆ{       ÆGÆ›               ›——›››—í{íííÏ{—ííz  ›››—››››      —›      ÆÆÆÆÆÆÆÆÆ  ÇÆÅÅÆÞ
ÞgggggggggggGÆÞ  ÆíÆgÆÇÇÆ —                 ››››{ííí{íÏí—›  ›››››››››››    —›—              {ÆgggÇGÇ
ÞggggggggggggÅÆÆ›ÇGÞzíGÆÇ  —          ›          ›››       ››››››› › ›     —  6í           ÅÅÅÅGÇggÞ
ÇGgggggGGGGGgggÆÇÇgÆÏÅÞÆ                                   ———————››› ›    6—Çz›ÆÆÆÆÆÆÆÆgÆÅÆÆ6ÞggggÇ
ÇgGGGGGGGGGGGGGgÞÇÞÏÇgÆ6  Æ  —                                  ›—› › ››  —  ÆÏí   íüz›{ üggggGgGGGÇ
ÞgggGGgggggGGGGggÅÇÏÞÅG—Æ {›››                                    ›› ›››—›     ÅÆÆÆ6ÏÅÅÆÆÅÅggGGgGGGÇ
ÇGGGGGGGGGGggggGGgÅüÞÅGÞÆ    Ç ›          ››››—{{›  —{{íüüüüí—›   ›››››í      ÆÅÇz6ÇÞÇÞGGGGGGGÞGgGGÇ
ÇgGggGGGGGGGGGGggggÅz6ÇÇÆÆ      ›         ›››   —ííí—             ››z  ›  ÆG 6››GÆÆÅÅggggGggggGgGGGÇ
ÇGGGGGGGGGGGGGGGGGgGÞgG6gÆÆÇ    ›                                 ›{›     ÆÆ{ 6gí›{gGgGGgGGGGGGgGGG6
ÇGGGGGGGGGGGGGGGGGGGgggÅGgÆÆÆÆÆ  í        › ——————›—›———{—››››     {   Æ ÞÅÆÆGÞÅÅÅÅÅGggggGGGGGGgGGGÇ
ÇÞGGÞGGGGGGGGGGgGGGGgGgggÅGgÆÆÆÏ  ›                              ›››   ÆÆÆggÅÅÅÞggGGgGGGGGGGgGGGGGG6
ÇGgÞgGGGÞGGGGGGGÞGGGGGGGGGÅÆÆG Å                                 ››   —ÆÆÆÅÅggGggGÞgGgGGGGgGGGGGGGG6
6GGGGGGGGGGGGgGgGGGGGGGgÆÆÆÅ   Æ›                                    ›í  ÆÆÆgggggggggggGgGGGGGGGGGG6
6GGGGGGGGGGÞGGÞÞGGGGGÅÆÆÆ      Æ›         ›››››››››››››››››        ›››üÇ   ÆÆggGGGgGGGGGGGGGGGGGGGGÇ
6GGGGGGGGGGGGGGGGGÆÆÆÆÆ       ÏÅ—›      ›  ›——————›››››—›—›       › ››{Å    ÆÆÆÅgggGGGGGGGGGGGGGGGÞ6
6GGÞGGÞGÞGGGGgÆÆÆÆÆ{          {Þ{—            › ›   ››    ›    › ››››››Þ      ÆÆÆÅGGGGGGGGGGGGGGÞGG6
6GGGGGGGGGGÅÆÆÆÇ               Ç{››            ››   ››        ››› ›› ›—z        ÆÆÆÅGGGGGGGGGGGGGÞÞü
6ÞÞGÅÆÆÆÆÆÆÆg                  üí››      ›                  ›   ››› ›››—          ÆÆÆÆGGGGÞGGGGGÞGG6
ÆÆÆÆÆÆÏ                         {›        ›——›          ››››    ››››››››            6ÆÆÆÆgGGGGÞGGGÞü
                                ››             ››› ›          ››  ›››››                ÆÆÆÆÆÅGGGGGGü
                                                              ›››››››                      GÆÆÆÆgÞÞü
                                                               › ››                           íÆÆÆÆÆ
                                                              ››                                    
                                    ›                       ›   ››    ›                             
                                      GÅG6z›                       —zz`
        ];

        // Use art as-is, no processing needed
        this.arts = rawArts;

        // Display the art
        this.displayArt(0);
    }

    displayArt(index) {
        if (!this.portrait || !this.arts[index]) return;
        this.portrait.textContent = this.arts[index];
    }

    bindEvents() {
        // Try multiple approaches to ensure events work
        const viewport = this.viewport || document.querySelector('.ascii-viewport');
        const coords = this.coords || document.getElementById('ascii-coords');

        console.log('Binding events - viewport:', viewport, 'coords:', coords);

        if (!viewport || !coords) {
            console.error('Cannot bind events - elements not found');
            return;
        }

        // Method 1: Direct event on viewport
        viewport.addEventListener('mousemove', function(e) {
            const rect = viewport.getBoundingClientRect();
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);
            coords.textContent = 'X:' + x + ' Y:' + y;
        }, false);

        viewport.addEventListener('mouseleave', function() {
            coords.textContent = 'X:0 Y:0';
        }, false);

        // Method 2: Also bind to terminal (parent element)
        const terminal = document.querySelector('.ascii-terminal');
        if (terminal) {
            terminal.addEventListener('mousemove', function(e) {
                const rect = viewport.getBoundingClientRect();
                const x = Math.floor(e.clientX - rect.left);
                const y = Math.floor(e.clientY - rect.top);

                // Only update if mouse is inside viewport
                if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
                    coords.textContent = 'X:' + x + ' Y:' + y;
                }
            }, false);
        }

        console.log('✓ Events bound successfully');
    }

    startRandomGlitch() {
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.triggerGlitch();
            }
        }, 2000);
    }

    triggerGlitch() {
        if (!this.portrait) return;

        const glitchColors = ['#ff3366', '#00ff88', '#ffaa00'];
        const randomColor = glitchColors[Math.floor(Math.random() * glitchColors.length)];

        this.portrait.style.color = randomColor;
        this.portrait.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;

        setTimeout(() => {
            this.portrait.style.color = '';
            this.portrait.style.transform = '';
        }, 100);
    }
}

// ============================================
// PARALLAX EFFECT
// ============================================

class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.hero-content, .section-header');
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.update());
    }

    update() {
        const scrollY = window.scrollY;

        this.elements.forEach((el, index) => {
            const speed = 0.1 * (index + 1);
            const rect = el.getBoundingClientRect();

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (scrollY - el.offsetTop) * speed;
                el.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
}

// ============================================
// VHS TRACKING EFFECT
// ============================================

class VHSTracking {
    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'vhs-tracking';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            background: transparent;
        `;
        document.body.appendChild(this.overlay);

        this.scheduleTracking();
    }

    scheduleTracking() {
        const delay = 5000 + Math.random() * 15000;
        setTimeout(() => {
            this.triggerTracking();
            this.scheduleTracking();
        }, delay);
    }

    triggerTracking() {
        const lineCount = 3 + Math.floor(Math.random() * 5);
        const lines = [];

        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.style.cssText = `
                position: absolute;
                left: 0;
                width: 100%;
                height: ${2 + Math.random() * 4}px;
                background: rgba(0, 212, 255, ${0.1 + Math.random() * 0.2});
                top: ${Math.random() * 100}%;
                animation: tracking-line 0.2s ease forwards;
            `;
            this.overlay.appendChild(line);
            lines.push(line);
        }

        // Add keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tracking-line {
                0% { transform: translateX(-100%); opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            lines.forEach(line => line.remove());
            style.remove();
        }, 300);
    }
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    const canvas = document.getElementById('bg-canvas');

    if (canvas) {
        new GenerativeBackground(canvas);
    }

    const timecode = document.getElementById('timecode');
    if (timecode) {
        new VHSTimecode(timecode);
    }

    // Navigation & Scroll
    new SmoothScroll();
    new ScrollAnimations();
    new NavigationHighlight();

    // Visual Effects
    new GlitchEffect();
    new ProjectCards();
    new CursorTrail();
    new MagneticButtons();
    new RandomGlitch();
    new VHSTracking();
    new ASCIIPortrait();

    // Glasses Eye Tracking
    new GlassesEyeTracking();

    // Voice Agent
    new VoiceAgent();

    // Add loaded class for CSS animations
    document.body.classList.add('loaded');

    console.log(`
    ╔════════════════════════════════════════╗
    ║                                        ║
    ║   ART_PROTO PORTFOLIO SYSTEM v2.0      ║
    ║   ────────────────────────────────     ║
    ║   Status: ONLINE                       ║
    ║   Mode: RETRO TECH-NOIR                ║
    ║                                        ║
    ║   >> All systems operational           ║
    ║                                        ║
    ╚════════════════════════════════════════╝
    `);
});

// ============================================
// GLASSES ASCII ART + EYE TRACKING
// ============================================

class GlassesEyeTracking {
    constructor() {
        this.container = document.getElementById('glasses-section');
        this.pupilLeft = document.getElementById('pupil-left');
        this.pupilRight = document.getElementById('pupil-right');
        this.eyeLeft = document.getElementById('eye-left');
        this.eyeRight = document.getElementById('eye-right');

        if (!this.container) return;
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.movePupil(this.eyeLeft, this.pupilLeft, e.clientX, e.clientY);
            this.movePupil(this.eyeRight, this.pupilRight, e.clientX, e.clientY);
        });
    }

    movePupil(eyeEl, pupilEl, mouseX, mouseY) {
        const rect = eyeEl.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = mouseX - eyeCenterX;
        const dy = mouseY - eyeCenterY;
        const angle = Math.atan2(dy, dx);
        const maxDist = rect.width * 0.25;
        const distance = Math.min(Math.hypot(dx, dy) * 0.08, maxDist);

        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;

        pupilEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
}

// ============================================
// PRELOADER
// ============================================

window.addEventListener('load', () => {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-text">LOADING SYSTEM</div>
            <div class="preloader-bar">
                <div class="preloader-progress"></div>
            </div>
        </div>
    `;
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0e1a;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;

    const content = preloader.querySelector('.preloader-content');
    content.style.cssText = `
        text-align: center;
    `;

    const text = preloader.querySelector('.preloader-text');
    text.style.cssText = `
        font-family: 'VT323', monospace;
        font-size: 1.5rem;
        color: #00d4ff;
        letter-spacing: 0.2em;
        margin-bottom: 1rem;
    `;

    const bar = preloader.querySelector('.preloader-bar');
    bar.style.cssText = `
        width: 200px;
        height: 4px;
        background: rgba(0, 212, 255, 0.2);
        overflow: hidden;
    `;

    const progress = preloader.querySelector('.preloader-progress');
    progress.style.cssText = `
        width: 0%;
        height: 100%;
        background: #00d4ff;
        transition: width 0.3s ease;
    `;

    // Simulate loading
    document.body.prepend(preloader);

    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 30;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);

            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.remove(), 500);
            }, 300);
        }
        progress.style.width = `${loadProgress}%`;
    }, 100);
});
