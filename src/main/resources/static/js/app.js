'use strict';

const siteConfig = {};

const COMMANDS = [
    { id: 'about', label: 'Go to About', group: 'Navigate', icon: 'person', action: () => scrollTo('#about') },
    { id: 'experience', label: 'View Experience', group: 'Navigate', icon: 'briefcase', action: () => scrollTo('#experience') },
    { id: 'projects', label: 'Browse Projects', group: 'Navigate', icon: 'folder', action: () => scrollTo('#projects') },
    { id: 'skills', label: 'View Tech Stack', group: 'Navigate', icon: 'code', action: () => scrollTo('#skills') },
    { id: 'contact', label: 'Get in Touch', group: 'Navigate', icon: 'mail', action: () => scrollTo('#contact') },
    { id: 'top', label: 'Back to Top', group: 'Navigate', icon: 'up', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'resume', label: 'Open Resume', group: 'Links', icon: 'file', action: () => window.open('/resume', '_blank') },
    { id: 'github', label: 'View GitHub Profile', group: 'Links', icon: 'github', action: () => openExternal(siteConfig.github_url) },
    { id: 'linkedin', label: 'View LinkedIn Profile', group: 'Links', icon: 'linkedin', action: () => openExternal(siteConfig.linkedin_url) },
    { id: 'email', label: 'Send Email', group: 'Links', icon: 'mail', action: () => openEmail(siteConfig.email) },
];

const ICONS = {
    person: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    briefcase: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    folder: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    code: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    mail: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    file: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    github: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
    linkedin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    up: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>`,
};

const PRINCIPLE_ICONS = {
    file: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>`,
    clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>`,
    grid: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>`,
    shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>`,
};

const SKILL_CATEGORY_ORDER = ['Backend', 'Database', 'Frontend', 'Tools & DevOps', 'Concepts'];

function scrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setCommandShortcutLabel() {
    const shortcut = document.getElementById('cmd-shortcut');
    const trigger = document.getElementById('cmd-trigger');
    if (!shortcut || !trigger) {
        return;
    }

    const platform = navigator.platform || navigator.userAgent || '';
    const isApple = /Mac|iPhone|iPad|iPod/i.test(platform);
    const label = isApple ? '⌘K' : 'Ctrl+K';

    shortcut.textContent = label;
    trigger.setAttribute('aria-label', `Open command palette — ${label}`);
}

function openExternal(url) {
    if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

function openEmail(email) {
    if (email) {
        window.location.href = `mailto:${email}`;
    }
}

function fetchJson(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(`${url} returned HTTP ${response.status}`);
        }
        return response.json();
    });
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element && typeof value === 'string' && value.trim()) {
        element.textContent = value;
    }
}

function setHref(id, href) {
    const element = document.getElementById(id);
    if (element && href) {
        element.setAttribute('href', href);
    }
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function splitTags(value) {
    return String(value ?? '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}

function renderUnavailable(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    container.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:48px;font-family:var(--font-mono);font-size:0.875rem;">${escapeHtml(message)}</p>`;
}

function applySiteConfig() {
    const fullName = siteConfig.full_name;
    const firstName = fullName ? fullName.split(' ')[0] : '';

    setText('brand-name-text', firstName);
    setText('hero-availability-text', siteConfig.hero_availability_text);
    setText('hero-title-line1', siteConfig.hero_title_line1);
    setText('hero-title-line2', siteConfig.hero_title_line2);
    setText('hero-description', siteConfig.hero_description);
    setText('hero-location', siteConfig.location);
    setText('hero-education', siteConfig.education_short);
    setText('hero-stack', siteConfig.primary_stack);
    setText('about-heading', siteConfig.about_heading);
    setText('about-para-1', siteConfig.about_para_1);
    setText('about-para-2', siteConfig.about_para_2);
    setText('contact-email-text', siteConfig.email);
    setHref('contact-email-link', siteConfig.email ? `mailto:${siteConfig.email}` : '');
    setHref('contact-linkedin-link', siteConfig.linkedin_url);
    setHref('contact-github-link', siteConfig.github_url);
    setText('footer-full-name', siteConfig.full_name);
    setText('footer-tech-text', siteConfig.footer_tech_text);
}

function observeFadeIn(scope = document) {
    const items = scope.querySelectorAll('.fade-in-up');
    if (!items.length) {
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    items.forEach(item => observer.observe(item));
}

document.addEventListener('DOMContentLoaded', async () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    setCommandShortcutLabel();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initActiveNavHighlight();
    initCommandPalette();

    await loadPortfolioContent();
    setTimeout(typeTerminal, 900);
});

async function loadPortfolioContent() {
    const results = await Promise.allSettled([
        fetchJson('/api/config'),
        fetchJson('/api/stats'),
        fetchJson('/api/experiences'),
        fetchJson('/api/projects'),
        fetchJson('/api/skills'),
        fetchJson('/api/principles'),
    ]);

    const [configResult, statsResult, experiencesResult, projectsResult, skillsResult, principlesResult] = results;

    if (configResult.status === 'fulfilled') {
        Object.assign(siteConfig, configResult.value);
        applySiteConfig();
    }

    if (statsResult.status === 'fulfilled') {
        renderStats(statsResult.value);
    } else {
        renderUnavailable('about-stats-container', 'Could not load stats from the backend.');
    }

    if (experiencesResult.status === 'fulfilled') {
        renderExperiences(experiencesResult.value);
    } else {
        renderUnavailable('experience-timeline', 'Could not load experience from the backend.');
    }

    if (projectsResult.status === 'fulfilled') {
        renderProjects(projectsResult.value);
    } else {
        renderUnavailable('projects-container', 'Could not reach the project API.');
    }

    if (skillsResult.status === 'fulfilled') {
        renderSkills(skillsResult.value);
    } else {
        renderUnavailable('skills-container', 'Could not load skills from the backend.');
    }

    if (principlesResult.status === 'fulfilled') {
        renderPrinciples(principlesResult.value);
    } else {
        renderUnavailable('principles-grid', 'Could not load principles from the backend.');
    }
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const progress = document.getElementById('reading-progress');
    if (!navbar) {
        return;
    }

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        if (progress) {
            const scrollTop = document.documentElement.scrollTop;
            const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progress.style.width = `${(scrollTop / total) * 100}%`;
        }
    }, { passive: true });
}

function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) {
        return;
    }

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

function initScrollAnimations() {
    observeFadeIn(document);
}

function initActiveNavHighlight() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    if (!sections.length || !navLinks.length) {
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === entry.target.id);
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(section => observer.observe(section));
}

function initCommandPalette() {
    const overlay = document.getElementById('cmd-palette');
    const input = document.getElementById('cmd-input');
    const results = document.getElementById('cmd-results');
    const triggerButton = document.getElementById('cmd-trigger');
    const backdrop = document.getElementById('cmd-backdrop');
    if (!overlay || !input || !results) {
        return;
    }

    let focusedIndex = 0;
    let visibleCommands = [...COMMANDS];

    function openPalette() {
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        input.value = '';
        renderResults(COMMANDS);
        requestAnimationFrame(() => setTimeout(() => input.focus(), 60));
    }

    function closePalette() {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        focusedIndex = 0;
    }

    function execute(command) {
        closePalette();
        setTimeout(() => command.action(), 120);
    }

    function renderResults(commands) {
        visibleCommands = commands;
        focusedIndex = commands.length > 0 ? 0 : -1;

        if (commands.length === 0) {
            results.innerHTML = `<p style="text-align:center;padding:28px 16px;color:var(--text-dim);font-size:0.875rem;font-family:var(--font-mono);">No results for "${escapeHtml(input.value)}"</p>`;
            return;
        }

        let html = '';
        commands.forEach((command, index) => {
            const isFirstInGroup = !commands[index - 1] || commands[index - 1].group !== command.group;
            if (isFirstInGroup) {
                html += `<div class="cmd-group-label">${escapeHtml(command.group)}</div>`;
            }
            html += `
                <div class="cmd-item${index === focusedIndex ? ' focused' : ''}"
                     data-idx="${index}"
                     role="option"
                     aria-selected="${index === focusedIndex}">
                    <div class="cmd-item-icon" aria-hidden="true">${ICONS[command.icon] || ICONS.file}</div>
                    <span class="cmd-item-label">${escapeHtml(command.label)}</span>
                </div>
            `;
        });

        results.innerHTML = html;

        results.querySelectorAll('.cmd-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = Number.parseInt(item.dataset.idx, 10);
                if (visibleCommands[index]) {
                    execute(visibleCommands[index]);
                }
            });
        });
    }

    function moveFocus(newIndex) {
        const items = results.querySelectorAll('.cmd-item');
        if (!items.length) {
            return;
        }

        const clamped = Math.max(0, Math.min(newIndex, items.length - 1));
        items.forEach((item, index) => {
            item.classList.toggle('focused', index === clamped);
            item.setAttribute('aria-selected', String(index === clamped));
        });
        focusedIndex = clamped;
        items[clamped]?.scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        const filtered = query
            ? COMMANDS.filter(command =>
                command.label.toLowerCase().includes(query) ||
                command.group.toLowerCase().includes(query))
            : COMMANDS;
        renderResults(filtered);
    });

    input.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            moveFocus(focusedIndex + 1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            moveFocus(focusedIndex - 1);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (focusedIndex >= 0 && visibleCommands[focusedIndex]) {
                execute(visibleCommands[focusedIndex]);
            }
        } else if (event.key === 'Escape') {
            closePalette();
        }
    });

    triggerButton?.addEventListener('click', openPalette);
    backdrop?.addEventListener('click', closePalette);

    document.addEventListener('keydown', event => {
        const isOpen = overlay.classList.contains('open');
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            isOpen ? closePalette() : openPalette();
        }
        if (event.key === 'Escape' && isOpen) {
            closePalette();
        }
        if (event.key === '/' && !isOpen) {
            const tag = document.activeElement.tagName;
            if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
                event.preventDefault();
                openPalette();
            }
        }
    });
}

function typeTerminal() {
    const terminalBody = document.getElementById('terminal-body');
    if (!terminalBody) {
        return;
    }

    terminalBody.innerHTML = '';

    const fullName = siteConfig.full_name || 'Yatharth Maharwade';
    const role = siteConfig.role || 'Backend Engineer';
    const primaryStack = splitTags(String(siteConfig.primary_stack || '').replaceAll('·', ','));
    const stack = primaryStack.length ? primaryStack : ['Java', 'Spring Boot', 'PostgreSQL'];

    const sequences = [
        { type: 'prompt', cmd: 'cat about.json' },
        {
            type: 'output',
            lines: [
                '{',
                `  <span class="term-key">"name"</span>:   <span class="term-string">"${escapeHtml(fullName)}"</span>,`,
                `  <span class="term-key">"role"</span>:   <span class="term-string">"${escapeHtml(role)}"</span>,`,
                `  <span class="term-key">"stack"</span>:  [${stack.map(item => `<span class="term-string">"${escapeHtml(item)}"</span>`).join(', ')}],`,
                `  <span class="term-key">"status"</span>: <span class="term-val">"open_to_work"</span>`,
                '}',
            ],
        },
        { type: 'prompt', cmd: 'git log --oneline -3' },
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
        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span class="term-user">yatharth</span><span class="term-prompt">@portfolio</span><span class="term-prompt">:~$</span><span class="term-cmd"></span><span class="term-cursor"></span>`;
        terminalBody.appendChild(line);
        return {
            commandElement: line.querySelector('.term-cmd'),
            cursorElement: line.querySelector('.term-cursor'),
        };
    }

    function makeOutputLines(lines) {
        lines.forEach(line => {
            const output = document.createElement('div');
            output.className = 'term-output';
            output.innerHTML = line;
            terminalBody.appendChild(output);
        });
    }

    async function typeText(element, text) {
        for (let index = 0; index < text.length; index += 1) {
            element.textContent += text[index];
            await sleep(Math.random() * 38 + 22);
        }
    }

    async function run() {
        await sleep(300);
        for (const sequence of sequences) {
            if (sequence.type === 'prompt') {
                const { commandElement, cursorElement } = makePromptLine();
                await sleep(500);
                await typeText(commandElement, sequence.cmd);
                await sleep(500);
                cursorElement.remove();
            } else {
                makeOutputLines(sequence.lines);
                await sleep(250);
            }
        }

        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span class="term-user">yatharth</span><span class="term-prompt">@portfolio</span><span class="term-prompt">:~$</span> <span class="term-cursor"></span>`;
        terminalBody.appendChild(line);
    }

    run();
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    if (!container) {
        return;
    }

    if (!Array.isArray(projects) || projects.length === 0) {
        renderUnavailable('projects-container', 'No projects found in the database.');
        return;
    }

    container.innerHTML = '';

    projects.forEach((project, index) => {
        const techHtml = splitTags(project.technologies)
            .map(technology => `<span class="tech-badge">${escapeHtml(technology)}</span>`)
            .join('');

        const sourceHtml = project.githubLink
            ? `<a href="${escapeHtml(project.githubLink)}" target="_blank" rel="noopener noreferrer" class="project-link">${ICONS.github} Source Code</a>`
            : '';

        const liveDemoHtml = project.liveLink
            ? `<a href="${escapeHtml(project.liveLink)}" target="_blank" rel="noopener noreferrer" class="project-link project-link-demo"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Live Demo</a>`
            : '';

        const hasCaseStudyFields = project.problem && project.highlight && project.challenge;
        const bodyHtml = hasCaseStudyFields
            ? `
                <div class="project-body">
                    <h3 class="project-title">${escapeHtml(project.title)}</h3>
                    <div class="project-field">
                        <div class="project-field-label">Problem</div>
                        <p class="project-field-text">${escapeHtml(project.problem)}</p>
                    </div>
                    <div class="project-field">
                        <div class="project-field-label">What I built</div>
                        <p class="project-field-text">${escapeHtml(project.highlight)}</p>
                    </div>
                    <div class="project-field">
                        <div class="project-field-label">Key challenge</div>
                        <p class="project-field-text">${escapeHtml(project.challenge)}</p>
                    </div>
                    ${techHtml ? `<div class="project-tech">${techHtml}</div>` : ''}
                    <div class="project-links">${sourceHtml}</div>
                </div>
            `
            : `
                <div class="project-body">
                    <h3 class="project-title">${escapeHtml(project.title)}</h3>
                    ${project.description ? `<p class="project-description">${escapeHtml(project.description)}</p>` : ''}
                    ${techHtml ? `<div class="project-tech">${techHtml}</div>` : ''}
                    <div class="project-links">${sourceHtml}</div>
                </div>
            `;

        const card = document.createElement('div');
        card.className = `project-card fade-in-up${project.featured ? ' featured' : ''}`;
        card.innerHTML = `<div class="project-num" aria-hidden="true">${String(index + 1).padStart(2, '0')}</div>${bodyHtml}${liveDemoHtml}`;
        container.appendChild(card);
    });

    observeFadeIn(container);

    setTimeout(() => {
        projects.forEach(project => {
            if (project.liveLink?.startsWith('http')) {
                fetch(project.liveLink, { mode: 'no-cors', cache: 'no-cache' }).catch(() => {});
            }
        });
    }, 2500);
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container) {
        return;
    }

    if (!Array.isArray(skills) || skills.length === 0) {
        renderUnavailable('skills-container', 'No skills found in the database.');
        return;
    }

    const groupedSkills = new Map();
    skills.forEach(skill => {
        const category = skill.category || 'Other';
        if (!groupedSkills.has(category)) {
            groupedSkills.set(category, []);
        }
        groupedSkills.get(category).push(skill);
    });

    const orderedCategories = [...groupedSkills.keys()].sort((left, right) => {
        const leftIndex = SKILL_CATEGORY_ORDER.indexOf(left);
        const rightIndex = SKILL_CATEGORY_ORDER.indexOf(right);
        const safeLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
        const safeRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
        return safeLeft - safeRight || left.localeCompare(right);
    });

    container.innerHTML = '';

    orderedCategories.forEach(category => {
        const categorySkills = groupedSkills.get(category)
            .slice()
            .sort((left, right) => right.rating - left.rating || left.name.localeCompare(right.name));

        const isPrimary = categorySkills.some(skill => skill.primary || skill.isPrimary);
        const chipsHtml = categorySkills
            .map(skill => `<span class="skill-chip${isPrimary ? ' primary' : ''}">${escapeHtml(skill.name)}</span>`)
            .join('');

        const group = document.createElement('div');
        group.className = 'skill-group fade-in-up';
        group.innerHTML = `
            <div class="skill-category-title">${escapeHtml(category)}</div>
            <div class="skill-chips">${chipsHtml}</div>
        `;
        container.appendChild(group);
    });

    observeFadeIn(container);
}

function renderStats(stats) {
    const container = document.getElementById('about-stats-container');
    if (!container) {
        return;
    }

    if (!Array.isArray(stats) || stats.length === 0) {
        renderUnavailable('about-stats-container', 'No stats found in the database.');
        return;
    }

    const orderedStats = stats
        .slice()
        .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0));

    container.innerHTML = orderedStats.map(stat => `
        <div class="stat-card">
            <span class="stat-number">${escapeHtml(stat.value)}</span>
            <span class="stat-label">${escapeHtml(stat.label)}</span>
        </div>
    `).join('');
}

function renderExperiences(experiences) {
    const container = document.getElementById('experience-timeline');
    if (!container) {
        return;
    }

    if (!Array.isArray(experiences) || experiences.length === 0) {
        renderUnavailable('experience-timeline', 'No experience entries found in the database.');
        return;
    }

    const orderedExperiences = experiences
        .slice()
        .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0));

    container.innerHTML = orderedExperiences.map(experience => `
        <div class="timeline-item fade-in-up">
            <div class="timeline-marker${experience.current || experience.isCurrent ? ' current' : ''}"${experience.current || experience.isCurrent ? ' aria-label="Current role"' : ''}></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <div>
                        <h3 class="role">${escapeHtml(experience.role)}</h3>
                        <h4 class="company">${escapeHtml(experience.company)}${experience.location ? ` <span class="company-loc">· ${escapeHtml(experience.location)}</span>` : ''}</h4>
                    </div>
                    <span class="date">${escapeHtml(experience.displayLabel || '')}</span>
                </div>
                ${experience.description ? `<p class="description">${escapeHtml(experience.description)}</p>` : ''}
                <div class="role-tags" aria-label="Technologies used">
                    ${splitTags(experience.tags).map(tag => `<span class="role-tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    observeFadeIn(container);
}

function renderPrinciples(principles) {
    const container = document.getElementById('principles-grid');
    if (!container) {
        return;
    }

    if (!Array.isArray(principles) || principles.length === 0) {
        renderUnavailable('principles-grid', 'No principles found in the database.');
        return;
    }

    const orderedPrinciples = principles
        .slice()
        .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0));

    container.innerHTML = orderedPrinciples.map(principle => `
        <div class="principle-card fade-in-up">
            <div class="principle-icon" aria-hidden="true">
                ${PRINCIPLE_ICONS[principle.iconKey] || PRINCIPLE_ICONS.file}
            </div>
            <h4 class="principle-title">${escapeHtml(principle.title)}</h4>
            <p class="principle-desc">${escapeHtml(principle.description)}</p>
        </div>
    `).join('');

    observeFadeIn(container);
}
