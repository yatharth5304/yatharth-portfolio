-- V8: Seed all hardcoded portfolio content into the database.
-- This is the zero-data-loss migration. Hardcoded frontend constants are NOT removed
-- until this migration passes Gate 1 validation (all field completeness checks).
--
-- EXECUTION ORDER (must not be changed):
--   Part 1  — Seed slugs onto existing project rows (by title — the ONLY title lookup in codebase)
--   Part 1V — Validate: fail the migration if any project has a null slug
--   Part 2  — Enrich project rows using slug (never title again)
--   Part 2V — Validate: fail the migration if any project is missing case-study fields
--   Part 3  — Insert skills (idempotent: skips rows that already exist by name+category)
--   Part 4  — Insert experience entries
--   Part 5  — Insert principle cards
--   Part 6  — Insert stat cards
--   Part 7  — Insert site_config key-value pairs (idempotent: skips existing keys)


-- ─── PART 1: SEED SLUGS ───────────────────────────────────────────────────────
-- One-time title lookup. After this block, all references use slug exclusively.
-- Titles confirmed against live DB on 2026-06-17.

UPDATE project SET slug = 'developer-portfolio'                   WHERE title = 'Developer Portfolio';
UPDATE project SET slug = 'foodfinder'                            WHERE title = 'FoodFinder';
UPDATE project SET slug = 'omdb-movie-explorer'                   WHERE title = 'OMDB Movie Explorer';
UPDATE project SET slug = 'student-attendance-management-system'  WHERE title = 'Student Attendance Management System';
UPDATE project SET slug = 'realtime-face-tracking-gimbal'         WHERE title = 'Realtime Face Tracking Gimbal';
UPDATE project SET slug = 'music-webapp'                          WHERE title = 'Music Webapp';
UPDATE project SET slug = 'quiz-web-app'                          WHERE title = 'Quiz Web App';


-- ─── PART 1V: VALIDATE SLUG COVERAGE ─────────────────────────────────────────
-- Halts the entire migration if any project has a null slug.
-- A null slug here means a title mismatch — fix the UPDATE above, do not proceed.

DO $$
DECLARE null_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO null_count FROM project WHERE slug IS NULL;
    IF null_count > 0 THEN
        RAISE EXCEPTION
            'V8 aborted: % project row(s) still have null slug after Part 1. '
            'Check that all 7 title strings match exactly. '
            'Do not proceed until all slugs are set.',
            null_count;
    END IF;
END $$;


-- ─── PART 2: ENRICH PROJECTS BY SLUG ─────────────────────────────────────────
-- display_order follows the current live API ordering (projects with live links first)
-- as documented in Gate 0. This preserves the existing visual sequence exactly.
--
-- featured=TRUE is set on the two projects highlighted as case-study showcases
-- even though they lack live links — that is intentional per the original PROJECT_DETAILS.

UPDATE project SET
    problem       = 'My personal developer portfolio built with a Spring Boot backend served as a REST API and a responsive, premium single-page application frontend — demonstrating real backend architecture rather than a static file.',
    highlight     = 'This site — a Spring Boot REST API + PostgreSQL backend, Flyway-managed schema, admin panel for content management, Docker containerised and deployed on Render with zero-downtime rolling restarts.',
    challenge     = 'Free-tier cold starts on Render cause multi-second spin-up delays. Solved with skeleton loaders and background wake-up pings so perceived load feels near-instant to visitors.',
    featured      = FALSE,
    display_order = 1
WHERE slug = 'developer-portfolio';

UPDATE project SET
    problem       = 'Discovering local food options is fragmented across multiple apps and hard to filter meaningfully. Users need a single, fast interface with geolocation awareness.',
    highlight     = 'Full-stack food discovery platform with smart search, category filters, geolocation-based sorting, and a modern responsive UI — all backed by a Spring Boot REST API and PostgreSQL.',
    challenge     = 'Keeping search response time fast despite querying across multiple data dimensions (category, location, keyword) simultaneously without index bloat.',
    featured      = FALSE,
    display_order = 2
WHERE slug = 'foodfinder';

UPDATE project SET
    problem       = 'No clean, focused interface to search and explore movie data from the OMDB catalog. Existing tools are cluttered or require accounts.',
    highlight     = 'Movie discovery UI with real-time search, detail views, favourites saved per user session with JWT auth, and client-side caching to avoid redundant API calls.',
    challenge     = 'Handling OMDB API rate limits gracefully and implementing JWT authentication in a stateless Spring Boot setup without session storage.',
    featured      = FALSE,
    display_order = 3
WHERE slug = 'omdb-movie-explorer';

UPDATE project SET
    problem       = 'Manual attendance tracking is error-prone and gives zero real-time visibility to faculty or administrators. Spreadsheets break down at scale.',
    highlight     = 'Multi-role web application with separate scoped dashboards — Admin sees institution-wide data, Faculty manages only their assigned classes, Students track their own attendance records.',
    challenge     = 'Designing the RBAC model cleanly so data-scope enforcement happens at the service layer, not scattered across controllers — ensuring no role can query another role''s data.',
    featured      = TRUE,
    display_order = 4
WHERE slug = 'student-attendance-management-system';

UPDATE project SET
    problem       = 'Static cameras lose subjects in dynamic environments. Needed hardware that physically follows a face in real time without manual camera control.',
    highlight     = 'Computer vision pipeline using OpenCV and a CNN that detects faces per frame and drives servo motors via serial commands to keep the subject centred automatically.',
    challenge     = 'Decoupling the frame-processing thread from the motor-control thread to eliminate actuation lag caused by blocking I/O — solved with a producer-consumer queue pattern.',
    featured      = TRUE,
    display_order = 5
WHERE slug = 'realtime-face-tracking-gimbal';

UPDATE project SET
    problem       = 'Wanted a lightweight, dependency-free web music player without streaming platform constraints or heavy framework overhead.',
    highlight     = 'Browser-based music webapp with full playback controls, queue management, track metadata display, and a clean focused interface — zero external dependencies.',
    challenge     = 'Managing audio playback state cleanly without a framework. Implemented a minimal state machine for reliable play/pause/next/prev transitions across edge cases.',
    featured      = FALSE,
    display_order = 6
WHERE slug = 'music-webapp';

UPDATE project SET
    problem       = 'Self-assessment quizzes need instant feedback and a detailed score breakdown to be useful for learning — most implementations are too simple or require a backend.',
    highlight     = 'Dynamic quiz application with configurable question sets, per-question countdown timer, randomised answer order, and a detailed results breakdown — fully client-side.',
    challenge     = 'Randomising question and answer order per session while tracking per-question progress reliably in session storage across page interactions without state corruption.',
    featured      = FALSE,
    display_order = 7
WHERE slug = 'quiz-web-app';


-- ─── PART 2V: VALIDATE ENRICHMENT COMPLETENESS ───────────────────────────────

DO $$
DECLARE incomplete_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO incomplete_count
    FROM project
    WHERE problem IS NULL OR highlight IS NULL OR challenge IS NULL;

    IF incomplete_count > 0 THEN
        RAISE EXCEPTION
            'V8 aborted: % project row(s) are missing case-study fields after Part 2. '
            'Check slug values match the slugs set in Part 1.',
            incomplete_count;
    END IF;
END $$;


-- ─── PART 3: SEED SKILLS ─────────────────────────────────────────────────────
-- Uses WHERE NOT EXISTS to skip any skill that already exists by (name, category).
-- Safe to re-run. Does not overwrite existing rating values.
-- is_primary reflects the category-level primary designation from SKILLS_DATA.
-- Tags governance: skills are not queryable business data via the tags field.

-- Backend (is_primary = TRUE)
INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Java', 5, 'Backend', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Java' AND category = 'Backend');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Spring Boot', 5, 'Backend', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Spring Boot' AND category = 'Backend');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Spring MVC', 4, 'Backend', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Spring MVC' AND category = 'Backend');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Spring Security', 4, 'Backend', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Spring Security' AND category = 'Backend');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Hibernate / JPA', 4, 'Backend', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Hibernate / JPA' AND category = 'Backend');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'REST APIs', 5, 'Backend', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'REST APIs' AND category = 'Backend');

-- Database (is_primary = TRUE)
INSERT INTO skill (name, rating, category, is_primary)
SELECT 'PostgreSQL', 5, 'Database', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'PostgreSQL' AND category = 'Database');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'SQL', 4, 'Database', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'SQL' AND category = 'Database');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'JDBC', 4, 'Database', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'JDBC' AND category = 'Database');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Database Design', 4, 'Database', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Database Design' AND category = 'Database');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Query Optimization', 4, 'Database', TRUE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Query Optimization' AND category = 'Database');

-- Frontend (is_primary = FALSE)
INSERT INTO skill (name, rating, category, is_primary)
SELECT 'React.js', 3, 'Frontend', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'React.js' AND category = 'Frontend');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'JavaScript (ES6+)', 4, 'Frontend', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'JavaScript (ES6+)' AND category = 'Frontend');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'HTML5', 4, 'Frontend', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'HTML5' AND category = 'Frontend');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'CSS3', 4, 'Frontend', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'CSS3' AND category = 'Frontend');

-- Tools & DevOps (is_primary = FALSE)
INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Git', 5, 'Tools & DevOps', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Git' AND category = 'Tools & DevOps');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'GitHub', 5, 'Tools & DevOps', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'GitHub' AND category = 'Tools & DevOps');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Maven', 4, 'Tools & DevOps', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Maven' AND category = 'Tools & DevOps');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Docker', 4, 'Tools & DevOps', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Docker' AND category = 'Tools & DevOps');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Postman', 4, 'Tools & DevOps', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Postman' AND category = 'Tools & DevOps');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'IntelliJ IDEA', 5, 'Tools & DevOps', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'IntelliJ IDEA' AND category = 'Tools & DevOps');

-- Concepts (is_primary = FALSE)
INSERT INTO skill (name, rating, category, is_primary)
SELECT 'OOP', 5, 'Concepts', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'OOP' AND category = 'Concepts');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'RBAC', 4, 'Concepts', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'RBAC' AND category = 'Concepts');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'SOLID', 4, 'Concepts', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'SOLID' AND category = 'Concepts');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'MVC', 5, 'Concepts', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'MVC' AND category = 'Concepts');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Data Structures', 4, 'Concepts', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Data Structures' AND category = 'Concepts');

INSERT INTO skill (name, rating, category, is_primary)
SELECT 'Algorithms', 4, 'Concepts', FALSE
WHERE NOT EXISTS (SELECT 1 FROM skill WHERE name = 'Algorithms' AND category = 'Concepts');


-- ─── PART 4: SEED EXPERIENCE ─────────────────────────────────────────────────
-- Structured dates with display_label override for exact UI text.
-- CHECK constraint (experience_date_check) enforces: current=TRUE → end_date IS NULL.
-- Tags: DISPLAY-ONLY comma-separated strings. Not queryable business data.

INSERT INTO experience (role, company, location, start_date, end_date, is_current, display_label, description, tags, display_order)
VALUES
    (
        'Software Engineer',
        'Vintyaa Technologies Pvt Ltd',
        'Pune',
        '2026-04-01',
        NULL,
        TRUE,
        'Apr 2026 – Present',
        'Architecting and building backend services using Java and Spring Boot. Designing RESTful APIs, optimizing PostgreSQL queries, and maintaining service reliability in production.',
        'Java, Spring Boot, PostgreSQL, REST APIs',
        1
    ),
    (
        'Student Intern',
        'QSpiders Training & Development',
        'Pune',
        '2025-02-01',
        '2026-01-31',
        FALSE,
        'Feb 2025 – Jan 2026',
        'Intensive full-stack Java development training. Covered advanced Java concepts, Spring Framework, Hibernate/JPA, and SQL. Built multiple projects from scratch under mentorship.',
        'Java, Spring Framework, Hibernate / JPA, SQL',
        2
    ),
    (
        'R&D Intern',
        'Bliinc',
        'Nagpur',
        '2024-12-01',
        '2025-04-30',
        FALSE,
        'Dec 2024 – Apr 2025',
        'Contributed to R&D initiatives exploring new technology solutions. Implemented proof-of-concept features, conducted feasibility studies, and collaborated on product innovation.',
        'R&D, Prototyping, Product Innovation',
        3
    );


-- ─── PART 5: SEED ENGINEERING PRINCIPLES ─────────────────────────────────────
-- icon_key maps to frontend PRINCIPLE_ICONS lookup object.
-- Valid values: file, clock, grid, shield.

INSERT INTO principle (title, description, icon_key, display_order)
VALUES
    (
        'Design before code',
        'I map the data model and API contract before writing the first line. Rushing to code means more time debugging the wrong solution.',
        'file',
        1
    ),
    (
        'Query performance is not optional',
        'I check execution plans, avoid N+1 problems, and add indexes deliberately — not as an afterthought when production slows down.',
        'clock',
        2
    ),
    (
        'APIs are contracts, not implementation details',
        'Consumers shouldn''t need to know how data is stored or processed. The API surface matters more than what''s behind it.',
        'grid',
        3
    ),
    (
        'Readable code ages better',
        'Clever code is a liability. I name things clearly, keep methods small, and leave the codebase in a state I''d want to find it six months later.',
        'shield',
        4
    );


-- ─── PART 6: SEED ABOUT STATS ────────────────────────────────────────────────

INSERT INTO stat (value, label, display_order)
VALUES
    ('7+', 'Projects shipped',    1),
    ('4',  'Roles & internships', 2),
    ('2+', 'Years on Java',       3),
    ('5',  'Certifications',      4);


-- ─── PART 7: SEED SITE CONFIG ─────────────────────────────────────────────────
-- ON CONFLICT DO NOTHING makes this block safe to re-run.
-- Only the 16 governed keys from the allowlist are inserted here.
-- Do not add keys outside this list without a schema discussion and code deploy.

INSERT INTO site_config (key, value) VALUES
    ('full_name',             'Yatharth Maharwade')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('role',                  'Backend Engineer')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('email',                 'yatharth0503@hotmail.com')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('linkedin_url',          'https://www.linkedin.com/in/yatharthmaharwade/')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('github_url',            'https://github.com/yatharth5304')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('location',              'Pune, India')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('education_short',       'B.Tech CSE · 2025')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('primary_stack',         'Java · Spring Boot · PostgreSQL')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('hero_availability_text','Available for Backend Engineering roles')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('hero_title_line1',      'Building backend systems')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('hero_title_line2',      'that hold under pressure.')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('hero_description',      'I''m Yatharth Maharwade — a Backend Engineer specializing in Java, Spring Boot, and PostgreSQL. I focus on clean API design, solid data layers, and services that perform when it matters.')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('about_heading',         'I care about how software actually works.')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('about_para_1',          'B.Tech CSE graduate from Nagpur who spent a year in intensive Java training at QSpiders, contributed to R&D at Bliinc, and now builds backend services at Vintyaa Technologies in Pune. I''m drawn to backend problems — API design, data modeling, query performance, and system reliability.')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('about_para_2',          'My approach: understand the problem first, design before coding, and ship something that works — not just something that demos well.')
    ON CONFLICT (key) DO NOTHING;

INSERT INTO site_config (key, value) VALUES
    ('footer_tech_text',      'Built with Spring Boot & PostgreSQL')
    ON CONFLICT (key) DO NOTHING;
