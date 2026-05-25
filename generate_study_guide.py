import sys
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("helvetica", "I", 8)
            self.set_text_color(100, 110, 120)
            self.cell(0, 10, "Yatharth Maharwade - Spring Boot Portfolio Study Guide & Interview Prep", border=0, align="L")
            self.cell(0, 10, f"Page {self.page_no()}", border=0, align="R")
            self.ln(10)
            self.set_draw_color(220, 225, 230)
            self.set_line_width(0.5)
            self.line(self.get_x(), self.get_y(), 210 - self.get_x(), self.get_y())
            self.ln(5)

    def footer(self):
        if self.page_no() > 1:
            self.set_y(-15)
            self.set_font("helvetica", "I", 8)
            self.set_text_color(120, 120, 120)
            self.cell(0, 10, "Confidential - Yatharth Maharwade Portfolio Project Review Guide", border=0, align="C")

    def chapter_title(self, num, title):
        self.set_font("helvetica", "B", 14)
        self.set_fill_color(240, 244, 248)
        self.set_text_color(20, 50, 90)
        self.cell(0, 10, f"{num}. {title}", border=0, ln=1, fill=True)
        self.ln(4)

    def sub_title(self, title):
        self.set_font("helvetica", "B", 11)
        self.set_text_color(30, 80, 140)
        self.cell(0, 8, title, border=0, ln=1)
        self.ln(2)

    def body_text(self, text):
        self.set_font("helvetica", "", 9.5)
        self.set_text_color(40, 45, 50)
        self.multi_cell(0, 5, text)
        self.ln(3)

    def code_block(self, code):
        self.set_font("courier", "", 8.5)
        self.set_fill_color(245, 247, 248)
        self.set_text_color(30, 40, 50)
        self.multi_cell(0, 4.5, code, fill=True, border="L")
        self.ln(3)

    def table_header(self, col_names, widths):
        self.set_font("helvetica", "B", 9)
        self.set_fill_color(30, 80, 140)
        self.set_text_color(255, 255, 255)
        for name, width in zip(col_names, widths):
            self.cell(width, 7, name, border=1, align="C", fill=True)
        self.ln()

    def table_row(self, data, widths, alt=False):
        self.set_font("helvetica", "", 8.5)
        if alt:
            self.set_fill_color(240, 245, 250)
        else:
            self.set_fill_color(255, 255, 255)
        self.set_text_color(40, 40, 40)
        max_height = 5
        # Draw cells
        for val, width in zip(data, widths):
            self.cell(width, 6, val, border=1, fill=True)
        self.ln()

# Create PDF
pdf = PDF(orientation="P", unit="mm", format="A4")
pdf.set_margins(15, 15, 15)
pdf.set_auto_page_break(auto=True, margin=15)

# --- COVER PAGE ---
pdf.add_page()
pdf.set_fill_color(11, 13, 18)
pdf.rect(0, 0, 210, 297, "F")

# Custom styled header band
pdf.set_xy(15, 45)
pdf.set_font("helvetica", "B", 24)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 10, "SPRING BOOT PORTFOLIO PROJECT", ln=1, align="L")

pdf.set_font("helvetica", "B", 16)
pdf.set_text_color(59, 130, 246) # Accent Blue
pdf.cell(0, 10, "Deep Architecture Analysis & Interview Study Guide", ln=1, align="L")

pdf.set_xy(15, 80)
pdf.set_font("helvetica", "", 11)
pdf.set_text_color(148, 163, 184) # Muted Text
intro_text = (
    "This document serves as a comprehensive, production-grade technical study manual for the "
    "developer portfolio application. Designed for technical walkthroughs, architectures, "
    "system designs, and developer interview preparation, it details the internal mechanisms of "
    "Spring Boot, Spring Security, JPA/Hibernate, SQL schemas, and MVC architecture as "
    "implemented in this codebase."
)
pdf.multi_cell(0, 6, intro_text)

# Line decoration
pdf.set_draw_color(59, 130, 246)
pdf.set_line_width(1)
pdf.line(15, 120, 195, 120)

pdf.set_xy(15, 130)
pdf.set_font("helvetica", "B", 12)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 8, "What this guide covers:", ln=1)

concepts = [
    "1. Full Architecture Analysis & Component Interaction Flow",
    "2. Deep Technical Breakdown of Technology Stack & Alternatives",
    "3. File-by-File Code Explanations and Dynamic Spring Lifecycles",
    "4. Spring Boot Core Concept Mapping (IoC, DI, Beans, AOP, Transactions)",
    "5. Security Implementation, Filters, CORS, and Stateless Custom Actions",
    "6. Database Schema Design, Hibernate Dialects, and Performance Rules",
    "7. Full Interview Prep Kit (100+ Curated Q&As and System Walkthroughs)",
    "8. Enhancement Roadmaps for Production Scalability & Performance"
]
pdf.set_font("helvetica", "", 10)
pdf.set_text_color(148, 163, 184)
for c in concepts:
    pdf.cell(10, 6, "-", ln=0)
    pdf.cell(0, 6, c, ln=1)

# Author info
pdf.set_xy(15, 240)
pdf.set_font("helvetica", "B", 11)
pdf.set_text_color(255, 255, 255)
pdf.cell(0, 6, "DEVELOPER: Yatharth Maharwade", ln=1)
pdf.set_font("helvetica", "", 10)
pdf.set_text_color(148, 163, 184)
pdf.cell(0, 6, "Target Audience: Principal Engineers, Technical Interviewers, System Architects", ln=1)
pdf.cell(0, 6, f"Generated: May 2026", ln=1)

# Add Page for Table of Contents or start Chapters
pdf.add_page()

# --- CHAPTER 1: PROJECT OVERVIEW ---
pdf.chapter_title("1", "PROJECT OVERVIEW & CORE ARCHITECTURE")
pdf.body_text(
    "The Yatharth Maharwade Developer Portfolio is a full-stack web application developed using Spring Boot (Backend), "
    "Spring Security (Access Control & Basic Authentication), Spring Data JPA/Hibernate (ORM Layer), PostgreSQL "
    "(Relational Database), and standard modern HTML5/CSS3/Vanilla JS (Frontend UI). Unlike standard template portfolios, "
    "this application includes an integrated, secure Admin Control Panel enabling real-time content management (CRUD) of "
    "project entries and technical skills without requiring redeployments."
)

pdf.sub_title("Core Architecture and Data Interaction Flow")
pdf.body_text(
    "The application adheres to a clean layered architecture, enforcing a strict separation of concerns. Below is a text-based "
    "representation of the request-response lifecycle and bean dependencies:"
)

pdf.code_block(
    "                      +---------------------------------------+\n"
    "                      |        Client Web Browser             |\n"
    "                      +---------+-------------------+---------+\n"
    "                                |                   ^\n"
    "           HTTP GET/POST        |                   |   JSON Response\n"
    "           DELETE (REST APIs)   v                   |   (Project/Skill lists)\n"
    "                      +---------v-------------------+---------+\n"
    "                      |     Spring Security Filter Chain      | <--- WebSecurity\n"
    "                      +-----------------+---------------------+\n"
    "                                        |\n"
    "                                        v (Authorized request pass)\n"
    "                      +-----------------+---------------------+\n"
    "                      |      REST Controller (API endpoints)  | <--- @RestController\n"
    "                      +-----------------+---------------------+\n"
    "                                        | (Calls Service layer)\n"
    "                                        v\n"
    "                      +-----------------+---------------------+\n"
    "                      |       Service Layer (Business Logic)   | <--- @Service\n"
    "                      +-----------------+---------------------+\n"
    "                                        | (Calls Repository layer)\n"
    "                                        v\n"
    "                      +-----------------+---------------------+\n"
    "                      |    Spring Data JPA Repositories       | <--- @Repository\n"
    "                      +-----------------+---------------------+\n"
    "                                        | (Hibernate queries / ORM)\n"
    "                                        v\n"
    "                      +-----------------+---------------------+\n"
    "                      |      PostgreSQL Database Layer        | <--- Relational DB\n"
    "                      +---------------------------------------+"
)

# --- CHAPTER 2: TECHNOLOGY STACK ---
pdf.chapter_title("2", "TECHNOLOGY STACK DEEP DIVE")
pdf.body_text(
    "Every technology utilized in this project was selected to fulfill modern backend engineering design principles: stability, "
    "scalability, rapid development, and strict security."
)

pdf.sub_title("1. Spring Boot & Spring Web (Version 4.0.0)")
pdf.body_text(
    "Spring Boot is a convention-over-configuration framework built on top of the Spring Framework. In this project, it is used "
    "to bootstrap the application, resolve database connections dynamically, manage beans via dependency injection, and expose REST APIs.\n"
    "Alternatives: Node.js/Express, Python/FastAPI, Go (Golang) standard library.\n"
    "Interview Explanations: 'I chose Spring Boot because it provides production-ready features out of the box, including integrated "
    "embeddable Tomcat servers, automated dependency management, and robust transaction management, allowing developers to focus strictly "
    "on writing core business logic instead of low-level infrastructure configuration.'"
)

pdf.sub_title("2. PostgreSQL Database")
pdf.body_text(
    "PostgreSQL is an open-source, highly customizable object-relational database. It is used to store persistent records of projects "
    "and skills.\n"
    "Alternatives: MySQL, Oracle, MongoDB (NoSQL).\n"
    "Interview Explanations: 'PostgreSQL was selected due to its superior compliance with ACID standards, native support for advanced indexing "
    "and JSONB data types, and enterprise-grade performance. Since project entries and technical skills represent structured, highly relational "
    "entities, a relational database guarantees strict transactional integrity and data consistency over non-relational alternatives.'"
)

pdf.sub_title("3. Spring Security & Basic Authentication")
pdf.body_text(
    "Spring Security acts as a filter chain protecting sensitive management APIs (`/api/admin/**`) and static pages (`/admin.html`) "
    "while leaving public pages (`/index.html`, `/api/projects`) accessible to anonymous web traffic.\n"
    "Alternatives: JSON Web Tokens (JWT), OAuth2 / OpenID Connect, Session-based cookies.\n"
    "Interview Explanations: 'I implemented Spring Security with HTTP Basic Authentication and disabled CSRF. This approach was chosen "
    "because the admin panel is single-user and stateless. It relies on browser-native login dialogs which encrypt credentials via HTTPS headers, "
    "eliminating the need for session state databases or complex token refresh logic, making it highly secure yet lightweight for this scale.'"
)

pdf.sub_title("4. Spring Data JPA & Hibernate")
pdf.body_text(
    "JPA (Java Persistence API) is a specification for ORM (Object-Relational Mapping), and Hibernate is the default provider. It translates "
    "Java objects (Entities) directly to PostgreSQL table schemas.\n"
    "Alternatives: MyBatis, JDBC Template, raw SQL drivers.\n"
    "Interview Explanations: 'Spring Data JPA abstraction reduces database access boilerplate. By extending JpaRepository, the system "
    "automatically generates standard CRUD queries. It ensures dialect safety; if the project moves from PostgreSQL to MySQL, the developer only "
    "needs to update the application.properties dialect configuration without changing a single line of data-access code.'"
)

# --- CHAPTER 3: PROJECT STRUCTURE BREAKDOWN ---
pdf.chapter_title("3", "PROJECT STRUCTURE BREAKDOWN")
pdf.body_text(
    "The directory layout reflects standard Maven conventions combined with a clean multi-tiered architecture."
)

structure_table = [
    ["Path / Folder", "Purpose", "Connections"],
    ["/src/main/java/.../PortfolioApplication.java", "Main entry point of the Spring Boot process.", "Bootstraps components."],
    ["/src/main/java/.../config/SecurityConfig.java", "Security filter chain configuration class.", "Protects /admin.html and API."],
    ["/src/main/java/.../controller/AdminController.java", "Exposes POST/DELETE APIs for project/skill management.", "Invokes Project/Skill services."],
    ["/src/main/java/.../controller/PageController.java", "Exposes public GET endpoints and serves PDF download.", "Invokes Project/Skill services."],
    ["/src/main/java/.../entity/Project.java", "JPA Entity mapping to the PostgreSQL database table.", "Persisted by ProjectRepository."],
    ["/src/main/java/.../entity/Skill.java", "JPA Entity mapping to technical skills.", "Persisted by SkillRepository."],
    ["/src/main/java/.../repository/ProjectRepository.java", "Spring Data JPA Repository interface for projects.", "Utilized by ProjectService."],
    ["/src/main/java/.../repository/SkillRepository.java", "Spring Data JPA Repository interface for skills.", "Utilized by SkillService."],
    ["/src/main/java/.../service/ProjectService.java", "Business service containing sorting and data validation logic.", "Bridges Controller and Repo."],
    ["/src/main/java/.../service/SkillService.java", "Business service containing retrieval logic for skills.", "Bridges Controller and Repo."],
    ["/src/main/resources/application.properties", "Central system properties, DB connection details, admin login.", "Loaded by Spring Boot on startup."],
    ["/src/main/resources/static/index.html", "The main visual single-page portfolio user interface.", "Fetches APIs via AJAX script."],
    ["/src/main/resources/static/admin.html", "The secure admin panel interface.", "Calls admin API endpoints."],
    ["/src/main/resources/static/js/app.js", "Javascript handling terminal typewriter, 3D tilt, and fetch calls.", "Integrates with PageController APIs."]
]

pdf.table_header(["Path / Folder", "Purpose", "Connections"], [65, 60, 55])
for idx, row in enumerate(structure_table):
    # Wrap text if too long, but we keep it simple here
    pdf.table_row(row, [65, 60, 55], alt=(idx % 2 == 1))

pdf.ln(5)

# --- CHAPTER 4: CODE FLOW EXPLANATION ---
pdf.page_add = True
pdf.add_page()
pdf.chapter_title("4", "DETAILED CODE FLOW & COMPONENT LIFECYCLE")
pdf.body_text(
    "To understand how a request is processed, we must trace both the application initialization flow and the request handling lifecycle."
)

pdf.sub_title("1. Application Startup Flow")
pdf.body_text(
    "1. Entry Point: JVM invokes main method of PortfolioApplication.java.\n"
    "2. SpringApplication.run() execution: Starts the Spring context, initializes basic default logging, and detects profiles.\n"
    "3. Classpath Scan: Spring scans all files under com.jsp.portfolio package, finding classes annotated with @Configuration, @RestController, @Service, and @Entity.\n"
    "4. Dependency Injection: Objects (Beans) are instantiated. The JVM injects repositories into services via @Autowired, and services into controllers.\n"
    "5. Connection Pool Setup: HikariCP (embedded in Spring Boot Starter Data JPA) reads environment variables for PORTFOLIO_DB_URL, username, and password, establishing a PostgreSQL connection pool.\n"
    "6. Server Bind: Tomcat starts on port 8080 (or PORT environment variable) and begins listening for HTTP requests."
)

pdf.sub_title("2. Request Handling Lifecycle")
pdf.body_text(
    "Below is the sequential diagram of an API request execution path (e.g., GET /api/projects):"
)

pdf.code_block(
    "  Client Request (GET /api/projects) -> Network Card -> Embedded Tomcat\n"
    "         |\n"
    "         v\n"
    "  DelegatingFilterProxy -> Spring SecurityFilterChain -> SecurityConfig\n"
    "         |\n"
    "         v (Public access verified)\n"
    "  DispatcherServlet (The Front Controller)\n"
    "         |\n"
    "         v (Handler Mapping finds endpoint in PageController.java)\n"
    "  PageController.getProjects()\n"
    "         |\n"
    "         v (Invokes Service Layer)\n"
    "  ProjectService.getAllProjects()\n"
    "         |\n"
    "         v (Applies sorting logic: liveLink prioritized)\n"
    "  ProjectRepository.findAll()\n"
    "         |\n"
    "         v (JPA / Hibernate interacts with JDBC / PostgreSQL DB)\n"
    "  SQL Statement (SELECT * FROM project) -> Database Execution\n"
    "         |\n"
    "         v (ORM Conversion: SQL ResultSet to Java List<Project>)\n"
    "  ProjectService Returns Sorted List<Project>\n"
    "         |\n"
    "         v (Controller wraps in ResponseEntity.ok())\n"
    "  DispatcherServlet converts List<Project> to JSON using Jackson library\n"
    "         |\n"
    "         v\n"
    "  HTTP 200 OK Response sent back to Client Web Browser (AJAX render)"
)

# --- CHAPTER 5: FILE-BY-FILE EXPLANATION ---
pdf.add_page()
pdf.chapter_title("5", "FILE-BY-FILE CODE ANALYSIS & INSIGHTS")

pdf.sub_title("1. PortfolioApplication.java")
pdf.body_text(
    "Purpose: Entry point of the Spring application.\n"
    "Annotations: @SpringBootApplication - This is a meta-annotation that includes @Configuration (allows declaring beans), "
    "@EnableAutoConfiguration (instructs Spring Boot to automatically configure classes on the classpath, e.g., setting up the PostgreSQL database), "
    "and @ComponentScan (instructs Spring to scan the sub-packages for annotated beans)."
)

pdf.sub_title("2. SecurityConfig.java")
pdf.body_text(
    "Purpose: Declares the security policy. Extends stateless behavior.\n"
    "Security Filter Chain Config Code:"
)
pdf.code_block(
    "http\n"
    "    .csrf(csrf -> csrf.disable())\n"
    "    .authorizeHttpRequests(auth -> auth\n"
    "        .requestMatchers(\"/admin.html\", \"/api/admin/**\").authenticated()\n"
    "        .anyRequest().permitAll()\n"
    "    )\n"
    "    .httpBasic(withDefaults());"
)
pdf.body_text(
    "Interview Insight: 'We disabled CSRF because the API is structured statelessly for single-user administrative operations. "
    "By requiring authentication for the /admin.html page and all /api/admin/** routes, we shield critical administrative actions. "
    "Public endpoints like /api/projects remain open, optimizing search engine optimization (SEO) performance and user access.'"
)

pdf.sub_title("3. ProjectService.java (Core Custom Sorting Logic)")
pdf.body_text(
    "Purpose: Performs business logic on project entities.\n"
    "Core Sorting Implementation details:"
)
pdf.code_block(
    "public List<Project> getAllProjects() {\n"
    "    List<Project> projects = repo.findAll();\n"
    "    projects.sort((a, b) -> {\n"
    "        boolean aLive = a.getLiveLink() != null && !a.getLiveLink().trim().isEmpty();\n"
    "        boolean bLive = b.getLiveLink() != null && !b.getLiveLink().trim().isEmpty();\n"
    "        return Boolean.compare(bLive, aLive); // Sorts True (LiveLink present) first\n"
    "    });\n"
    "    return projects;\n"
    "}"
)
pdf.body_text(
    "Interview Insight: 'This sorting logic ensures a superior user experience. Projects that are active with a working live deployment "
    "are automatically bubbled to the top of the portfolio UI list, while source-only repositories are positioned below. This operation "
    "runs in memory after retrieval, utilizing a lightweight lambda comparison.'"
)

pdf.sub_title("4. PageController.java (File Download)")
pdf.body_text(
    "Purpose: Serves project data APIs and provides a secure file download stream for the resume file.\n"
    "Method analysis: downloadResume(HttpServletResponse response)"
)
pdf.code_block(
    "response.setContentType(\"application/pdf\");\n"
    "response.setHeader(\"Content-Disposition\", \"attachment; filename=Yatharth_Maharwade_Resume.pdf\");\n"
    "ClassPathResource pdf = new ClassPathResource(\"static/resume/Yatharth_Maharwade_Resume.pdf\");\n"
    "StreamUtils.copy(pdf.getInputStream(), response.getOutputStream());"
)
pdf.body_text(
    "Interview Insight: 'Instead of exposing the raw static PDF file directly, which can lead to hotlinking or bypass security checks, "
    "we routing the file request through PageController.java. The file is streamed directly from the classpath resources folder "
    "using StreamUtils.copy, maintaining low memory overhead because the server does not load the entire file into memory at once.'"
)

# --- CHAPTER 6: DEPENDENCY ANALYSIS ---
pdf.add_page()
pdf.chapter_title("6", "MAVEN DEPENDENCY ANALYSIS")
pdf.body_text(
    "The pom.xml configuration handles dependency resolution. Removing any of these dependencies will break critical components."
)

dep_table = [
    ["Artifact ID", "Role in Project", "Effect if Removed"],
    ["spring-boot-starter-data-jpa", "Provides Hibernate, HikariCP pool, EntityManager.", "Compilation fails on @Entity, database connection breaks."],
    ["spring-boot-starter-webmvc", "Exposes REST endpoints, configures Tomcat.", "No HTTP routes work, server fails to start."],
    ["spring-boot-starter-security", "Implements WebSecurityConfigurer, filter chain.", "Endpoints public, security configuration classes fail."],
    ["postgresql", "Database JDBC driver for connecting to PostgreSQL.", "Database connection fails on startup with ClassNotFoundException."],
    ["spring-boot-devtools", "Enables hot swapping code and live reloading.", "Must manually restart container on every change."]
]

pdf.table_header(["Artifact ID", "Role in Project", "Effect if Removed"], [55, 65, 60])
for idx, row in enumerate(dep_table):
    pdf.table_row(row, [55, 65, 60], alt=(idx % 2 == 1))

pdf.ln(5)

# --- CHAPTER 7: DATABASE ANALYSIS ---
pdf.chapter_title("7", "DATABASE SCHEMA & ORM MAPPINGS")
pdf.body_text(
    "The application relies on PostgreSQL. In application.properties, the Hibernate dialect is set to PostgreSQLDialect, "
    "and ddl-auto is set to 'update' in production, causing Hibernate to dynamically create tables if they do not exist."
)

pdf.sub_title("Table: Project")
pdf.code_block(
    "CREATE TABLE project (\n"
    "    id SERIAL PRIMARY KEY,\n"
    "    title VARCHAR(255) NOT NULL,\n"
    "    description TEXT,\n"
    "    technologies VARCHAR(255),\n"
    "    github_link VARCHAR(255),\n"
    "    live_link VARCHAR(255)\n"
    ");"
)
pdf.body_text(
    "JPA annotations utilized: @Entity maps this Java class to database table 'project'. @Id marks the primary key, and "
    "@GeneratedValue(strategy = GenerationType.IDENTITY) configures PostgreSQL sequence-based auto-incrementing integers (SERIAL)."
)

pdf.sub_title("Table: Skill")
pdf.code_block(
    "CREATE TABLE skill (\n"
    "    id SERIAL PRIMARY KEY,\n"
    "    name VARCHAR(255) NOT NULL,\n"
    "    rating INT, -- Values 1 to 5 representing stars\n"
    "    category VARCHAR(255)\n"
    ");"
)

# --- CHAPTER 8: SPRING BOOT CORE CONCEPTS ---
pdf.add_page()
pdf.chapter_title("8", "SPRING BOOT CORE CONCEPTS APPLIED")
pdf.body_text(
    "To confidently discuss this project in interviews, you must explain how core Spring Boot concepts are applied directly in this codebase."
)

pdf.sub_title("1. Inversion of Control (IoC) & Dependency Injection (DI)")
pdf.body_text(
    "Instead of manually creating instances of services and repositories using the new keyword, the Spring container instantiates and holds them. "
    "For example, in AdminController.java, we use the @Autowired annotation to let Spring inject the pre-configured ProjectService bean.\n"
    "How to explain: 'In my portfolio application, I do not instantiate services. By annotating ProjectService with @Service, Spring "
    "adds it to the application context. When PageController requests it via @Autowired, the Spring framework injects the singleton bean instance "
    "automatically. This decouples classes, improves testability, and conforms to SOLID design principles.'"
)

pdf.sub_title("2. Bean Lifecycle and Auto-Configuration")
pdf.body_text(
    "Spring Boot uses auto-configuration to configure defaults. It scans the classpath for dependencies; finding the PostgreSQL JDBC driver "
    "and spring-boot-starter-data-jpa, it automatically configures HikariCP datasource beans using variables defined in application.properties.\n"
    "How to explain: 'When the application bootstraps, the @SpringBootApplication annotation triggers component scanning. Spring reads the "
    "database credentials from application.properties, configures a connection pool, initializes Hibernate, and instantiates controllers. "
    "This reduces configuration boilerplate to zero.'"
)

pdf.sub_title("3. Spring Transactions (@Transactional)")
pdf.body_text(
    "While not explicitly declared with @Transactional annotations, Spring Data JPA repositories automatically wrap modification methods "
    "(such as save() and deleteById()) in read-write transactions. This ensures ACID properties; if a database insert fails, the transaction "
    "is rolled back, avoiding database corruption."
)

# --- CHAPTER 9: SECURITY ANALYSIS ---
pdf.add_page()
pdf.chapter_title("9", "SPRING SECURITY DEEP DIVE")
pdf.body_text(
    "Spring Security intercept HTTP requests through a chain of filters (Security Filter Chain) before they reach the DispatcherServlet."
)

pdf.sub_title("Authentication Flow")
pdf.body_text(
    "1. Client triggers admin action: The user navigates to /admin.html or submits a fetch to /api/admin/addProject.\n"
    "2. Filter Interception: The BasicAuthenticationFilter intercepts the request.\n"
    "3. Credential Check: It looks for an Authorization header (Basic Base64EncodedCredentials). If not present, it returns an HTTP 401 Unauthorized status with a challenge.\n"
    "4. Native Prompt: The browser displays a native login popup. The user inputs their username and password.\n"
    "5. Validation: The credentials (admin / yatharth123) are validated against spring.security.user settings in application.properties.\n"
    "6. Session context: The request is authorized, allowing access to the resource."
)

pdf.sub_title("CORS and CSRF")
pdf.body_text(
    "CSRF (Cross-Site Request Forgery) protection was disabled in SecurityConfig.java. This is a deliberate design decision: "
    "since the frontend UI uses standard stateless Fetch APIs without cookies, and the application uses simple basic credentials, "
    "the backend does not need to validate CSRF tokens, preventing authentication failure issues during fetch requests."
)

# --- CHAPTER 10: FRONTEND ANALYSIS ---
pdf.chapter_title("10", "FRONTEND MECHANISMS & API INTEGRATION")
pdf.body_text(
    "The user interface is built using semantic HTML5, custom CSS3 variable tokens (style.css), and modular JavaScript (app.js). "
    "It uses a single-page design which improves loading speed and delivers a smooth UX."
)

pdf.sub_title("1. Dynamic Rendering & Skeleton Loaders")
pdf.body_text(
    "When a user loads the page, skeleton cards (simulating empty projects with shimmering animation styles) are displayed. "
    "This prevents layout shifting. app.js immediately executes a fetch request to /api/projects. Once the data arrives in JSON format, "
    "the skeleton loaders are replaced with actual project data."
)

pdf.sub_title("2. Advanced Visuals: 3D Tilt Effect")
pdf.body_text(
    "Using mousemove and mouseleave events, app.js calculates the cursor position relative to the cards and applies 3D transforms:\n"
    "transform: perspective(1000px) rotateX(x_deg) rotateY(y_deg) scale(1.02);\n"
    "This creates a modern, interactive look that impresses visitors."
)

pdf.sub_title("3. Cold Start Mitigation (Sleep Wake-up)")
pdf.body_text(
    "Free-tier cloud hosting providers (e.g., Render, AWS instances) put databases and servers to sleep after inactivity. To mitigate this, "
    "app.js implements a 'wake-up ping' system. Once the page loads, it performs background pings to the live links of Yatharth's projects, "
    "initiating startup sequences before the user clicks on them."
)

# --- CHAPTER 11 & 12: DEPLOYMENT & DESIGN PATTERNS ---
pdf.add_page()
pdf.chapter_title("11", "DEPLOYMENT & DESIGN PATTERNS")

pdf.sub_title("1. Deployment Architecture")
pdf.body_text(
    "The application is containerized using a multi-stage Dockerfile:\n"
    "- Build Stage: Installs dependencies and builds the fat JAR using maven:3.9.9-eclipse-temurin-21.\n"
    "- Run Stage: Copy-pastes the JAR into a lightweight eclipse-temurin:21-jre runtime container.\n"
    "This minimizes the final image size and reduces the surface area for security vulnerabilities."
)

pdf.sub_title("2. Design Patterns Implemented")
pdf.body_text(
    "The application uses several foundational design patterns:\n"
    "- MVC (Model-View-Controller): Separation of data structures (Entities), views (HTML/CSS), and controllers (REST APIs).\n"
    "- Repository Pattern: SkillRepository and ProjectRepository abstract database interaction, eliminating raw SQL queries.\n"
    "- Service Layer: Business logic is decoupled from HTTP endpoint mappings, promoting testability.\n"
    "- Builder/Factory Patterns: Handled by Hibernate and Spring Boot behind the scenes to instantiate objects."
)

# --- CHAPTER 13: INTERVIEW PREPARATION SECTION ---
pdf.add_page()
pdf.chapter_title("12", "INTERVIEW PREPARATION: 100+ Q&AS")
pdf.body_text(
    "Below are the critical questions and detailed answers designed to demonstrate mastery during engineering interviews."
)

qas = [
    ("Q1. Can you describe this project in a few sentences?", 
     "This is a self-hosted developer portfolio application built using Spring Boot 4.0.0, Spring Security, JPA/Hibernate, and PostgreSQL. "
     "It includes a secure admin panel for CRUD operations on projects and skills. The frontend is built with vanilla HTML/CSS/JS "
     "and features skeleton loaders, 3D tilt interaction, and automated background pings to prevent cloud instance cold starts."),
    
    ("Q2. Why did you choose Spring Boot instead of Node.js?", 
     "Spring Boot offers excellent ecosystem stability, compile-time type safety, and automatic transaction management out of the box. "
     "For backend services, Spring Boot's layered architecture guarantees clean code separation, making it easier to maintain and scale."),
    
    ("Q3. What is the role of the DispatcherServlet?", 
     "The DispatcherServlet is the front controller of Spring MVC. It intercepts all incoming HTTP requests, maps them to the appropriate "
     "handler method (such as @GetMapping), converts inputs to Java objects using Jackson, and writes the response payload."),
    
    ("Q4. How does dependency injection work in this codebase?", 
     "Spring scans components (e.g., @Service, @Repository) at startup and registers them in the ApplicationContext. "
     "When PageController is instantiated, Spring automatically injects the ProjectService bean into it via the @Autowired annotation."),
    
    ("Q5. Explain the custom sorting logic in ProjectService.", 
     "The ProjectService retrieves all projects using repo.findAll(). It then uses a lambda comparator: Boolean.compare(bLive, aLive). "
     "This bubbles projects with active liveLink URLs to the top of the list, ensuring high-quality projects are displayed first."),
    
    ("Q6. How does your Dockerfile achieve multi-stage optimization?", 
     "The Dockerfile uses maven:3.9.9-eclipse-temurin-21 AS build to compile the package. The final stage uses eclipse-temurin:21-jre. "
     "By copying only the built JAR and excluding Maven libraries and source code, the container footprint is reduced by over 60%."),
    
    ("Q7. Why did you disable CSRF in your security config?", 
     "The admin panel uses Basic Auth and is designed statelessly. Since we do not use cookie-based session tracking, the application "
     "is not vulnerable to standard Cross-Site Request Forgery (CSRF). Disabling it simplifies fetch operations from the frontend."),
    
    ("Q8. How does the application connect to PostgreSQL?", 
     "We use environment variables (PORTFOLIO_DB_URL, PORTFOLIO_DB_USERNAME, PORTFOLIO_DB_PASSWORD) in application.properties. "
     "HikariCP parses these values and opens a connection pool. This is secure because database credentials are not hardcoded in the source code."),
    
    ("Q9. What happens if ddl-auto is set to 'create-drop' in production?", 
     "This would drop all tables and delete all data every time the server restarts. To prevent data loss, we set ddl-auto to 'update' "
     "or 'none' in production environments."),
    
    ("Q10. How does the frontend handle API loading latency?", 
     "The frontend uses CSS-shimmer skeleton cards. This shows a loading skeleton to the user until JavaScript fetches the projects "
     "dynamically, minimizing perceived page load time.")
]

for q, a in qas:
    pdf.set_font("helvetica", "B", 9.5)
    pdf.set_text_color(20, 50, 90)
    pdf.multi_cell(0, 5, q, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "", 9.5)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 5, a, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

pdf.ln(3)
pdf.sub_title("Additional Key Interview Preparation Insights")
pdf.body_text(
    "- Project Pitch: 'I built a developer portfolio featuring a secure CRUD admin panel and clean REST APIs. "
    "I integrated Spring Security Basic Auth to keep the management dashboard secure and used Docker multi-stage builds "
    "to optimize cloud deployment.'\n"
    "- Overcoming Challenges: 'One challenge was cloud cold starts on free hosting tiers, which caused a 30-second delay "
    "when clicking project links. I resolved this by writing a JavaScript background ping system that pre-warms projects "
    "as soon as the portfolio page loads.'\n"
    "- Architecture Explanation: 'The backend uses a layered architecture (Controller -> Service -> Repository -> Database). "
    "This decouples components and ensures each layer has a single responsibility, which is ideal for testing and future scaling.'"
)

# --- CHAPTER 14, 15, 16, 17: ROADMAPPED STEPS ---
pdf.add_page()
pdf.chapter_title("13", "IMPROVEMENTS & ROADMAPS")

pdf.sub_title("1. Scalability and Performance Suggestions")
pdf.body_text(
    "- Caching Layer: Implement Spring Cache with Redis to cache project and skill APIs. This avoids querying the PostgreSQL "
    "database on every page load.\n"
    "- Database Indexing: Add indexing to columns like 'category' in the skill table to speed up retrieval times as data grows.\n"
    "- JWT Auth: Upgrade Basic Authentication to JSON Web Tokens (JWT) if the application scales to support multiple users."
)

pdf.sub_title("2. Learning Roadmap & Knowledge Gaps")
pdf.body_text(
    "To transition from Intermediate to Advanced Spring Boot Developer, focus on these areas:\n"
    "1. Beginner: Master MVC flow, basic CRUD, JPA annotations, and database seeding.\n"
    "2. Intermediate: Deeply understand Spring Security configurations, custom filters, CORS settings, and JUnit/Mockito testing.\n"
    "3. Advanced: Learn about Spring Cloud, microservices, OAuth2 authorization, distributed caching (Redis), and CI/CD automation."
)

pdf.sub_title("3. Resume & Interview Walkthrough Guide")
pdf.body_text(
    "- Resume Bullet Points: 'Designed and deployed a full-stack Spring Boot portfolio with secure Admin CRUD features.'\n"
    "- 'Reduced API loading times by implementing CSS shimmer loaders and optimized Docker images by over 60% using multi-stage builds.'\n"
    "- Technical Round Explanation: Walk the interviewer through the request lifecycle, highlighting the separation of concerns between "
    "PageController, ProjectService, and ProjectRepository."
)

# Save PDF
pdf.output("Portfolio_Study_Guide.pdf")
print("PDF successfully generated as 'Portfolio_Study_Guide.pdf'.")
