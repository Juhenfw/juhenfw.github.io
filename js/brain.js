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
let currentActiveCategory = 'all'; // Untuk mencatat kategori asli yang dipilih

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
    currentActiveCategory = category;

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

            <div class="system-status" onclick="triggerSystemRefresh(this)">
                <span class="status-dot"></span>
                <span class="status-text"> CLICK TO SHUFFLE </span>
            </div>
        </div>
    `;
    container.appendChild(centerNode);
}

// FUNGSI ANIMASI REFRESH
function triggerSystemRefresh(element) {
    const textSpan = element.querySelector('.status-text');
    const originalText = textSpan.innerText;
    
    textSpan.innerText = "PROCESSING...";
    textSpan.style.color = "#00ffc8";
    
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(n => {
        n.style.transition = 'all 0.3s ease';
        n.style.transform = 'translate(-50%, -50%) scale(0) rotate(180deg)'; 
        n.style.opacity = '0';
    });

    setTimeout(() => {
        // Langsung panggil kategori yang tersimpan
        filterMind(currentActiveCategory); 
        
        textSpan.innerText = originalText;
        textSpan.style.color = "";
    }, 500); 
}

// =============================================================================
// 4. NODE ORBIT SYSTEM (VISUALIZATION)
// =============================================================================
function renderNodes(nodes) {
    const container = document.getElementById('ui-layer');
    if (!container) return;
    
    const today = new Date(); 
    const isMobile = window.innerWidth < 768;

    // --- 1. FILTER BERSIH ---
    let cleanNodes = nodes.filter(n => {
        const titleLower = n.title ? n.title.toLowerCase() : "";
        return n.type !== 'core' && 
               n.id !== 'bio' && 
               !titleLower.includes('about me') &&
               n.isHidden !== true; 
    });

    // --- 2. SELEKSI DATA (LIMITER) ---
    let nodesToRender = [];

    // Pisahkan Archive (Wajib Tampil di kedua mode)
    const archiveNode = cleanNodes.find(n => n.type === 'archive');
    let contentNodes = cleanNodes.filter(n => n.type !== 'archive');
    
    // Acak urutan konten (Shuffle) agar dinamis
    contentNodes.sort(() => Math.random() - 0.5);

    if (isMobile) {
        // === LOGIKA MOBILE (FIX 4 NODE) ===
        // Ambil 3 konten teratas + 1 Archive
        let selectedContent = contentNodes.slice(0, 3);
        
        nodesToRender = [...selectedContent];
        if (archiveNode) nodesToRender.push(archiveNode);
        
    } else {
        // === LOGIKA DESKTOP (LIMIT MAX 10) ===
        // Biar orbit tidak sesak. Ambil 9 konten + 1 Archive.
        const MAX_DESKTOP = 10;
        let selectedContent = contentNodes.slice(0, MAX_DESKTOP - 1);
        
        nodesToRender = [...selectedContent];
        if (archiveNode) nodesToRender.push(archiveNode);
    }

    // --- 3. RENDERING LOOP ---
    nodesToRender.forEach((node, index) => {
        // Logika Decay
        const nodeDate = new Date(node.date);
        let ageMonths = !isNaN(nodeDate.getTime()) ? (today - nodeDate) / (1000 * 60 * 60 * 24 * 30) : 0;
        let freshness = Math.max(0.6, 1 - (ageMonths * 0.025));
        let scale = Math.max(0.9, 1 - (ageMonths * 0.01));

        // Logika Posisi
        let x, y;
        
        if (isMobile) {
            // === MODE MOBILE SIMETRIS (Y: 17% & 67%) ===
            const mobileSlots = [
                { x: 25, y: 20 }, // Kiri Atas
                { x: 75, y: 20 }, // Kanan Atas
                { x: 25, y: 68 }, // Kiri Bawah
                { x: 75, y: 68 }  // Kanan Bawah
            ];
            const slot = mobileSlots[index % 4];
            x = slot.x; y = slot.y;
            
        } else {
            // === MODE DESKTOP ORBIT ===
            const total = nodesToRender.length;
            const angleSegment = (2 * Math.PI) / total;
            const angle = index * angleSegment;
            
            // Variasi Radius Zig-Zag
            const radius = (index % 2 === 0) ? 23 : 34;
            const aspect = window.innerWidth / window.innerHeight;
            
            x = 50 + ((radius * (aspect > 1 ? 1.3 : 1)) * Math.cos(angle));
            y = 50 + ((radius * 1.2) * Math.sin(angle));
            
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

        el.addEventListener('click', (e) => {
            e.stopPropagation();
            if (node.type === 'archive') openArchiveWindow();
            else showDetail(node);
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

// --- [BARU] FUNGSI PENERJEMAH TANGGAL ---
function parseDateScore(dateStr) {
    if (!dateStr) return 0;
    const s = dateStr.toString().toLowerCase();

    // 1. Prioritas Tertinggi: "Now", "Present"
    if (s.includes('now') || s.includes('present')) return 9999999999999;

    // 2. Jika rentang (Sept 2024 - Jan 2025), ambil yang awal
    let cleanDate = s.split('-')[0].trim(); 
    
    // 3. Coba baca sebagai tanggal standar
    let timestamp = Date.parse(cleanDate);
    
    // 4. Jika gagal, cari angka tahun saja (misal "2024")
    if (isNaN(timestamp)) {
        let yearMatch = s.match(/(\d{4})/);
        if (yearMatch) {
            return new Date(yearMatch[0] + "-01-01").getTime();
        }
        return 0;
    }
    return timestamp;
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

    // --- [UPDATE] LOGIKA SORTING BARU ---
    // Menggunakan parseDateScore agar "Now", "Sept 2024", dll bisa urut
    filteredData.sort((a, b) => parseDateScore(b.date) - parseDateScore(a.date));

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
    const targetWin = document.getElementById(`window-${id}`);
    if (!targetWin) return;

    // 1. CEK STATUS DULU: Apakah window ini sedang aktif?
    const isAlreadyActive = targetWin.classList.contains('active');

    // 2. RESET: Tutup SEMUA window yang ada (termasuk yang sedang aktif)
    document.querySelectorAll('.virtual-window').forEach(w => {
        w.classList.remove('active');
    });

    // 3. LOGIKA TOGGLE:
    // Jika tadi dia TIDAK aktif, maka sekarang kita aktifkan.
    // (Jika tadi dia SUDAH aktif, dia akan tetap tertutup karena langkah no. 2)
    if (!isAlreadyActive) {
        targetWin.classList.add('active');
    }
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

// EVENT LISTENER: KLIK DI LUAR WINDOW (GLOBAL CLICK HANDLER)
window.addEventListener('click', (e) => {
    // 1. Definisi "Area Terlarang" (Jangan tutup kalau klik di sini)
    const clickedInsideWindow = e.target.closest('.virtual-window');
    const clickedMenuBtn = e.target.closest('.filter-btn');
    const clickedNode = e.target.closest('.node');
    const clickedProfile = e.target.closest('.core-identity');
    const clickedPanel = e.target.closest('.panel-content'); // Detail panel

    // 2. Logika: Jika yang diklik BUKAN salah satu dari area di atas...
    //    (Artinya user klik di background kosong / canvas)
    if (!clickedInsideWindow && !clickedMenuBtn && !clickedNode && !clickedProfile && !clickedPanel) {
        
        // Tutup semua virtual window (Contact/Profile)
        document.querySelectorAll('.virtual-window').forEach(w => {
            w.classList.remove('active');
        });
        
        // Tutup juga panel detail project jika sedang terbuka
        closePanel();
    }
});

// Ambil elemen form berdasarkan ID
const form = document.getElementById("contactForm");

async function handleSubmit(event) {
    event.preventDefault(); // Mencegah reload halaman
    
    const status = document.getElementById("my-form-status");
    const data = new FormData(event.target);

    // Kirim data ke Formspree tanpa pindah halaman
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // SUKSES: Tampilkan pesan ala terminal
            alert("SUCCESS: DATA PACKET TRANSMITTED TO SERVER.");
            form.reset(); // Kosongkan form
        } else {
            // GAGAL
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    alert("ERROR: TRANSMISSION BLOCKED. " + data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert("ERROR: SYSTEM FAILURE. TRY AGAIN.");
                }
            })
        }
    }).catch(error => {
        alert("CRITICAL ERROR: CONNECTION LOST.");
    });
}

form.addEventListener("submit", handleSubmit);
