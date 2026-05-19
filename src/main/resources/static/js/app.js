// Setup dynamic elements
document.addEventListener('DOMContentLoaded', () => {
    // Current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenu.classList.contains('active') ? 
            '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>' : 
            '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
        mobileToggle.querySelector('svg').innerHTML = icon;
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileToggle.querySelector('svg').innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
        });
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update reading progress bar
        const progressBar = document.getElementById('reading-progress');
        if (progressBar) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // Fetch data
    fetchProjects();
    fetchSkills();
    
    // Terminal typing effect
    setTimeout(typeTerminal, 1000);
});

async function fetchProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        const container = document.getElementById('projects-container');
        if (projects.length === 0) {
            container.innerHTML = '<p class="text-muted">No projects found. Add some from the admin panel.</p>';
            return;
        }
        
        container.innerHTML = '';
        projects.forEach((p, index) => {
            const delay = index * 0.1;
            const card = document.createElement('div');
            card.className = 'project-card fade-in-up';
            card.style.animationDelay = `${delay}s`;
            
            // Format technologies as badges
            const techList = p.technologies ? p.technologies.split(',').map(t => `<span class="tech-badge">${t.trim()}</span>`).join('') : '';
            
            card.innerHTML = `
                <div class="project-content">
                    <h3 class="project-title">${p.title}</h3>
                    <p class="project-description">${p.description}</p>
                    <div class="project-tech">
                        ${techList}
                    </div>
                </div>
                <div class="project-footer">
                    ${p.githubLink ? `<a href="${p.githubLink}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        Source Code
                    </a>` : ''}
                    ${p.liveLink ? `<a href="${p.liveLink}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        Live Demo
                    </a>` : ''}
                </div>
            `;
            container.appendChild(card);
            
            // Re-observe newly added elements
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            });
            observer.observe(card);
            
            // Apply 3D tilt effect
            applyTiltEffectNode(card);
        });
        
        // Also apply tilt to philosophy items
        document.querySelectorAll('.philosophy-list li').forEach(li => applyTiltEffectNode(li));
        
        // WAKE UP PING: Render Free Tier Cold Start Mitigation
        // This sends a fire-and-forget background ping to wake up sleeping projects
        setTimeout(() => {
            projects.forEach(p => {
                if (p.liveLink && p.liveLink.startsWith('http')) {
                    fetch(p.liveLink, { mode: 'no-cors', cache: 'no-cache' })
                        .catch(() => {}); // Silently ignore errors, we just want to knock on the server
                }
            });
        }, 1500); // Delayed slightly so it doesn't interrupt the portfolio's initial load speed
        
    } catch (error) {
        console.error('Error fetching projects:', error);
        document.getElementById('projects-container').innerHTML = '<p class="text-error">Failed to load projects.</p>';
    }
}

async function fetchSkills() {
    try {
        const response = await fetch('/api/skills');
        const skills = await response.json();
        
        const container = document.getElementById('skills-container');
        if (skills.length === 0) {
            container.innerHTML = '<p class="text-muted">No skills found.</p>';
            return;
        }
        
        // Group by category
        const categorized = skills.reduce((acc, skill) => {
            // Normalize category to prevent duplicates (e.g., "TOOLS" vs "TOOLS ")
            const catRaw = skill.category || 'OTHER';
            const cat = catRaw.trim().toUpperCase();
            
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(skill);
            return acc;
        }, {});
        
        container.innerHTML = '';
        
        Object.keys(categorized).forEach((category, idx) => {
            const catDiv = document.createElement('div');
            catDiv.className = 'skill-group';
            
            let skillsHtml = categorized[category].map(s => {
                // simple 1-5 rating visualizer if rating exists
                let ratingHtml = '';
                if(s.rating) {
                    let r = parseInt(s.rating);
                    for(let i=1; i<=5; i++) {
                       if(i<=r) ratingHtml += '<span class="star filled">★</span>';
                       else ratingHtml += '<span class="star">★</span>';
                    }
                }
                return `
                <div class="skill-item">
                    <span class="skill-name">${s.name}</span>
                    ${ratingHtml ? `<div class="skill-rating">${ratingHtml}</div>` : ''}
                </div>
                `;
            }).join('');
            
            catDiv.innerHTML = `
                <h3 class="skill-category-title">${category}</h3>
                <div class="skills-grid">
                    ${skillsHtml}
                </div>
            `;
            container.appendChild(catDiv);
            
            // Apply 3D tilt effect to skill boxes
            catDiv.querySelectorAll('.skill-item').forEach(item => applyTiltEffectNode(item));
        });
    } catch (error) {
        console.error('Error fetching skills:', error);
        document.getElementById('skills-container').innerHTML = '<p class="text-error">Failed to load skills.</p>';
    }
}

function typeTerminal() {
    const termBody = document.getElementById('terminal-body');
    if(!termBody) return;
    
    termBody.innerHTML = ''; // Ensure it's clear
    
    const sequences = [
        { type: 'input', text: 'java -version' },
        { type: 'output', html: 'openjdk version "21.0.1" 2023-10-17 LTS<br>OpenJDK Runtime Environment (build 21.0.1+12-LTS-29)' },
        { type: 'input', text: 'curl https://api.yatharth.dev/status' },
        { type: 'output', html: '{<br>&nbsp;&nbsp;"status": "online",<br>&nbsp;&nbsp;"role": "Software Engineer",<br>&nbsp;&nbsp;"focus": ["Backend", "Spring Boot", "APIs"]<br>}' }
    ];
    
    function createPromptLine() {
        const p = document.createElement('p');
        p.innerHTML = `<span class="term-prompt">$</span> <span class="typing-text"></span><span class="term-cursor"></span>`;
        termBody.appendChild(p);
        return p.querySelector('.typing-text');
    }
    
    function createOutputLine(html) {
        const p = document.createElement('p');
        p.className = 'term-output';
        p.innerHTML = html;
        termBody.appendChild(p);
    }
    
    async function typeText(element, text) {
        for (let i = 0; i < text.length; i++) {
            element.textContent += text.charAt(i);
            await new Promise(r => setTimeout(r, Math.random() * 50 + 30));
        }
    }
    
    async function processSequence() {
        for (const seq of sequences) {
            if (seq.type === 'input') {
                const textNode = createPromptLine();
                await new Promise(r => setTimeout(r, 600)); // wait before typing
                await typeText(textNode, seq.text);
                await new Promise(r => setTimeout(r, 800)); // wait after typing (simulate enter)
                
                // remove cursor from previous line
                const cursor = textNode.nextElementSibling;
                if(cursor) cursor.remove();
                
            } else if (seq.type === 'output') {
                createOutputLine(seq.html);
            }
        }
        
        // Final blinking cursor
        const p = document.createElement('p');
        p.innerHTML = `<span class="term-prompt">$</span> <span class="term-cursor"></span>`;
        termBody.appendChild(p);
    }
    
    processSequence();
}

// 3D Tilt Effect Utility
function applyTiltEffectNode(element) {
    element.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out, border-color 0.1s ease-out';
    element.style.transformStyle = 'preserve-3d';
    
    element.addEventListener('mousemove', e => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Max rotation of 4 degrees
        const rotateX = ((y - centerY) / centerY) * -4; 
        const rotateY = ((x - centerX) / centerX) * 4;
        
        element.style.transform = `perspective(1000px) scale3d(1.02, 1.02, 1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        if(element.classList.contains('project-card') || element.classList.contains('skill-item')) {
            element.style.borderColor = 'var(--border-hover)';
            element.style.boxShadow = '0 20px 40px -15px rgba(0,0,0,0.6)';
        }
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)';
        if(element.classList.contains('project-card') || element.classList.contains('skill-item')) {
            element.style.borderColor = 'var(--border-color)';
            element.style.boxShadow = 'none';
        }
        
        element.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out';
        setTimeout(() => {
            element.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out, border-color 0.1s ease-out';
        }, 300);
    });
}
