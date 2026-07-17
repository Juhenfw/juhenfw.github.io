/**
 * Module: Main (Central Bootstrapper)
 * Mengkoordinasikan pemuatan data, interaksi form, dan inisiasi sistem.
 */

import { loadMind } from './renderer.js';
import { closePanel } from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Jalankan Penarikan Data JSON
    loadMind();

    // 2. Hacker Boot Sequence
    const term = document.getElementById('terminal-text');
    const boot = document.getElementById('boot-screen');
    if (term && boot) {
        const logs = [
            "INITIALIZING COGNITIVE SHELL...", 
            "ESTABLISHING DATABASE SYNC...", 
            "ENCRYPTING DATA ROUTERS...", 
            "RENDERING GRAPH NEST...", 
            "SHELL ACCESS GRANTED."
        ];
        let delay = 0;
        logs.forEach(logText => {
            setTimeout(() => {
                const logLine = document.createElement('div');
                logLine.innerText = `> ${logText}`;
                term.appendChild(logLine);
                term.scrollTop = term.scrollHeight;
            }, delay += (Math.random() * 250) + 150);
        });
        setTimeout(() => {
            boot.style.opacity = 0;
            boot.style.transform = "scale(1.05)";
            setTimeout(() => boot.remove(), 500);
        }, delay + 500);
    }

    // 3. Formspree Ajax Interceptor
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            
            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    alert("TRANSMISSION SUCCESS: DATA PACKET DISPATCHED.");
                    form.reset();
                } else {
                    const errData = await response.json();
                    if (Object.prototype.hasOwnProperty.call(errData, 'errors')) {
                        alert("TRANSMISSION REJECTED: " + errData["errors"].map(e => e["message"]).join(", "));
                    } else {
                        alert("TRANSMISSION ERROR: GATEWAY TIMEOUT.");
                    }
                }
            } catch (error) {
                alert("CRITICAL SYSTEM FAULT: TERMINAL OFFLINE.");
            }
        });
    }
});

// 4. Global Click Listener (Klik di luar window otomatis menutup pop-up)
window.addEventListener('click', (e) => {
    const insideWindow = e.target.closest('.virtual-window');
    const menuBtn = e.target.closest('.filter-btn');
    const node = e.target.closest('.node');
    const core = e.target.closest('.core-identity');
    const panel = e.target.closest('.panel-content');

    if (!insideWindow && !menuBtn && !node && !core && !panel) {
        document.querySelectorAll('.virtual-window').forEach(w => {
            w.classList.remove('active');
        });
        closePanel();
    }
});

// Tutup Panel dengan Keyboard (ESC)
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        document.querySelectorAll('.virtual-window').forEach(w => {
            w.classList.remove('active');
        });
        closePanel();
    }
});