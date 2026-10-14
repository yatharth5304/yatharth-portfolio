// Content verified against the existing portfolio and public APIs on 2026-10-14.
export const config = {
  "developer": {
    "name": "Yatharth",
    "fullName": "Yatharth Maharwade",
    "title": "Java Backend Engineer",
    "description": "I'm Yatharth Maharwade, a Backend Engineer specializing in Java, Spring Boot, and PostgreSQL. I focus on clean API design, solid data layers, and services that perform when it matters."
  },
  "social": {
    "github": "yatharth5304",
    "email": "yatharth0503@hotmail.com",
    "location": "Pune, India"
  },
  "about": {
    "title": "About Me",
    "description": "B.Tech CSE graduate from Nagpur who spent a year in intensive Java training at QSpiders, contributed to R&D at Bliinc, and now builds backend services at Vintyaa Technologies in Pune. I'm drawn to backend problems, API design, data modeling, query performance, and system reliability. My approach: understand the problem first, design before coding, and ship something that works — not just something that demos well."
  },
  "education": "B.Tech CSE · 2025",
  "experiences": [
    {
      "position": "Software Engineer",
      "company": "Vintyaa Technologies Pvt Ltd",
      "period": "Apr 2026 – Present",
      "location": "Pune",
      "description": "Architecting and building backend services using Java and Spring Boot. Designing RESTful APIs, optimizing PostgreSQL queries, and maintaining service reliability in production.",
      "technologies": [
        "Java",
        "Spring Boot",
        "PostgreSQL",
        "REST APIs"
      ]
    },
    {
      "position": "Student Intern",
      "company": "QSpiders Training & Development",
      "period": "Feb 2025 – Jan 2026",
      "location": "Pune",
      "description": "Intensive full-stack Java development training. Covered advanced Java concepts, Spring Framework, Hibernate/JPA, and SQL. Built multiple projects from scratch under mentorship.",
      "technologies": [
        "Java",
        "Spring Framework",
        "Hibernate / JPA",
        "SQL"
      ]
    },
    {
      "position": "R&D Intern",
      "company": "Bliinc",
      "period": "Dec 2024 – Apr 2025",
      "location": "Nagpur",
      "description": "Contributed to R&D initiatives exploring new technology solutions. Implemented proof-of-concept features, conducted feasibility studies, and collaborated on product innovation.",
      "technologies": [
        "R&D",
        "Prototyping",
        "Product Innovation"
      ]
    }
  ],
  "projects": [
    {
      "id": 5,
      "title": "Developer Portfolio",
      "category": "Backend Engineering",
      "technologies": "Java, Spring Boot, REST API, HTML/CSS/JS",
      "image": "/images/developer-portfolio.svg",
      "description": "My personal developer portfolio built with a Spring Boot backend and a responsive, premium single-page application frontend.",
      "link": "/projects/developer-portfolio.html",
      "github": "https://github.com/yatharth5304/portfolio-springboot",
      "live": "https://yatharthm.is-a.dev/",
      "problem": "My personal developer portfolio built with a Spring Boot backend served as a REST API and a responsive, premium single-page application frontend — demonstrating real backend architecture rather than a static file.",
      "highlight": "A Spring Boot REST API + PostgreSQL backend, Flyway-managed schema, admin panel for content management, Docker containerised and deployed on Render with zero-downtime rolling restarts.",
      "challenge": "Free-tier cold starts on Render cause multi-second spin-up delays. Solved with skeleton loaders and background wake-up pings so perceived load feels near-instant to visitors."
    },
    {
      "id": 3,
      "title": "FoodFinder",
      "category": "Backend Engineering",
      "technologies": "Java, Spring Boot, PostgreSQL, JS, Docker",
      "image": "/images/foodfinder.svg",
      "description": "A full-stack restaurant discovery platform featuring smart search, geolocation sorting, and a modern aesthetic.",
      "link": "/projects/foodfinder.html",
      "github": "https://github.com/yatharth5304/FoodFinder",
      "live": "https://yatharth-foodfinder.onrender.com",
      "problem": "Discovering local food options is fragmented across multiple apps and hard to filter meaningfully. Users need a single, fast interface with geolocation awareness.",
      "highlight": "Full-stack food discovery platform with smart search, category filters, geolocation-based sorting, and a modern responsive UI — all backed by a Spring Boot REST API and PostgreSQL.",
      "challenge": "Keeping search response time fast despite querying across multiple data dimensions (category, location, keyword) simultaneously without index bloat."
    },
    {
      "id": 4,
      "title": "OMDB Movie Explorer",
      "category": "Backend Engineering",
      "technologies": "Java, Spring Boot, Supabase, Vanilla JS",
      "image": "/images/omdb-movie-explorer.svg",
      "description": "A Spring Boot and vanilla JavaScript application for searching OMDB movies and saving favorites with caching and JWT auth.",
      "link": "/projects/omdb-movie-explorer.html",
      "github": "https://github.com/yatharth5304/OMDBMovieExplorer",
      "live": "https://omdbmovieexplorer.onrender.com/",
      "problem": "No clean, focused interface to search and explore movie data from the OMDB catalog. Existing tools are cluttered or require accounts.",
      "highlight": "Movie discovery UI with real-time search, detail views, favourites saved per user session with JWT auth, and client-side caching to avoid redundant API calls.",
      "challenge": "Handling OMDB API rate limits gracefully and implementing JWT authentication in a stateless Spring Boot setup without session storage."
    },
    {
      "id": 1,
      "title": "Student Attendance Management System",
      "category": "Backend Engineering",
      "technologies": "Java, Spring Boot, PostgreSQL",
      "image": "/images/student-attendance-management-system.svg",
      "description": "Backend system with role-based access and REST APIs.",
      "link": "/projects/student-attendance-management-system.html",
      "github": "",
      "live": "",
      "problem": "Manual attendance tracking is error-prone and gives zero real-time visibility to faculty or administrators. Spreadsheets break down at scale.",
      "highlight": "Multi-role web application with separate scoped dashboards — Admin sees institution-wide data, Faculty manages only their assigned classes, Students track their own attendance records.",
      "challenge": "Designing the RBAC model cleanly so data-scope enforcement happens at the service layer, not scattered across controllers — ensuring no role can query another role's data."
    },
    {
      "id": 2,
      "title": "Realtime Face Tracking Gimbal",
      "category": "Software Engineering",
      "technologies": "OpenCV, CNN, Java",
      "image": "/images/realtime-face-tracking-gimbal.svg",
      "description": "ML-based face tracking system for live video stabilization.",
      "link": "/projects/realtime-face-tracking-gimbal.html",
      "github": "",
      "live": "",
      "problem": "Static cameras lose subjects in dynamic environments. Needed hardware that physically follows a face in real time without manual camera control.",
      "highlight": "Computer vision pipeline using OpenCV and a CNN that detects faces per frame and drives servo motors via serial commands to keep the subject centred automatically.",
      "challenge": "Decoupling the frame-processing thread from the motor-control thread to eliminate actuation lag caused by blocking I/O — solved with a producer-consumer queue pattern."
    },
    {
      "id": 6,
      "title": "Music Webapp",
      "category": "Software Engineering",
      "technologies": "JavaScript, HTML, CSS",
      "image": "/images/music-webapp.svg",
      "description": "A dynamic web application built for playing, organizing, and managing music collections directly in the browser.",
      "link": "/projects/music-webapp.html",
      "github": "https://github.com/yatharth5304/MusicWebapp",
      "live": "",
      "problem": "Wanted a lightweight, dependency-free web music player without streaming platform constraints or heavy framework overhead.",
      "highlight": "Browser-based music webapp with full playback controls, queue management, track metadata display, and a clean focused interface — zero external dependencies.",
      "challenge": "Managing audio playback state cleanly without a framework. Implemented a minimal state machine for reliable play/pause/next/prev transitions across edge cases."
    },
    {
      "id": 7,
      "title": "Quiz Web App",
      "category": "Software Engineering",
      "technologies": "JavaScript, HTML, CSS",
      "image": "/images/quiz-web-app.svg",
      "description": "An interactive, browser-based quiz application that tracks scores and provides immediate feedback.",
      "link": "/projects/quiz-web-app.html",
      "github": "https://github.com/yatharth5304/QuizzWebApp",
      "live": "",
      "problem": "Self-assessment quizzes need instant feedback and a detailed score breakdown to be useful for learning — most implementations are too simple or require a backend.",
      "highlight": "Dynamic quiz application with configurable question sets, per-question countdown timer, randomised answer order, and a detailed results breakdown — fully client-side.",
      "challenge": "Randomising question and answer order per session while tracking per-question progress reliably in session storage across page interactions without state corruption."
    }
  ],
  "contact": {
    "email": "yatharth0503@hotmail.com",
    "github": "https://github.com/yatharth5304",
    "linkedin": "https://www.linkedin.com/in/yatharthmaharwade/",
    "resume": "/resume"
  },
  "skills": {
    "develop": {
      "title": "JAVA BACKEND",
      "description": "Clean APIs & reliable backend services",
      "details": "Designing REST APIs and backend services with Java, Spring Boot, Spring Security, and Hibernate / JPA.",
      "tools": [
        "Java",
        "Spring Boot",
        "Spring MVC",
        "Spring Security",
        "Hibernate / JPA",
        "REST APIs"
      ]
    },
    "design": {
      "title": "DATA & SYSTEMS",
      "description": "Solid data layers & production reliability",
      "details": "Database design, SQL and query optimization with PostgreSQL. Building and shipping services with Maven, Docker, Git, and Postman.",
      "tools": [
        "PostgreSQL",
        "SQL",
        "JDBC",
        "Database Design",
        "Query Optimization",
        "Git",
        "GitHub",
        "Maven",
        "Docker",
        "Postman",
        "IntelliJ IDEA"
      ]
    }
  },
  "techStack": [
    {
      "category": "Backend",
      "displayOrder": 1,
      "id": 47,
      "name": "Java",
      "primarySkill": true,
      "rating": 5
    },
    {
      "category": "Backend",
      "displayOrder": 2,
      "id": 48,
      "name": "Spring Boot",
      "primarySkill": true,
      "rating": 5
    },
    {
      "category": "Backend",
      "displayOrder": 3,
      "id": 49,
      "name": "Spring MVC",
      "primarySkill": true,
      "rating": 4
    },
    {
      "category": "Backend",
      "displayOrder": 4,
      "id": 50,
      "name": "Spring Security",
      "primarySkill": true,
      "rating": 4
    },
    {
      "category": "Backend",
      "displayOrder": 5,
      "id": 51,
      "name": "Hibernate / JPA",
      "primarySkill": true,
      "rating": 4
    },
    {
      "category": "Backend",
      "displayOrder": 6,
      "id": 52,
      "name": "REST APIs",
      "primarySkill": true,
      "rating": 5
    },
    {
      "category": "Database",
      "displayOrder": 7,
      "id": 53,
      "name": "PostgreSQL",
      "primarySkill": true,
      "rating": 5
    },
    {
      "category": "Database",
      "displayOrder": 8,
      "id": 54,
      "name": "SQL",
      "primarySkill": true,
      "rating": 4
    },
    {
      "category": "Database",
      "displayOrder": 9,
      "id": 55,
      "name": "JDBC",
      "primarySkill": true,
      "rating": 4
    },
    {
      "category": "Database",
      "displayOrder": 10,
      "id": 56,
      "name": "Database Design",
      "primarySkill": true,
      "rating": 4
    },
    {
      "category": "Database",
      "displayOrder": 11,
      "id": 57,
      "name": "Query Optimization",
      "primarySkill": true,
      "rating": 4
    },
    {
      "category": "Frontend",
      "displayOrder": 12,
      "id": 58,
      "name": "React.js",
      "primarySkill": false,
      "rating": 3
    },
    {
      "category": "Frontend",
      "displayOrder": 13,
      "id": 59,
      "name": "JavaScript (ES6+)",
      "primarySkill": false,
      "rating": 4
    },
    {
      "category": "Frontend",
      "displayOrder": 14,
      "id": 60,
      "name": "HTML5",
      "primarySkill": false,
      "rating": 4
    },
    {
      "category": "Frontend",
      "displayOrder": 15,
      "id": 61,
      "name": "CSS3",
      "primarySkill": false,
      "rating": 4
    },
    {
      "category": "Tools & DevOps",
      "displayOrder": 16,
      "id": 62,
      "name": "Git",
      "primarySkill": false,
      "rating": 5
    },
    {
      "category": "Tools & DevOps",
      "displayOrder": 17,
      "id": 63,
      "name": "GitHub",
      "primarySkill": false,
      "rating": 5
    },
    {
      "category": "Tools & DevOps",
      "displayOrder": 18,
      "id": 64,
      "name": "Maven",
      "primarySkill": false,
      "rating": 4
    },
    {
      "category": "Tools & DevOps",
      "displayOrder": 19,
      "id": 65,
      "name": "Docker",
      "primarySkill": false,
      "rating": 4
    },
    {
      "category": "Tools & DevOps",
      "displayOrder": 20,
      "id": 66,
      "name": "Postman",
      "primarySkill": false,
      "rating": 4
    },
    {
      "category": "Tools & DevOps",
      "displayOrder": 21,
      "id": 67,
      "name": "IntelliJ IDEA",
      "primarySkill": false,
      "rating": 5
    },
    {
      "category": "Concepts",
      "displayOrder": 22,
      "id": 68,
      "name": "OOP",
      "primarySkill": false,
      "rating": 5
    },
    {
      "category": "Concepts",
      "displayOrder": 23,
      "id": 69,
      "name": "RBAC",
      "primarySkill": false,
      "rating": 4
    },
    {
      "category": "Concepts",
      "displayOrder": 24,
      "id": 70,
      "name": "SOLID",
      "primarySkill": false,
      "rating": 4
    },
    {
      "category": "Concepts",
      "displayOrder": 25,
      "id": 71,
      "name": "MVC",
      "primarySkill": false,
      "rating": 5
    },
    {
      "category": "Concepts",
      "displayOrder": 26,
      "id": 72,
      "name": "Data Structures",
      "primarySkill": false,
      "rating": 4
    },
    {
      "category": "Concepts",
      "displayOrder": 27,
      "id": 73,
      "name": "Algorithms",
      "primarySkill": false,
      "rating": 4
    }
  ],
  "stats": [
    {
      "displayOrder": 1,
      "id": 1,
      "label": "Projects shipped",
      "value": "7+"
    },
    {
      "displayOrder": 2,
      "id": 2,
      "label": "Roles & internships",
      "value": "4"
    },
    {
      "displayOrder": 3,
      "id": 3,
      "label": "Years on Java",
      "value": "2+"
    },
    {
      "displayOrder": 4,
      "id": 4,
      "label": "Certifications",
      "value": "5"
    }
  ],
  "principles": [
    {
      "description": "I map the data model and API contract before writing the first line. Rushing to code means more time debugging the wrong solution.",
      "displayOrder": 1,
      "iconKey": "file",
      "id": 1,
      "title": "Design before code"
    },
    {
      "description": "I check execution plans, avoid N+1 problems, and add indexes deliberately — not as an afterthought when production slows down.",
      "displayOrder": 2,
      "iconKey": "clock",
      "id": 2,
      "title": "Query performance is not optional"
    },
    {
      "description": "Consumers shouldn't need to know how data is stored or processed. The API surface matters more than what's behind it.",
      "displayOrder": 3,
      "iconKey": "grid",
      "id": 3,
      "title": "APIs are contracts, not implementation details"
    },
    {
      "description": "Clever code is a liability. I name things clearly, keep methods small, and leave the codebase in a state I'd want to find it six months later.",
      "displayOrder": 4,
      "iconKey": "shield",
      "id": 4,
      "title": "Readable code ages better"
    }
  ]
};
