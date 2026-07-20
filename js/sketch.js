// js/sketch.js - Magnetic Neural Constellation (Vanilla Canvas)
// Ditulis ulang tanpa p5.js — sebelumnya seluruh library p5.js (~800KB)
// di-load hanya untuk efek partikel ini. Perilaku visual dipertahankan sama.

(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR biar tidak terlalu berat di layar retina

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    let rafId = null;

    // Hormati preferensi pengguna yang sensitif terhadap motion (aksesibilitas + hemat CPU)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    class Particle {
        constructor() {
            this.x = random(0, width);
            this.y = random(0, height);
            this.vx = random(-0.4, 0.4);
            this.vy = random(-0.4, 0.4);
            this.size = random(1.5, 3);
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distMouse = Math.hypot(dx, dy);

            if (distMouse < 80) {
                const nx = dx / (distMouse || 1);
                const ny = dy / (distMouse || 1);
                this.vx += nx * 0.5;
                this.vy += ny * 0.5;
                const speed = Math.hypot(this.vx, this.vy);
                if (speed > 2) {
                    this.vx = (this.vx / speed) * 2;
                    this.vy = (this.vy / speed) * 2;
                }
            } else {
                const speed = Math.hypot(this.vx, this.vy);
                if (speed > 0.5) {
                    this.vx = (this.vx / speed) * 0.5;
                    this.vy = (this.vy / speed) * 0.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(100, 200, 255, 0.7)';
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (d < 100) {
                    const alpha = (1 - d / 100) * 0.31;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function connectToMouse() {
        for (let i = 0; i < particles.length; i++) {
            const d = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
            if (d < 150) {
                const alpha = (1 - d / 150) * 0.59;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 200, ${alpha})`;
                ctx.lineWidth = 1.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }

    function draw() {
        ctx.fillStyle = 'rgb(5, 5, 8)';
        ctx.fillRect(0, 0, width, height);

        for (const p of particles) {
            p.update();
            p.draw();
        }
        connectParticles();
        connectToMouse();

        rafId = requestAnimationFrame(draw);
    }

    function init() {
        resize();
        const isMobile = width < 768;
        const particleCount = isMobile ? 30 : 70;
        particles = Array.from({ length: particleCount }, () => new Particle());

        if (prefersReducedMotion) {
            // Gambar satu frame statis saja, jangan jalankan animasi terus-menerus
            draw();
            cancelAnimationFrame(rafId);
            return;
        }
        draw();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // Hemat baterai/CPU: berhenti render saat tab tidak aktif
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (rafId) cancelAnimationFrame(rafId);
        } else if (!prefersReducedMotion) {
            draw();
        }
    });

    init();
})();