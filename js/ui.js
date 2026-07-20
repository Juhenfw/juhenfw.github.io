/**
 * Module: UI Control
 * Mengelola pop-up, form, interaksi klik luar, dan sinkronisasi global.
 */

import { filterMind, currentActiveCategory, renderArchiveTable } from './renderer.js';
import { initScrollAnimations } from './observer.js';

// Menyimpan elemen yang terakhir difokus sebelum sebuah dialog dibuka,
// agar fokus keyboard bisa dikembalikan ke sana saat dialog ditutup.
let lastFocusedElement = null;

function focusDialog(dialogEl) {
    lastFocusedElement = document.activeElement;
    const focusTarget = dialogEl.querySelector('.win-close, .close-btn, button, [href], input, textarea');
    if (focusTarget) focusTarget.focus();
}

function restoreFocus() {
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
    lastFocusedElement = null;
}

export function openWindow(id) {
    const targetWin = document.getElementById(`window-${id}`);
    if (!targetWin) return;

    const isAlreadyActive = targetWin.classList.contains('active');

    // Tutup seluruh jendela aktif
    document.querySelectorAll('.virtual-window').forEach(w => {
        w.classList.remove('active');
    });

    if (!isAlreadyActive) {
        targetWin.classList.add('active');
        focusDialog(targetWin);
        // Saat jendela dibuka, jalankan observer animasi di dalamnya
        setTimeout(() => {
            initScrollAnimations();
        }, 150);
    } else {
        restoreFocus();
    }
}

export function closeWindow(id) {
    const w = document.getElementById(`window-${id}`);
    if (w) w.classList.remove('active');
    restoreFocus();
}

export function openArchiveWindow() {
    const win = document.getElementById('archive-window');
    if (win) {
        win.classList.add('active');
        switchArchiveTab('project');
        focusDialog(win);
    }
}

export function closeArchive() {
    const win = document.getElementById('archive-window');
    if (win) win.classList.remove('active');
    restoreFocus();
}

export function switchArchiveTab(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const isMatch = btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(type);
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
    renderArchiveTable(type);
}

export function showDetail(node) {
    const panel = document.getElementById('data-panel');
    if (!panel) return;
    
    const badge = document.getElementById('panel-type');
    badge.innerText = node.type;
    badge.className = 'panel-badge';
    badge.style.color = `var(--color-${node.type})`;
    badge.style.borderColor = `var(--color-${node.type})`;

    document.getElementById('panel-date').innerText = node.date;
    document.getElementById('panel-title').innerText = node.title;

    // --- MODIFIKASI 1: Pemisahan Nama Perusahaan & Tugas ---
    let rawDesc = node.content || node.description || "-";
    
    // Jika tipenya 'experience' dan mengandung ' - ', pisahkan teksnya
    if (node.type === 'experience' && rawDesc.includes(' - ')) {
        // Memecah teks hanya pada tanda hubung pertama
        const splitIndex = rawDesc.indexOf(' - ');
        const companyName = rawDesc.substring(0, splitIndex).trim();
        const taskDesc = rawDesc.substring(splitIndex + 3).trim();
        
        // Format ulang dengan tag <strong> dan baris baru (<br/>)
        rawDesc = `<strong style="color: #F1F5F9; font-size: 1.05rem; display: block; margin-bottom: 8px;">${companyName}</strong>${taskDesc}`;
    }
    
    // Gunakan innerHTML (sebelumnya innerText) agar tag <strong> terbaca oleh browser
    document.getElementById('panel-desc').innerHTML = rawDesc;

    // --- MODIFIKASI 2: Tombol Link / CTA Otomatis ---
    const linkBtn = document.getElementById('panel-link');
    if (node.link && node.link !== '#') {
        linkBtn.style.display = 'inline-block';
        linkBtn.href = node.link;
        // Teks CTA berubah berdasarkan tipe konten
        linkBtn.innerText = (node.type === 'project') ? 'VIEW PROJECT ↗' : 'VISIT LINK ↗';
    } else {
        linkBtn.style.display = 'none';
    }
    
    panel.classList.add('active');
    focusDialog(panel);
}

export function closePanel() {
    const p = document.getElementById('data-panel');
    if (p) p.classList.remove('active');
    restoreFocus();
}

export function closeAllDialogs() {
    document.querySelectorAll('.virtual-window').forEach(w => {
        w.classList.remove('active');
    });
    closePanel();
}

export function triggerSystemRefresh(element) {
    const textSpan = element.querySelector('.status-text');
    const originalText = textSpan.innerText;
    
    textSpan.innerText = "PROCESSING...";
    textSpan.style.color = "var(--color-accent)";
    
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(n => {
        n.style.transition = 'all 0.3s ease';
        n.style.transform = 'translate(-50%, -50%) scale(0) rotate(180deg)'; 
        n.style.opacity = '0';
    });

    setTimeout(() => {
        filterMind(currentActiveCategory); 
        textSpan.innerText = originalText;
        textSpan.style.color = "";
    }, 500); 
}

export function initDockScroll() {
    const dock = document.getElementById('filter-dock');
    if (!dock) return;
    const check = () => {
        const start = dock.scrollLeft <= 5;
        const end = dock.scrollLeft + dock.clientWidth >= dock.scrollWidth - 5;
        dock.className = ''; 
        dock.id = 'filter-dock';
        if (start && !end) dock.classList.add('scroll-mask-right');
        else if (end && !start) dock.classList.add('scroll-mask-left');
        else if (!start && !end) dock.classList.add('scroll-mask-both');
    };
    dock.addEventListener('scroll', check);
    setTimeout(check, 500);
    window.addEventListener('resize', check);
}

// ⚠️ GLOBAL EXPOSURE (Mencegah rusaknya inline event click pada HTML)
window.openWindow = openWindow;
window.closeWindow = closeWindow;
window.openArchiveWindow = openArchiveWindow;
window.closeArchive = closeArchive;
window.switchArchiveTab = switchArchiveTab;
window.showDetail = showDetail;
window.closePanel = closePanel;
window.triggerSystemRefresh = triggerSystemRefresh;
window.filterMind = filterMind;
window.initDockScroll = initDockScroll;