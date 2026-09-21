# PORTFOLIO CODEBASE AUDIT & STITCH REDESIGN PROMPT

---

## PHASE 1 — CODEBASE AUDIT & INVENTORY

### 1. Stack & Architecture
- **Backend Framework**: Java 21, Spring Boot `4.0.0` (`spring-boot-starter-webmvc`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-boot-starter-validation`).
- **Database & Migrations**: PostgreSQL runtime (H2 in test scope), Hibernate ORM `7.1.8.Final`, Flyway database migration (`flyway-core`, `flyway-database-postgresql`). Database migrations pre-populate all site config, experience, projects, skills, principles, and stats via `V8__seed_hardcoded_data.sql`.
- **Security & Authentication**: Spring Security 6 with HTTP Basic Authentication (`/admin.html`, `/api/admin/**`) and CSRF protection via `CookieCsrfTokenRepository` (`XSRF-TOKEN` cookie, `X-XSRF-TOKEN` header).
- **Frontend Architecture**: Single Page Application (SPA) with semantic HTML5 (`src/main/resources/static/index.html`), Vanilla JavaScript (ES6+, Async/Await, Fetch API, DOM manipulation), and Vanilla CSS3 (`src/main/resources/static/css/style.css`).
- **Routing Method**:
  - Public Client: Anchor-based smooth scrolling SPA (`#about`, `#experience`, `#projects`, `#skills`, `#contact`) on `index.html`.
  - Admin Client: `/admin.html` (Static page backed by Spring Security Basic Auth).
  - Backend API: REST Controllers mapping `/api/config`, `/api/stats`, `/api/experiences`, `/api/projects`, `/api/skills`, `/api/principles`, `/api/health`, `/resume`, `/api/admin/**`.
- **State Management**: Dynamic REST API initialization via `Promise.allSettled` populating client state (`siteConfig`, `COMMANDS`, `allProjects`, `allSkills`).
- **Build & Deployment**: Apache Maven (`mvnw` wrapper), Docker (Multi-stage build using `eclipse-temurin:21-jre`), hosted on Render with zero-downtime rolling restarts.
- **`pom.xml` Summary**: Spring Boot parent `4.0.0`, Java 21, Spring JPA, Spring MVC, Spring Security, Flyway PostgreSQL, DevTools, Postgres Driver, H2.

---

### 2. Pages & Routes
| Route / URL | Source File Path | Description |
| :--- | :--- | :--- |
| `/` or `/index.html` | [index.html](file:///f:/portfolio/portfolio/src/main/resources/static/index.html) | Public single-page portfolio (Hero, About, Experience, Projects, Stack, Principles, Contact, Command Palette). |
| `/admin.html` | [admin.html](file:///f:/portfolio/portfolio/src/main/resources/static/admin.html) | Protected admin panel for managing projects and technical skills. |
| `/resume` | [PageController.java](file:///f:/portfolio/portfolio/src/main/java/com/jsp/portfolio/controller/PageController.java) | Endpoint serving `static/resume/Yatharth_Maharwade_Resume.pdf` with `Content-Disposition: inline`. |
| `/api/health` | [HealthController.java](file:///f:/portfolio/portfolio/src/main/java/com/jsp/portfolio/controller/HealthController.java) | Health check endpoint returning `{ status: "UP", timestamp: "...", service: "Portfolio API" }`. |
| `/api/config` | [SiteConfigController.java](file:///f:/portfolio/portfolio/src/main/java/com/jsp/portfolio/controller/SiteConfigController.java) | REST API returning key-value site configuration strings. |
| `/api/stats` | [StatController.java](file:///f:/portfolio/portfolio/src/main/java/com/jsp/portfolio/controller/StatController.java) | REST API returning quick stats (e.g. 7+ Projects shipped). |
| `/api/experiences` | [ExperienceController.java](file:///f:/portfolio/portfolio/src/main/java/com/jsp/portfolio/controller/ExperienceController.java) | REST API returning career experience timeline entries. |
| `/api/projects` | [PageController.java](file:///f:/portfolio/portfolio/src/main/java/com/jsp/portfolio/controller/PageController.java) | REST API returning detailed portfolio project case studies. |
| `/api/skills` | [SkillController.java](file:///f:/portfolio/portfolio/src/main/java/com/jsp/portfolio/controller/SkillController.java) | REST API returning technical skill inventory grouped by category. |
| `/api/principles` | [PrincipleController.java](file:///f:/portfolio/portfolio/src/main/java/com/jsp/portfolio/controller/PrincipleController.java) | REST API returning 4 core engineering principles. |
| `/api/admin/**` | [AdminController.java](file:///f:/portfolio/portfolio/src/main/java/com/jsp/portfolio/controller/AdminController.java) | Protected CRUD endpoints (`/csrf`, `/addProject`, `/deleteProject/{id}`, `/addSkill`, `/deleteSkill/{id}`). |

---

### 3. Reusable Components
- **Navbar (`.navbar`)**: Brand initials (`YM`), Brand name (`Yatharth`), desktop nav links (`About`, `Experience`, `Projects`, `Stack`), Command Palette trigger button (`Ctrl/Cmd + K`), Resume button (`/resume`), mobile toggle button.
- **Command Palette (`#cmd-palette`)**: Modal dialog activated by `Ctrl/Cmd + K` or `/` featuring live input search, keyboard navigation (`↑`/`↓`/`↵`/`ESC`), categorized groups (`Navigate`, `Links`), and action dispatchers.
- **Reading Progress Bar (`#reading-progress`)**: Top fixed scroll progress indicator.
- **Hero Unit (`#hero`)**: Status pill badge ("Available for Backend Engineering roles"), two-line hero title with gradient text, bio snippet, CTA buttons ("View Projects", "Resume ↗"), metadata bar, and live terminal preview (`#terminal-body`).
- **Terminal Simulator (`typeTerminal()`)**: Interactive terminal container rendering animated command prompts (`cat about.json`, `git log --oneline -3`) and JSON syntax-highlighted output.
- **About Section (`#about`)**: Two-column layout with section label, main header, 2 paragraphs, and a 4-card statistics grid (`.stat-card`).
- **Experience Timeline (`#experience`)**: Vertical timeline with status markers (`.timeline-marker.current`), role/company headers, date badges, description paragraphs, and technology tags (`.role-tag`).
- **Project Cards (`#projects`)**: Project card grid with skeleton loading states, project numbers (`01`, `02`...), case-study fields (Problem, What I built, Key challenge), tech badges, GitHub repository links, live demo links, and optional featured badge styling.
- **Tech Stack Cards (`#skills`)**: Category-grouped skill cards (`.skill-group`) displaying skill chips (`.skill-chip`, `.skill-chip.primary`).
- **Engineering Principles Grid (`.principles-section`)**: 4-card grid (`.principle-card`) featuring custom inline SVG icons, principle titles, and approach descriptions.
- **Contact Card (`#contact`)**: CTA card with primary email link button (`mailto:yatharth0503@hotmail.com`) and secondary pill links (LinkedIn, GitHub, Resume).
- **Footer (`.footer`)**: Brand initials, full name, dynamic copyright year, backend status indicator ("All systems operational"), and technology badge ("Built with Spring Boot & PostgreSQL").
- **Admin Management Forms & Tables (`admin.html`)**: Project management table & CRUD form, skill management table & CRUD form, status alert banners, CSRF token handler.

---

### 4. Content Inventory

#### A. Site Configuration & Hero Content (Source: `site_config` DB table / REST `/api/config`)
- **Full Name**: `Yatharth Maharwade`
- **Role**: `Backend Engineer`
- **Email**: `yatharth0503@hotmail.com`
- **LinkedIn**: `https://www.linkedin.com/in/yatharthmaharwade/`
- **GitHub**: `https://github.com/yatharth5304`
- **Location**: `Pune, India`
- **Education**: `B.Tech CSE · 2025`
- **Primary Stack**: `Java · Spring Boot · PostgreSQL`
- **Hero Availability**: `Available for Backend Engineering roles`
- **Hero Title Line 1**: `Building backend systems`
- **Hero Title Line 2**: `that hold under pressure.`
- **Hero Description**: `I'm Yatharth Maharwade — a Backend Engineer specializing in Java, Spring Boot, and PostgreSQL. I focus on clean API design, solid data layers, and services that perform when it matters.`
- **About Heading**: `I care about how software actually works.`
- **About Paragraph 1**: `B.Tech CSE graduate from Nagpur who spent a year in intensive Java training at QSpiders, contributed to R&D at Bliinc, and now builds backend services at Vintyaa Technologies in Pune. I'm drawn to backend problems — API design, data modeling, query performance, and system reliability.`
- **About Paragraph 2**: `My approach: understand the problem first, design before coding, and ship something that works — not just something that demos well.`
- **Footer Tech Text**: `Built with Spring Boot & PostgreSQL`

#### B. Quick Stats (Source: `stat` DB table / REST `/api/stats`)
1. `7+` — `Projects shipped`
2. `4` — `Roles & internships`
3. `2+` — `Years on Java`
4. `5` — `Certifications`

#### C. Experience Timeline (Source: `experience` DB table / REST `/api/experiences`)
1. **Software Engineer** | `Vintyaa Technologies Pvt Ltd` · Pune | `Apr 2026 – Present` (Current)
   - *Description*: Architecting and building backend services using Java and Spring Boot. Designing RESTful APIs, optimizing PostgreSQL queries, and maintaining service reliability in production.
   - *Tags*: `Java`, `Spring Boot`, `PostgreSQL`, `REST APIs`
2. **Student Intern** | `QSpiders Training & Development` · Pune | `Feb 2025 – Jan 2026`
   - *Description*: Intensive full-stack Java development training. Covered advanced Java concepts, Spring Framework, Hibernate/JPA, and SQL. Built multiple projects from scratch under mentorship.
   - *Tags*: `Java`, `Spring Framework`, `Hibernate / JPA`, `SQL`
3. **R&D Intern** | `Bliinc` · Nagpur | `Dec 2024 – Apr 2025`
   - *Description*: Contributed to R&D initiatives exploring new technology solutions. Implemented proof-of-concept features, conducted feasibility studies, and collaborated on product innovation.
   - *Tags*: `R&D`, `Prototyping`, `Product Innovation`

#### D. Selected Projects (Source: `project` DB table / REST `/api/projects`)
1. **Developer Portfolio**
   - *Technologies*: `Java, Spring Boot, PostgreSQL, Docker, Render`
   - *Problem*: My personal developer portfolio built with a Spring Boot backend served as a REST API and a responsive, premium single-page application frontend — demonstrating real backend architecture rather than a static file.
   - *What I built*: This site — a Spring Boot REST API + PostgreSQL backend, Flyway-managed schema, admin panel for content management, Docker containerised and deployed on Render with zero-downtime rolling restarts.
   - *Key challenge*: Free-tier cold starts on Render cause multi-second spin-up delays. Solved with skeleton loaders and background wake-up pings so perceived load feels near-instant to visitors.
2. **FoodFinder**
   - *Technologies*: `Java, Spring Boot, PostgreSQL, REST API`
   - *Problem*: Discovering local food options is fragmented across multiple apps and hard to filter meaningfully. Users need a single, fast interface with geolocation awareness.
   - *What I built*: Full-stack food discovery platform with smart search, category filters, geolocation-based sorting, and a modern responsive UI — all backed by a Spring Boot REST API and PostgreSQL.
   - *Key challenge*: Keeping search response time fast despite querying across multiple data dimensions (category, location, keyword) simultaneously without index bloat.
3. **OMDB Movie Explorer**
   - *Technologies*: `Java, Spring Boot, JWT, REST API`
   - *Problem*: No clean, focused interface to search and explore movie data from the OMDB catalog. Existing tools are cluttered or require accounts.
   - *What I built*: Movie discovery UI with real-time search, detail views, favourites saved per user session with JWT auth, and client-side caching to avoid redundant API calls.
   - *Key challenge*: Handling OMDB API rate limits gracefully and implementing JWT authentication in a stateless Spring Boot setup without session storage.
   - *GitHub*: `https://github.com/yatharth5304/OMDBMovieExplorer`
4. **Student Attendance Management System** *(Featured)*
   - *Technologies*: `Java, Spring Boot, PostgreSQL, RBAC`
   - *Problem*: Manual attendance tracking is error-prone and gives zero real-time visibility to faculty or administrators. Spreadsheets break down at scale.
   - *What I built*: Multi-role web application with separate scoped dashboards — Admin sees institution-wide data, Faculty manages only their assigned classes, Students track their own attendance records.
   - *Key challenge*: Designing the RBAC model cleanly so data-scope enforcement happens at the service layer, not scattered across controllers — ensuring no role can query another role's data.
   - *GitHub*: `https://github.com/yatharth5304/Student-Attendance-Management-System`
5. **Realtime Face Tracking Gimbal** *(Featured)*
   - *Technologies*: `Python, OpenCV, CNN, Embedded C/C++, Hardware`
   - *Problem*: Static cameras lose subjects in dynamic environments. Needed hardware that physically follows a face in real time without manual camera control.
   - *What I built*: Computer vision pipeline using OpenCV and a CNN that detects faces per frame and drives servo motors via serial commands to keep the subject centred automatically.
   - *Key challenge*: Decoupling the frame-processing thread from the motor-control thread to eliminate actuation lag caused by blocking I/O — solved with a producer-consumer queue pattern.
6. **Music Webapp**
   - *Technologies*: `JavaScript, HTML5, CSS3, Web Audio API`
   - *Problem*: Wanted a lightweight, dependency-free web music player without streaming platform constraints or heavy framework overhead.
   - *What I built*: Browser-based music webapp with full playback controls, queue management, track metadata display, and a clean focused interface — zero external dependencies.
   - *Key challenge*: Managing audio playback state cleanly without a framework. Implemented a minimal state machine for reliable play/pause/next/prev transitions across edge cases.
   - *GitHub*: `https://github.com/yatharth5304/music-webapp`
7. **Quiz Web App**
   - *Technologies*: `JavaScript, HTML5, CSS3`
   - *Problem*: Self-assessment quizzes need instant feedback and a detailed score breakdown to be useful for learning — most implementations are too simple or require a backend.
   - *What I built*: Dynamic quiz application with configurable question sets, per-question countdown timer, randomised answer order, and a detailed results breakdown — fully client-side.
   - *Key challenge*: Randomising question and answer order per session while tracking per-question progress reliably in session storage across page interactions without state corruption.
   - *GitHub*: `https://github.com/yatharth5304/Quiz-Web-App`

#### E. Technical Stack Inventory (Source: `skill` DB table / REST `/api/skills`)
- **Backend (Primary)**: `Java`, `Spring Boot`, `Spring MVC`, `Spring Security`, `Hibernate / JPA`, `REST APIs`
- **Database (Primary)**: `PostgreSQL`, `SQL`, `JDBC`, `Database Design`, `Query Optimization`
- **Frontend**: `React.js`, `JavaScript (ES6+)`, `HTML5`, `CSS3`
- **Tools & DevOps**: `Git`, `GitHub`, `Maven`, `Docker`, `Postman`, `IntelliJ IDEA`
- **Concepts**: `OOP`, `RBAC`, `SOLID`, `MVC`, `Data Structures`, `Algorithms`

#### F. Engineering Principles (Source: `principle` DB table / REST `/api/principles`)
1. **Design before code** *(Icon: file)*: I map the data model and API contract before writing the first line. Rushing to code means more time debugging the wrong solution.
2. **Query performance is not optional** *(Icon: clock)*: I check execution plans, avoid N+1 problems, and add indexes deliberately — not as an afterthought when production slows down.
3. **APIs are contracts, not implementation details** *(Icon: grid)*: Consumers shouldn't need to know how data is stored or processed. The API surface matters more than what's behind it.
4. **Readable code ages better** *(Icon: shield)*: Clever code is a liability. I name things clearly, keep methods small, and leave the codebase in a state I'd want to find it six months later.

---

### 5. Functionality That Must Not Break
- **Contact & External Links**:
  - Email: `mailto:yatharth0503@hotmail.com`
  - LinkedIn: `https://www.linkedin.com/in/yatharthmaharwade/`
  - GitHub: `https://github.com/yatharth5304`
  - Resume: `/resume` (`static/resume/Yatharth_Maharwade_Resume.pdf`)
- **Navigation & Scrolling**: Anchor link smooth scroll (`#about`, `#experience`, `#projects`, `#skills`, `#contact`), reading progress bar, scroll class toggling on navbar (`scrolled` at >40px), section intersection highlighting (`.nav-link.active`).
- **Command Palette Modal (`#cmd-palette`)**: Keybindings `Ctrl+K`, `Cmd+K`, `/`, and `ESC`. Fuzzy search over command list, arrow key navigation, backdrop click dismissal, action executions (`scrollTo`, `window.open`, `mailto`).
- **Interactive Terminal**: Typewriter animation (`typeTerminal()`) with simulated commands and JSON responses.
- **REST API Synchronization**: `Promise.allSettled` fetching from `/api/config`, `/api/stats`, `/api/experiences`, `/api/projects`, `/api/skills`, `/api/principles` with fallback skeleton loaders and error state handlers (`renderUnavailable`).
- **Admin Control Panel (`admin.html`)**: Spring Security Basic Authentication, CSRF token handling (`/api/admin/csrf`, `X-XSRF-TOKEN`), AJAX POST/DELETE calls for managing projects and skills.
- **SEO & Accessibility**:
  - Meta Title: `Yatharth Maharwade — Java Backend Engineer`
  - Meta Description: `Yatharth Maharwade is a Backend Engineer specializing in Java, Spring Boot, and PostgreSQL — building reliable APIs and backend systems.`
  - OpenGraph Tags: `og:title`, `og:description`, `og:type`
  - Google Site Verification: `2qsonrh9rKY4bpdHU2ucRIHXVZ6hP1A18U9qcK9Skp8`
  - ARIA attributes across modal, navigation, timeline, skills, and terminal elements (`role="dialog"`, `role="navigation"`, `aria-modal="true"`, `aria-expanded`, `aria-hidden`, `aria-label`).

---

### 6. Current Design Tokens (For Reference)
- **Color Palette**:
  - Primary Background: `#080B10`
  - Secondary Background: `#0D1117`
  - Elevated Background: `#161C27`
  - Card Background: `#111722`
  - Accent Color: `#6366F1` (Indigo)
  - Semantic Emerald: `#10B981`
  - Primary Text: `#F1F5F9`
  - Secondary Text: `#94A3B8`
  - Muted/Dim Text: `#4B5563`
  - Border: `rgba(255, 255, 255, 0.07)`
  - Border Hover: `rgba(255, 255, 255, 0.14)`
- **Typography**:
  - Display Font: `'Outfit', sans-serif`
  - Body Font: `'Inter', sans-serif`
  - Mono Font: `'JetBrains Mono', monospace`
- **Layout & Spacing**:
  - Section Padding: `96px` (64px on mobile)
  - Container Max Width: `1160px`
- **Breakpoints**:
  - `1000px` (Principles layout stacks to 1 column)
  - `700px` (Contact card collapses to 1 column)
  - `600px` (Mobile menu nav toggle enabled, font sizes and padding scaled down)

---

### 7. Open Questions
1. **Contact Form**: The current website uses direct `mailto:yatharth0503@hotmail.com` links instead of an interactive HTML form POST endpoint. If a full interactive contact form is added during the redesign, a new backend REST controller endpoint (e.g. `/api/contact`) will need to be created.
2. **Live Project Demos**: In the database seed, `liveLink` is currently null for all 7 projects. The UI accounts for this by displaying live links only when `liveLink` is present.

---

## PHASE 2 — GOOGLE STITCH REDESIGN PROMPT

===STITCH PROMPT START===
1. CONTEXT
This is a full-site visual redesign for Yatharth Maharwade's developer portfolio (a Java Backend Engineer specializing in Spring Boot and PostgreSQL). The site serves to showcase Yatharth's backend expertise, career experience, engineering principles, selected project case studies, and technical stack to prospective engineering managers, recruiters, and tech collaborators.

2. SCOPE
Full-site redesign covering all user-facing screens and interfaces:
- Primary Screen (Batch 1): Homepage / Single Page Portfolio (Hero with Interactive Terminal, About Me & Stats, Experience Timeline, Selected Projects, Tech Stack & Tools, Engineering Principles, Contact Card, Footer, and Command Palette Modal).
- Secondary Screen (Batch 2): Admin Panel (`/admin.html` dashboard for managing projects and skills).

3. WHAT TO REDESIGN
Visual design and interactive aesthetic overhaul only:
- Visual layout, visual hierarchy, grid systems, and structural framing.
- Color palette, background depth, surface contrast, subtle glow/glassmorphism accents, and dark theme aesthetics.
- Modern typography pairings, font scales, line heights, and letter spacing.
- Spacing, container padding, margin rhythm, and component borders.
- Imagery, visual elements, project iconography, status indicators, and terminal styling.
- Decorative motion, micro-interactions, hover states, scroll indicators, and entrance transitions.

4. WHAT MUST NOT CHANGE
- Real Content & Copy: Preserve all bio paragraphs, headings, experience entries, project case studies (Problem, What I built, Key challenge), technical skills, principles, and contact details word-for-word.
- Information Architecture: Maintain the exact section order (Hero -> About -> Experience -> Projects -> Stack -> Principles -> Contact -> Footer) and command palette navigation structure.
- Functional Integrations & Links: Keep all links fully functional (`mailto:yatharth0503@hotmail.com`, LinkedIn `https://www.linkedin.com/in/yatharthmaharwade/`, GitHub `https://github.com/yatharth5304`, Resume PDF `/resume`, GitHub project links).
- Interactive Features: Retain the interactive Command Palette (`Ctrl/Cmd+K` / `/`), interactive terminal code/log typer, active navigation section highlighting, and mobile drawer toggle.
- Accessibility & Responsiveness: Maintain ARIA roles (`role="dialog"`, `role="navigation"`, `aria-label`), keyboard navigation, focus indicators, and responsive layouts across Desktop, Tablet, and Mobile.

5. REAL CONTENT TO DESIGN AROUND

[HERO SECTION]
- Status Badge: Available for Backend Engineering roles
- Title Line 1: Building backend systems
- Title Line 2: that hold under pressure.
- Description: I'm Yatharth Maharwade — a Backend Engineer specializing in Java, Spring Boot, and PostgreSQL. I focus on clean API design, solid data layers, and services that perform when it matters.
- Quick Facts: Pune, India · B.Tech CSE · 2025 · Java · Spring Boot · PostgreSQL
- Terminal Commands: `cat about.json` (returns JSON bio) and `git log --oneline -3` (returns commit logs).

[ABOUT SECTION]
- Heading: I care about how software actually works.
- Bio Paragraph 1: B.Tech CSE graduate from Nagpur who spent a year in intensive Java training at QSpiders, contributed to R&D at Bliinc, and now builds backend services at Vintyaa Technologies in Pune. I'm drawn to backend problems — API design, data modeling, query performance, and system reliability.
- Bio Paragraph 2: My approach: understand the problem first, design before coding, and ship something that works — not just something that demos well.
- Stats: "7+" Projects shipped | "4" Roles & internships | "2+" Years on Java | "5" Certifications

[EXPERIENCE SECTION]
1. Software Engineer @ Vintyaa Technologies Pvt Ltd (Pune) | Apr 2026 – Present (Current)
   - Description: Architecting and building backend services using Java and Spring Boot. Designing RESTful APIs, optimizing PostgreSQL queries, and maintaining service reliability in production.
   - Tags: Java, Spring Boot, PostgreSQL, REST APIs
2. Student Intern @ QSpiders Training & Development (Pune) | Feb 2025 – Jan 2026
   - Description: Intensive full-stack Java development training. Covered advanced Java concepts, Spring Framework, Hibernate/JPA, and SQL. Built multiple projects from scratch under mentorship.
   - Tags: Java, Spring Framework, Hibernate / JPA, SQL
3. R&D Intern @ Bliinc (Nagpur) | Dec 2024 – Apr 2025
   - Description: Contributed to R&D initiatives exploring new technology solutions. Implemented proof-of-concept features, conducted feasibility studies, and collaborated on product innovation.
   - Tags: R&D, Prototyping, Product Innovation

[PROJECTS SECTION]
1. Developer Portfolio
   - Tech: Java, Spring Boot, PostgreSQL, Docker, Render
   - Problem: My personal developer portfolio built with a Spring Boot backend served as a REST API and a responsive, premium single-page application frontend — demonstrating real backend architecture rather than a static file.
   - What I built: This site — a Spring Boot REST API + PostgreSQL backend, Flyway-managed schema, admin panel for content management, Docker containerised and deployed on Render with zero-downtime rolling restarts.
   - Key challenge: Free-tier cold starts on Render cause multi-second spin-up delays. Solved with skeleton loaders and background wake-up pings so perceived load feels near-instant to visitors.
2. FoodFinder
   - Tech: Java, Spring Boot, PostgreSQL, REST API
   - Problem: Discovering local food options is fragmented across multiple apps and hard to filter meaningfully. Users need a single, fast interface with geolocation awareness.
   - What I built: Full-stack food discovery platform with smart search, category filters, geolocation-based sorting, and a modern responsive UI — all backed by a Spring Boot REST API and PostgreSQL.
   - Key challenge: Keeping search response time fast despite querying across multiple data dimensions (category, location, keyword) simultaneously without index bloat.
3. OMDB Movie Explorer
   - Tech: Java, Spring Boot, JWT, REST API
   - Problem: No clean, focused interface to search and explore movie data from the OMDB catalog. Existing tools are cluttered or require accounts.
   - What I built: Movie discovery UI with real-time search, detail views, favourites saved per user session with JWT auth, and client-side caching to avoid redundant API calls.
   - Key challenge: Handling OMDB API rate limits gracefully and implementing JWT authentication in a stateless Spring Boot setup without session storage.
   - GitHub: https://github.com/yatharth5304/OMDBMovieExplorer
4. Student Attendance Management System (Featured)
   - Tech: Java, Spring Boot, PostgreSQL, RBAC
   - Problem: Manual attendance tracking is error-prone and gives zero real-time visibility to faculty or administrators. Spreadsheets break down at scale.
   - What I built: Multi-role web application with separate scoped dashboards — Admin sees institution-wide data, Faculty manages only their assigned classes, Students track their own attendance records.
   - Key challenge: Designing the RBAC model cleanly so data-scope enforcement happens at the service layer, not scattered across controllers — ensuring no role can query another role's data.
   - GitHub: https://github.com/yatharth5304/Student-Attendance-Management-System
5. Realtime Face Tracking Gimbal (Featured)
   - Tech: Python, OpenCV, CNN, Embedded C/C++, Hardware
   - Problem: Static cameras lose subjects in dynamic environments. Needed hardware that physically follows a face in real time without manual camera control.
   - What I built: Computer vision pipeline using OpenCV and a CNN that detects faces per frame and drives servo motors via serial commands to keep the subject centred automatically.
   - Key challenge: Decoupling the frame-processing thread from the motor-control thread to eliminate actuation lag caused by blocking I/O — solved with a producer-consumer queue pattern.
6. Music Webapp
   - Tech: JavaScript, HTML5, CSS3, Web Audio API
   - Problem: Wanted a lightweight, dependency-free web music player without streaming platform constraints or heavy framework overhead.
   - What I built: Browser-based music webapp with full playback controls, queue management, track metadata display, and a clean focused interface — zero external dependencies.
   - Key challenge: Managing audio playback state cleanly without a framework. Implemented a minimal state machine for reliable play/pause/next/prev transitions across edge cases.
   - GitHub: https://github.com/yatharth5304/music-webapp
7. Quiz Web App
   - Tech: JavaScript, HTML5, CSS3
   - Problem: Self-assessment quizzes need instant feedback and a detailed score breakdown to be useful for learning — most implementations are too simple or require a backend.
   - What I built: Dynamic quiz application with configurable question sets, per-question countdown timer, randomised answer order, and a detailed results breakdown — fully client-side.
   - Key challenge: Randomising question and answer order per session while tracking per-question progress reliably in session storage across page interactions without state corruption.
   - GitHub: https://github.com/yatharth5304/Quiz-Web-App

[TECH STACK & TOOLS]
- Backend (Primary): Java, Spring Boot, Spring MVC, Spring Security, Hibernate / JPA, REST APIs
- Database (Primary): PostgreSQL, SQL, JDBC, Database Design, Query Optimization
- Frontend: React.js, JavaScript (ES6+), HTML5, CSS3
- Tools & DevOps: Git, GitHub, Maven, Docker, Postman, IntelliJ IDEA
- Concepts: OOP, RBAC, SOLID, MVC, Data Structures, Algorithms

[ENGINEERING PRINCIPLES]
1. Design before code (file icon): I map the data model and API contract before writing the first line. Rushing to code means more time debugging the wrong solution.
2. Query performance is not optional (clock icon): I check execution plans, avoid N+1 problems, and add indexes deliberately — not as an afterthought when production slows down.
3. APIs are contracts, not implementation details (grid icon): Consumers shouldn't need to know how data is stored or processed. The API surface matters more than what's behind it.
4. Readable code ages better (shield icon): Clever code is a liability. I name things clearly, keep methods small, and leave the codebase in a state I'd want to find it six months later.

[CONTACT & FOOTER]
- Heading: Let's talk engineering.
- Description: Open to backend engineering roles, internship opportunities, and interesting technical collaborations. I reply to every message.
- Email: yatharth0503@hotmail.com
- Social Links: LinkedIn (https://www.linkedin.com/in/yatharthmaharwade/), GitHub (https://github.com/yatharth5304), Resume (/resume)
- Footer: © 2026 Yatharth Maharwade · Built with Spring Boot & PostgreSQL · All systems operational

6. DESIGN DIRECTION
Propose 3 distinct visual directions for the homepage first:
- Direction 1: Minimalist & Architectural (Sleek dark mode, crisp typography, subtle borders, high contrast, clean grid layout).
- Direction 2: High-Tech Cyber-Developer (Neumorphic/Glassmorphic glow accents, vibrant accent gradients, code terminal hero focus, dynamic micro-interactions).
- Direction 3: Premium Editorial / Technical Publication (Rich typography scale, deep obsidian slate backgrounds, elegant card framing, refined accent badges).

7. DELIVERABLE
Execute in two stages:
- Stage 1: Present visual mockups/screens for the 3 homepage directions so a direction can be selected.
- Stage 2: Once a direction is chosen, generate the complete screen layouts for the entire site (Homepage + Admin Dashboard) and export clean HTML5, CSS3 (using custom properties), and Vanilla JavaScript compatible with Spring Boot static resources (`src/main/resources/static/`).

8. TECHNICAL CONSTRAINTS
- Stack compatibility: Plain HTML5, Vanilla CSS3 (custom properties/variables), Vanilla JavaScript (ES6+ with Fetch API). No external JS heavy frameworks (must work directly with Spring Boot static file serving).
- Backend REST API Compatibility: JavaScript must connect dynamically to `/api/config`, `/api/stats`, `/api/experiences`, `/api/projects`, `/api/skills`, `/api/principles`.
- Breakpoints: Fluid responsive layout accommodating Mobile (<=600px), Tablet (601px–1000px), and Desktop (>=1001px).
===STITCH PROMPT END===
