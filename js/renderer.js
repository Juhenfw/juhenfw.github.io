/**
 * Module: Renderer
 * Mengurus penarikan data, rendering HTML, kalkulasi orbit, dan tabel arsip.
 */

// Simpan data secara global di lingkup modul
export let globalRepository = [];
export let currentActiveCategory = 'all';

export async function loadMind() {
    try {
        const response = await fetch('data/mind.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        globalRepository = data.nodes; 
        
        renderProfile(data.profile);
        renderNodes(data.nodes);
        window.initDockScroll(); // Ambil dari modul UI

    } catch (error) {
        console.error("SYSTEM PROTOCOL FAILURE:", error);
    }
}

export function filterMind(category) {
    currentActiveCategory = category;

    // Update Tampilan Tombol Menu (Active State)
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });

    // Reset Canvas (Hapus Node Lama di Layar)
    const oldNodes = document.querySelectorAll('.node');
    oldNodes.forEach(node => node.remove());

    // Saring Data
    let filteredNodes = (category === 'all') 
        ? globalRepository 
        : globalRepository.filter(node => node.type === category);

    renderNodes(filteredNodes);
}

export function renderProfile(profile) {
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

export function renderNodes(nodes) {
    const container = document.getElementById('ui-layer');
    if (!container) return;
    
    const today = new Date(); 
    const isMobile = window.innerWidth < 768;

    // Filter node yang tidak relevan atau disembunyikan
    let cleanNodes = nodes.filter(n => {
        const titleLower = n.title ? n.title.toLowerCase() : "";
        return n.type !== 'core' && 
               n.id !== 'bio' && 
               !titleLower.includes('about me') &&
               n.isHidden !== true; 
    });

    let nodesToRender = [];
    const archiveNode = cleanNodes.find(n => n.type === 'archive');
    let contentNodes = cleanNodes.filter(n => n.type !== 'archive');
    
    // Acak urutan konten agar halaman selalu terlihat dinamis saat dibuka
    contentNodes.sort(() => Math.random() - 0.5);

    if (isMobile) {
        const limit = archiveNode ? 3 : 4; 
        nodesToRender = contentNodes.slice(0, limit);
        if (archiveNode) nodesToRender.push(archiveNode);
    } else {
        const MAX_DESKTOP = 10;
        const limit = archiveNode ? (MAX_DESKTOP - 1) : MAX_DESKTOP;
        nodesToRender = contentNodes.slice(0, limit);
        if (archiveNode) nodesToRender.push(archiveNode);
    }

    nodesToRender.forEach((node, index) => {
        // Rumus Decay Logic (Efek penyusutan item yang lebih lama)
        const nodeDate = new Date(node.date);
        let ageMonths = !isNaN(nodeDate.getTime()) ? (today - nodeDate) / (1000 * 60 * 60 * 24 * 30) : 0;
        let freshness = Math.max(0.6, 1 - (ageMonths * 0.025));
        let scale = Math.max(0.9, 1 - (ageMonths * 0.01));

        let x, y;
        
        if (isMobile) {
            // Posisi Grid Simetris Mobile
            const mobileSlots = [
                { x: 25, y: 20 }, { x: 75, y: 20 },
                { x: 25, y: 68 }, { x: 75, y: 68 }
            ];
            const slot = mobileSlots[index % 4];
            x = slot.x; y = slot.y;
        } else {
            // Trigonometri Orbit Sempurna Desktop
            const total = nodesToRender.length;
            const angleSegment = (2 * Math.PI) / total;
            const angle = index * angleSegment;
            const radius = (index % 2 === 0) ? 23 : 34; // Zig-zag pattern
            const aspect = window.innerWidth / window.innerHeight;
            
            x = 50 + ((radius * (aspect > 1 ? 1.3 : 1)) * Math.cos(angle));
            y = 50 + ((radius * 1.2) * Math.sin(angle));
            
            x = Math.max(12, Math.min(88, x));
            y = Math.max(15, Math.min(85, y));
        }

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
            if (node.type === 'archive') window.openArchiveWindow();
            else window.showDetail(node);
        });

        container.appendChild(el);
    });
}

// System Date Parser (Paling presisi untuk sorting artikel & project)
function parseDateScore(dateStr) {
    if (!dateStr) return 0;
    const s = dateStr.toString().toLowerCase();
    if (s.includes('now') || s.includes('present')) return 9999999999999;

    let cleanDate = s.split('-')[0].trim(); 
    let timestamp = Date.parse(cleanDate);
    
    if (isNaN(timestamp)) {
        let yearMatch = s.match(/(\d{4})/);
        if (yearMatch) {
            return new Date(yearMatch[0] + "-01-01").getTime();
        }
        return 0;
    }
    return timestamp;
}

export function renderArchiveTable(filterType) {
    const tbody = document.getElementById('archive-list-body');
    const emptyState = document.getElementById('empty-state');
    if (!tbody) return;

    tbody.innerHTML = ''; 

    let filteredData = globalRepository.filter(n => {
        if (n.type === 'archive' || n.type === 'core') return false;
        if (filterType === 'blog') return n.type === 'blog';
        return n.type !== 'blog';
    });

    filteredData.sort((a, b) => parseDateScore(b.date) - parseDateScore(a.date));

    if (filteredData.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        filteredData.forEach(item => {
            const row = document.createElement('tr');
            let tag = 'tag-project';
            if (item.type === 'research') tag = 'tag-research';
            if (item.type === 'blog') tag = 'tag-blog';
            
            row.innerHTML = `
                <td style="color:#888;">${item.date}</td>
                <td style="font-weight:bold; color:#fff;">${item.title}</td>
                <td><span class="tag-badge ${tag}">${item.type.toUpperCase()}</span></td>
                <td><a href="${item.link || '#'}" target="_blank" class="archive-link">OPEN ></a></td>
            `;
            tbody.appendChild(row);
        });
    }
}