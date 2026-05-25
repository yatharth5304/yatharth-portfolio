'use strict';

// ── Constants ─────────────────────────────────────────────
const LINKEDIN_URL = 'https://www.linkedin.com/in/yatharthmaharwade/';
const GITHUB_URL = 'https://github.com/yatharth5304';
const EMAIL = 'yatharth0503@hotmail.com';

// ── Rich project content (case-study data) ────────────────
const PROJECT_DETAILS = {
    'Student Attendance Management System': {
        num: '01',
        problem: 'Manual attendance tracking is error-prone and gives zero real-time visibility to faculty or administrators.',
        highlight: 'Multi-role web app with separate scoped dashboards — Admin sees institution-wide data, Faculty manages only their classes, Students track their own records.',
        challenge: 'Designing the RBAC model cleanly so data-scope enforcement happens at the service layer, not scattered across controllers.',
        featured: true,
    },
    'Realtime Face Tracking Gimbal': {
        num: '02',
        problem: 'Static cameras lose subjects in dynamic environments. Needed hardware that physically follows a face in real time.',
        highlight: 'Computer vision pipeline that detects faces per frame and drives servo motors to keep the subject centered automatically.',
        challenge: 'Decoupling the frame-processing thread from the motor-control thread to eliminate actuation lag caused by blocking I/O.',
        featured: true,
    },
    'FoodFinder': {
        num: '03',
        problem: 'Discovering local food options is fragmented across multiple apps and hard to filter meaningfully.',
        highlight: 'Full-stack food discovery app with search, category filters, and location-aware recommendations.',
        challenge: 'Keeping search response time fast despite querying across multiple data dimensions simultaneously.',
        featured: false,
    },
    'OMDB Movie Explorer': {
        num: '04',
        problem: 'No clean, focused interface to search and explore movie data from the OMDB catalog.',
        highlight: 'Movie discovery UI with real-time search, detail views, and clean presentation of OMDB API data.',
        challenge: 'Handling API rate limits gracefully and caching repeated search queries client-side to avoid redundant calls.',
        featured: false,
    },
    'Developer Portfolio': {
        num: '05',
        problem: 'Most portfolios are static files. Wanted one that demonstrates real backend thinking.',
        highlight: 'This site — a Spring Boot REST API + PostgreSQL backend, admin panel for content management, deployed on Render.',
        challenge: 'Free-tier cold starts cause multi-second delays. Solved with skeleton loaders + background wake-up pings so perceived load is near-instant.',
        featured: false,
    },
    'Music Webapp': {
        num: '06',
        problem: 'Wanted a lightweight, dependency-free web music player without streaming platform constraints.',
        highlight: 'Browser-based music webapp with playback controls, queue management, and a clean, focused interface.',
        challenge: 'Managing audio playback state cleanly without a framework — implemented a minimal state machine for reliable transitions.',
        featured: false,
    },
    'Quiz Web App': {
        num: '07',
        problem: 'Self-assessment quizzes with instant feedback and detailed score breakdown for effective learning.',
        highlight: 'Dynamic quiz app with configurable question sets, countdown timer, and per-question result analysis.',
        challenge: 'Randomizing question order per session while tracking progress reliably in session storage across page interactions.',
        featured: false,
    },
};

// ── Static skills data (always shown, no API dependency) ──
const SKILLS_DATA = [
    {
        category: 'Backend',
        skills: ['Java', 'Spring Boot', 'Spring MVC', 'Spring Security', 'Hibernate / JPA', 'REST APIs'],
        primary: true,
    },
    {
        category: 'Database',
        skills: ['PostgreSQL', 'SQL', 'JDBC', 'Database Design', 'Query Optimization'],
        primary: true,
    },
    {
        category: 'Frontend',
        skills: ['React.js', 'JavaScript (ES6+)', 'HTML5', 'CSS3'],
        primary: false,
    },
    {
        category: 'Tools & DevOps',
        skills: ['Git', 'GitHub', 'Maven', 'Docker', 'Postman', 'IntelliJ IDEA'],
        primary: false,
    },
    {
        category: 'Concepts',
        skills: ['OOP', 'RBAC', 'SOLID', 'MVC', 'Data Structures', 'Algorithms'],
        primary: false,
    },
];

// ── Command Palette definitions ────────────────────────────
const COMMANDS = [
    { id: 'about',      label: 'Go to About',         group: 'Navigate', icon: 'person',   action: () => scrollTo('#about') },
    { id: 'experience', label: 'View Experience',      group: 'Navigate', icon: 'briefcase',action: () => scrollTo('#experience') },
    { id: 'projects',   label: 'Browse Projects',      group: 'Navigate', icon: 'folder',   action: () => scrollTo('#projects') },
    { id: 'skills',     label: 'View Tech Stack',      group: 'Navigate', icon: 'code',     action: () => scrollTo('#skills') },
    { id: 'contact',    label: 'Get in Touch',         group: 'Navigate', icon: 'mail',     action: () => scrollTo('#contact') },
    { id: 'top',        label: 'Back to Top',          group: 'Navigate', icon: 'up',       action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'resume',     label: 'Open Resume',          group: 'Links',    icon: 'file',     action: () => window.open('/resume', '_blank') },
    { id: 'github',     label: 'View GitHub Profile',  group: 'Links',    icon: 'github',   action: () => window.open(GITHUB_URL, '_blank') },
    { id: 'linkedin',   label: 'View LinkedIn Profile',group: 'Links',    icon: 'linkedin', action: () => window.open(LINKEDIN_URL, '_blank') },
    { id: 'email',      label: 'Send Email',           group: 'Links',    icon: 'mail',     action: () => { window.location.href = `mailto:${EMAIL}`; } },
];

// SVG icon set for the command palette
const ICONS = {
    person:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    briefcase: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    folder:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    code:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    mail:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    file:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    github:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
    linkedin:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    up:        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>`,
};

// ── Helpers ───────────────────────────────────────────────
function scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// ── Initialise ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initActiveNavHighlight();
    initCommandPalette();

    // Render skills immediately (no API dependency)
    renderSkills(SKILLS_DATA);

    // Fetch projects from Spring Boot API
    fetchProjects();

    // Start terminal animation
    setTimeout(typeTerminal, 900);
});

// ── Navbar ────────────────────────────────────────────────
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const progress = document.getElementById('reading-progress');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        if (progress) {
            const scrollTop = document.documentElement.scrollTop;
            const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progress.style.width = `${(scrollTop / total) * 100}%`;
        }
    }, { passive: true });
}

// ── Mobile Menu ───────────────────────────────────────────
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        menu.setAttribute('aria-hidden', String(!isOpen));
    });

    menu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
        });
    });
}

// ── Scroll Animations (single shared IntersectionObserver) ─
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}

// ── Active Nav Link Highlight ─────────────────────────────
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === entry.target.id);
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(s => observer.observe(s));
}

// ── Command Palette ───────────────────────────────────────
function initCommandPalette() {
    const overlay   = document.getElementById('cmd-palette');
    const input     = document.getElementById('cmd-input');
    const results   = document.getElementById('cmd-results');
    const triggerBtn = document.getElementById('cmd-trigger');
    const backdrop  = document.getElementById('cmd-backdrop');
    if (!overlay || !input || !results) return;

    let focusedIndex = 0;
    let visibleCommands = [...COMMANDS];

    function openPalette() {
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        input.value = '';
        renderResults(COMMANDS);
        // Small delay so animation plays before focus
        requestAnimationFrame(() => setTimeout(() => input.focus(), 60));
    }

    function closePalette() {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        focusedIndex = 0;
    }

    function execute(cmd) {
        closePalette();
        // Slight delay so closing animation plays first
        setTimeout(() => cmd.action(), 120);
    }

    function renderResults(cmds) {
        visibleCommands = cmds;
        focusedIndex = cmds.length > 0 ? 0 : -1;

        if (cmds.length === 0) {
            results.innerHTML = `<p style="text-align:center;padding:28px 16px;color:var(--text-dim);font-size:0.875rem;font-family:var(--font-mono);">No results for "${input.value}"</p>`;
            return;
        }

        // Group commands
        const groups = {};
        cmds.forEach(cmd => {
            if (!groups[cmd.group]) groups[cmd.group] = [];
            groups[cmd.group].push(cmd);
        });

        let html = '';
        cmds.forEach((cmd, i) => {
            // Insert group label before first item of each group
            const isFirstInGroup = !cmds[i - 1] || cmds[i - 1].group !== cmd.group;
            if (isFirstInGroup) {
                html += `<div class="cmd-group-label">${cmd.group}</div>`;
            }
            html += `
                <div class="cmd-item${i === focusedIndex ? ' focused' : ''}"
                     data-idx="${i}"
                     role="option"
                     aria-selected="${i === focusedIndex}">
                    <div class="cmd-item-icon" aria-hidden="true">${ICONS[cmd.icon] || ICONS.file}</div>
                    <span class="cmd-item-label">${cmd.label}</span>
                </div>
            `;
        });

        results.innerHTML = html;

        // Attach click handlers
        results.querySelectorAll('.cmd-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.idx, 10);
                if (visibleCommands[idx]) execute(visibleCommands[idx]);
            });
        });
    }

    function moveFocus(newIndex) {
        const items = results.querySelectorAll('.cmd-item');
        if (!items.length) return;
        const clamped = Math.max(0, Math.min(newIndex, items.length - 1));
        items.forEach((item, i) => {
            item.classList.toggle('focused', i === clamped);
            item.setAttribute('aria-selected', String(i === clamped));
        });
        focusedIndex = clamped;
        items[clamped]?.scrollIntoView({ block: 'nearest' });
    }

    // Input: filter
    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        const filtered = q
            ? COMMANDS.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q))
            : COMMANDS;
        renderResults(filtered);
    });

    // Input: keyboard navigation
    input.addEventListener('keydown', e => {
        const items = results.querySelectorAll('.cmd-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveFocus(focusedIndex + 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveFocus(focusedIndex - 1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (focusedIndex >= 0 && visibleCommands[focusedIndex]) {
                execute(visibleCommands[focusedIndex]);
            }
        } else if (e.key === 'Escape') {
            closePalette();
        }
    });

    // Triggers
    triggerBtn?.addEventListener('click', openPalette);
    backdrop?.addEventListener('click', closePalette);

    // Global keyboard shortcuts
    document.addEventListener('keydown', e => {
        const isOpen = overlay.classList.contains('open');
        // Ctrl+K / Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            isOpen ? closePalette() : openPalette();
        }
        // Escape
        if (e.key === 'Escape' && isOpen) {
            closePalette();
        }
        // "/" shortcut — only when not typing in an input
        if (e.key === '/' && !isOpen) {
            const tag = document.activeElement.tagName;
            if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
                e.preventDefault();
                openPalette();
            }
        }
    });
}

// ── Terminal Animation ────────────────────────────────────
function typeTerminal() {
    const termBody = document.getElementById('terminal-body');
    if (!termBody) return;
    termBody.innerHTML = '';

    const sequences = [
        {
            type: 'prompt',
            cmd: 'cat about.json',
        },
        {
            type: 'output',
            lines: [
                `{`,
                `  <span class="term-key">"name"</span>:   <span class="term-string">"Yatharth Maharwade"</span>,`,
                `  <span class="term-key">"role"</span>:   <span class="term-string">"Backend Engineer"</span>,`,
                `  <span class="term-key">"stack"</span>:  [<span class="term-string">"Java"</span>, <span class="term-string">"Spring Boot"</span>, <span class="term-string">"PostgreSQL"</span>],`,
                `  <span class="term-key">"status"</span>: <span class="term-val">"open_to_work"</span>`,
                `}`,
            ],
        },
        {
            type: 'prompt',
            cmd: 'git log --oneline -3',
        },
        {
            type: 'output',
            lines: [
                `<span class="term-val">a3f2c1b</span> feat: add RBAC to attendance system`,
                `<span class="term-val">d7e9a04</span> fix: resolve N+1 query in user service`,
                `<span class="term-val">c1b8f3e</span> refactor: clean up REST controller layer`,
            ],
        },
    ];

    function makePromptLine() {
        const div = document.createElement('div');
        div.className = 'term-line';
        div.innerHTML = `<span class="term-user">yatharth</span><span class="term-prompt">@portfolio</span><span class="term-prompt">:~$</span><span class="term-cmd"></span><span class="term-cursor"></span>`;
        termBody.appendChild(div);
        return {
            cmdEl: div.querySelector('.term-cmd'),
            cursorEl: div.querySelector('.term-cursor'),
        };
    }

    function makeOutputLines(lines) {
        lines.forEach(line => {
            const div = document.createElement('div');
            div.className = 'term-output';
            div.innerHTML = line;
            termBody.appendChild(div);
        });
    }

    async function typeText(el, text) {
        for (let i = 0; i < text.length; i++) {
            el.textContent += text[i];
            await sleep(Math.random() * 38 + 22);
        }
    }

    async function run() {
        await sleep(300);
        for (const seq of sequences) {
            if (seq.type === 'prompt') {
                const { cmdEl, cursorEl } = makePromptLine();
                await sleep(500);
                await typeText(cmdEl, seq.cmd);
                await sleep(500);
                cursorEl.remove();
            } else if (seq.type === 'output') {
                makeOutputLines(seq.lines);
                await sleep(250);
            }
        }
        // Final blinking cursor line
        const div = document.createElement('div');
        div.className = 'term-line';
        div.innerHTML = `<span class="term-user">yatharth</span><span class="term-prompt">@portfolio</span><span class="term-prompt">:~$</span> <span class="term-cursor"></span>`;
        termBody.appendChild(div);
    }

    run();
}

// ── Fetch Projects ────────────────────────────────────────
async function fetchProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const projects = await response.json();

        if (!projects.length) {
            container.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:48px;font-family:var(--font-mono);font-size:0.875rem;">No projects found in database.</p>`;
            return;
        }

        container.innerHTML = '';

        projects.forEach((p, index) => {
            const details = PROJECT_DETAILS[p.title];
            const num = String(index + 1).padStart(2, '0');
            const isFeatured = details?.featured ?? false;

            const techHTML = p.technologies
                ? p.technologies.split(',').map(t => `<span class="tech-badge">${t.trim()}</span>`).join('')
                : '';

            const linksHTML = `
                ${p.githubLink ? `
                    <a href="${p.githubLink}" target="_blank" rel="noopener noreferrer" class="project-link">
                        ${ICONS.github} Source Code
                    </a>` : ''}
                ${p.liveLink ? `
                    <a href="${p.liveLink}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Live Demo
                    </a>` : ''}
            `;

            // Case-study layout when rich data exists, else standard
            const bodyHTML = details ? `
                <div class="project-body">
                    <h3 class="project-title">${p.title}</h3>
                    <div class="project-field">
                        <div class="project-field-label">Problem</div>
                        <p class="project-field-text">${details.problem}</p>
                    </div>
                    <div class="project-field">
                        <div class="project-field-label">What I built</div>
                        <p class="project-field-text">${details.highlight}</p>
                    </div>
                    <div class="project-field">
                        <div class="project-field-label">Key challenge</div>
                        <p class="project-field-text">${details.challenge}</p>
                    </div>
                    ${techHTML ? `<div class="project-tech">${techHTML}</div>` : ''}
                    <div class="project-links">${linksHTML}</div>
                </div>
            ` : `
                <div class="project-body">
                    <h3 class="project-title">${p.title}</h3>
                    ${p.description ? `<p class="project-description">${p.description}</p>` : ''}
                    ${techHTML ? `<div class="project-tech">${techHTML}</div>` : ''}
                    <div class="project-links">${linksHTML}</div>
                </div>
            `;

            const card = document.createElement('div');
            card.className = `project-card fade-in-up${isFeatured ? ' featured' : ''}`;
            card.innerHTML = `<div class="project-num" aria-hidden="true">${num}</div>${bodyHTML}`;
            container.appendChild(card);
        });

        // Observe newly appended cards for scroll animation
        const cardObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.06 });

        container.querySelectorAll('.fade-in-up').forEach(el => cardObserver.observe(el));

        // Wake-up ping: fire-and-forget to prevent cold starts on project live demos
        setTimeout(() => {
            projects.forEach(p => {
                if (p.liveLink?.startsWith('http')) {
                    fetch(p.liveLink, { mode: 'no-cors', cache: 'no-cache' }).catch(() => {});
                }
            });
        }, 2500);

    } catch (err) {
        console.error('Could not load projects:', err);
        if (container) {
            container.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:48px;font-family:var(--font-mono);font-size:0.875rem;">Could not reach the project API.</p>`;
        }
    }
}

// ── Render Skills ─────────────────────────────────────────
function renderSkills(data) {
    const container = document.getElementById('skills-container');
    if (!container) return;
    container.innerHTML = '';

    data.forEach(group => {
        const div = document.createElement('div');
        div.className = 'skill-group fade-in-up';

        const chipsHTML = group.skills
            .map(s => `<span class="skill-chip${group.primary ? ' primary' : ''}">${s}</span>`)
            .join('');

        div.innerHTML = `
            <div class="skill-category-title">${group.category}</div>
            <div class="skill-chips">${chipsHTML}</div>
        `;
        container.appendChild(div);
    });

    // Observe skill groups for animation
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    container.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}
