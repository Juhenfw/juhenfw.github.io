/**
 * BRAIN.JS - CENTRAL PROCESSING UNIT
 * ----------------------------------

 * - Restored: Main Menu Navigation (filterMind)
 * - Feature: Archive/Database System
 * - Feature: Hacker Boot Sequence
 * - Feature: Mobile/Desktop Orbit Logic
 */

// Global Variable: Menyimpan seluruh data agar bisa difilter tanpa reload
let globalRepository = []; 

// =============================================================================
// 1. SYSTEM INITIALIZATION (LOADER)
// =============================================================================
async function loadMind() {
    try {
        const response = await fetch('data/mind.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // 1. Simpan Data ke Global Variable
        globalRepository = data.nodes; 
        
        // 2. Render Identitas (Tengah)
        renderProfile(data.profile);
        
        // 3. Render Node Awal (Tampilkan Semua)
        // Kita kirim data.nodes, nanti renderNodes yang akan membuang yang hidden
        renderNodes(data.nodes);
        
        // 4. Aktifkan Scroll Indicator
        initDockScroll();

    } catch (error) {
        console.error("SYSTEM FAILURE:", error);
    }
}

// =============================================================================
// 2. MAIN NAVIGATION SYSTEM
// =============================================================================
function filterMind(category) {
    // 1. Update Tampilan Tombol Menu (Active State)
    // Cari semua tombol filter dan hapus class 'active'
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        // Jika tombol ini yang diklik (cek dari text atau atribut), aktifkan
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });

    // 2. Hapus Node Lama di Layar (Reset Canvas)
    const container = document.getElementById('ui-layer');
    // Hapus elemen dengan class .node (kecuali profile/core)
    const oldNodes = document.querySelectorAll('.node');
    oldNodes.forEach(node => node.remove());

    // 3. Logika Filter Data
    let filteredNodes = [];
    
    if (category === 'all') {
        // Jika ALL, pakai semua data di repository
        filteredNodes = globalRepository;
    } else {
        // Jika kategori spesifik (research/project/blog), ambil yang sesuai type
        filteredNodes = globalRepository.filter(node => node.type === category);
    }

    // 4. Render Ulang Node Sesuai Hasil Filter
    // (RenderNodes akan otomatis menangani isHidden dan posisi)
    renderNodes(filteredNodes);
}

// =============================================================================
// 3. PROFILE RENDERER (CORE)
// =============================================================================
function renderProfile(profile) {
    const container = document.getElementById('ui-layer');
    if (!container) return;

    const centerNode = document.createElement('div');
    centerNode.className = 'core-identity fade-in';
    
    centerNode.innerHTML = `
        <div class="identity-content">
            <h1>${profile.name}</h1>
            <p class="role-text">${profile.role}</p>
            <div class="social-orbit">
                <a href="${profile.social.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>
                <a href="${profile.social.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                <a href="${profile.social.twitter}" target="_blank" title="X (Twitter)"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="${profile.social.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="${profile.social.scholar}" target="_blank" title="Google Scholar"><i class="fas fa-graduation-cap"></i></a>
                <a href="${profile.social.orcid}" target="_blank" title="ORCID"><i class="fab fa-orcid"></i></a>
                <a href="mailto:${profile.social.email}" title="Email"><i class="fas fa-envelope"></i></a>
            </div>
        </div>
    `;
    container.appendChild(centerNode);
}

// =============================================================================
// 4. NODE ORBIT SYSTEM (VISUALIZATION)
// =============================================================================
function renderNodes(nodes) {
    const container = document.getElementById('ui-layer');
    if (!container) return;
    
    const today = new Date(); 
    const isMobile = window.innerWidth < 768;

    // --- FILTER TAHAP AKHIR: Bersihkan Data ---
    let validNodes = nodes.filter(n => {
        const titleLower = n.title ? n.title.toLowerCase() : "";
        return n.type !== 'core' && 
               n.id !== 'bio' && 
               !titleLower.includes('about me') &&
               n.isHidden !== true; // Jangan tampilkan hidden node di orbit
    });

    // --- RENDERING LOOP ---
    validNodes.forEach((node, index) => {
        // Logika Decay (Umur)
        const nodeDate = new Date(node.date);
        let ageMonths = 0;
        if (!isNaN(nodeDate.getTime())) {
            ageMonths = (today - nodeDate) / (1000 * 60 * 60 * 24 * 30);
        }
        
        let freshness = Math.max(0.6, 1 - (ageMonths * 0.025));
        let scale = Math.max(0.9, 1 - (ageMonths * 0.01));

        // Logika Posisi
        let x, y;
        if (isMobile) {
            // Mode Mobile: 4 Slot Aman
            const mobileSlots = [{ x: 25, y: 18 }, { x: 75, y: 18 }, { x: 25, y: 78 }, { x: 75, y: 78 }];
            const slot = mobileSlots[index % mobileSlots.length];
            x = slot.x; y = slot.y;
        } else {
            // Mode Desktop: Orbit
            const total = validNodes.length;
            const angleSegment = (2 * Math.PI) / total;
            const angle = index * angleSegment;
            const radius = (index % 2 === 0) ? 23 : 34;
            const aspect = window.innerWidth / window.innerHeight;
            
            x = 50 + ((radius * (aspect > 1 ? 1.3 : 1)) * Math.cos(angle));
            y = 50 + ((radius * 1.2) * Math.sin(angle));
            
            // Safety Clamp
            x = Math.max(12, Math.min(88, x));
            y = Math.max(15, Math.min(85, y));
        }

        // Buat Elemen
        const el = document.createElement('div');
        el.className = `node node-${node.type}`;
        if (node.type === 'archive') el.classList.add('node-archive');

        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        el.style.opacity = 0;
        el.style.transform = `translate(-50%, -50%) scale(0)`;

        setTimeout(() => {
            el.style.opacity = freshness;
            el.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }, index * 100);

        const displayDate = !isNaN(nodeDate.getFullYear()) ? nodeDate.getFullYear() : node.date;
        el.innerHTML = `
            <span class="node-date" style="color:var(--color-${node.type})">${node.type.toUpperCase()} • ${displayDate}</span>
            <h3>${node.title}</h3>
            <span class="click-hint">Tap detail</span>
        `;

        // Event Klik
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            if (node.type === 'archive') {
                openArchiveWindow();
            } else {
                showDetail(node);
            }
        });

        container.appendChild(el);
    });
}

// =============================================================================
// 5. ARCHIVE SYSTEM (DATABASE WINDOW)
// =============================================================================
function openArchiveWindow() {
    const win = document.getElementById('archive-window');
    if(win) {
        win.classList.add('active');
        switchArchiveTab('project');
    }
}

function closeArchive() {
    const win = document.getElementById('archive-window');
    if(win) win.classList.remove('active');
}

function switchArchiveTab(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(type)) btn.classList.add('active');
    });
    renderArchiveTable(type);
}

function renderArchiveTable(filterType) {
    const tbody = document.getElementById('archive-list-body');
    const emptyState = document.getElementById('empty-state');
    if (!tbody) return;

    tbody.innerHTML = ''; 

    let filteredData = globalRepository.filter(n => {
        if (n.type === 'archive' || n.type === 'core') return false;
        if (filterType === 'blog') return n.type === 'blog';
        return n.type !== 'blog'; // Project, Research, etc
    });

    filteredData.sort((a, b) => (parseInt(b.date)||0) - (parseInt(a.date)||0));

    if (filteredData.length === 0) {
        if(emptyState) emptyState.style.display = 'block';
    } else {
        if(emptyState) emptyState.style.display = 'none';
        filteredData.forEach(item => {
            const row = document.createElement('tr');
            let tag = 'tag-project';
            if (item.type === 'research') tag = 'tag-research';
            if (item.type === 'blog') tag = 'tag-blog';
            
            row.innerHTML = `
                <td style="font-family:monospace; color:#888;">${item.date}</td>
                <td style="font-weight:bold; color:#fff;">${item.title}</td>
                <td><span class="tag-badge ${tag}">${item.type.toUpperCase()}</span></td>
                <td><a href="${item.link || '#'}" target="_blank" class="archive-link">OPEN ></a></td>
            `;
            tbody.appendChild(row);
        });
    }
}

// =============================================================================
// 6. DETAIL PANEL & WINDOW UTILS
// =============================================================================
function showDetail(node) {
    const panel = document.getElementById('data-panel');
    if(!panel) return;
    
    document.getElementById('panel-type').innerText = node.type;
    const badge = document.getElementById('panel-type');
    badge.className = 'panel-badge';
    badge.style.color = `var(--color-${node.type})`;
    badge.style.borderColor = `var(--color-${node.type})`;

    document.getElementById('panel-date').innerText = node.date;
    document.getElementById('panel-title').innerText = node.title;
    document.getElementById('panel-desc').innerText = node.content || node.description || "-";

    const linkBtn = document.getElementById('panel-link');
    if (node.link && node.link !== '#') {
        linkBtn.style.display = 'inline-block';
        linkBtn.href = node.link;
    } else {
        linkBtn.style.display = 'none';
    }
    panel.classList.add('active');
}

function closePanel() {
    const p = document.getElementById('data-panel');
    if(p) p.classList.remove('active');
}

// Close Helpers
document.addEventListener('keydown', (e) => { if(e.key==="Escape") closePanel(); });
const pEl = document.getElementById('data-panel');
if(pEl) pEl.addEventListener('click', (e) => { if(e.target.id === 'data-panel') closePanel(); });

function openWindow(id) {
    document.querySelectorAll('.virtual-window').forEach(w => w.classList.remove('active'));
    const w = document.getElementById(`window-${id}`);
    if(w) w.classList.add('active');
}
function closeWindow(id) {
    const w = document.getElementById(`window-${id}`);
    if(w) w.classList.remove('active');
}

// =============================================================================
// 7. DOCK SCROLL & BOOT SEQUENCE
// =============================================================================
function initDockScroll() {
    const dock = document.getElementById('filter-dock');
    if (!dock) return;
    const check = () => {
        const start = dock.scrollLeft <= 5;
        const end = dock.scrollLeft + dock.clientWidth >= dock.scrollWidth - 5;
        dock.className = ''; 
        dock.id = 'filter-dock';
        if(start && !end) dock.classList.add('scroll-mask-right');
        else if(end && !start) dock.classList.add('scroll-mask-left');
        else if(!start && !end) dock.classList.add('scroll-mask-both');
    };
    dock.addEventListener('scroll', check);
    setTimeout(check, 500);
    window.addEventListener('resize', check);
}

document.addEventListener("DOMContentLoaded", () => {
    loadMind(); // START

    const term = document.getElementById('terminal-text');
    const boot = document.getElementById('boot-screen');
    if (term && boot) {
        const logs = [
            "INITIALIZING SYSTEM...", 
            "CONNECTING DATABASE...", 
            "VERIFYING PROTOCOLS...", 
            "RENDERING UI...", 
            "ACCESS GRANTED."
        ];
        let delay = 0;
        logs.forEach(l => {
            setTimeout(() => {
                const d = document.createElement('div');
                d.innerText = `> ${l}`;
                term.appendChild(d);
                term.scrollTop = term.scrollHeight;
            }, delay += (Math.random()*300)+200);
        });
        setTimeout(() => {
            boot.style.opacity = 0;
            boot.style.transform = "scale(1.1)";
            setTimeout(() => boot.remove(), 500);
        }, delay + 500);
    }
});