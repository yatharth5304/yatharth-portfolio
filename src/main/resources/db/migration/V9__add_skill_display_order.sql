-- V9: Add DB-governed ordering for public skill rendering.
-- A single global display_order controls both category sequence and
-- skill sequence within each category on the public portfolio page.

ALTER TABLE skill ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

UPDATE skill SET display_order = 1  WHERE name = 'Java' AND category = 'Backend';
UPDATE skill SET display_order = 2  WHERE name = 'Spring Boot' AND category = 'Backend';
UPDATE skill SET display_order = 3  WHERE name = 'Spring MVC' AND category = 'Backend';
UPDATE skill SET display_order = 4  WHERE name = 'Spring Security' AND category = 'Backend';
UPDATE skill SET display_order = 5  WHERE name = 'Hibernate / JPA' AND category = 'Backend';
UPDATE skill SET display_order = 6  WHERE name = 'REST APIs' AND category = 'Backend';

UPDATE skill SET display_order = 7  WHERE name = 'PostgreSQL' AND category = 'Database';
UPDATE skill SET display_order = 8  WHERE name = 'SQL' AND category = 'Database';
UPDATE skill SET display_order = 9  WHERE name = 'JDBC' AND category = 'Database';
UPDATE skill SET display_order = 10 WHERE name = 'Database Design' AND category = 'Database';
UPDATE skill SET display_order = 11 WHERE name = 'Query Optimization' AND category = 'Database';

UPDATE skill SET display_order = 12 WHERE name = 'React.js' AND category = 'Frontend';
UPDATE skill SET display_order = 13 WHERE name = 'JavaScript (ES6+)' AND category = 'Frontend';
UPDATE skill SET display_order = 14 WHERE name = 'HTML5' AND category = 'Frontend';
UPDATE skill SET display_order = 15 WHERE name = 'CSS3' AND category = 'Frontend';

UPDATE skill SET display_order = 16 WHERE name = 'Git' AND category = 'Tools & DevOps';
UPDATE skill SET display_order = 17 WHERE name = 'GitHub' AND category = 'Tools & DevOps';
UPDATE skill SET display_order = 18 WHERE name = 'Maven' AND category = 'Tools & DevOps';
UPDATE skill SET display_order = 19 WHERE name = 'Docker' AND category = 'Tools & DevOps';
UPDATE skill SET display_order = 20 WHERE name = 'Postman' AND category = 'Tools & DevOps';
UPDATE skill SET display_order = 21 WHERE name = 'IntelliJ IDEA' AND category = 'Tools & DevOps';

UPDATE skill SET display_order = 22 WHERE name = 'OOP' AND category = 'Concepts';
UPDATE skill SET display_order = 23 WHERE name = 'RBAC' AND category = 'Concepts';
UPDATE skill SET display_order = 24 WHERE name = 'SOLID' AND category = 'Concepts';
UPDATE skill SET display_order = 25 WHERE name = 'MVC' AND category = 'Concepts';
UPDATE skill SET display_order = 26 WHERE name = 'Data Structures' AND category = 'Concepts';
UPDATE skill SET display_order = 27 WHERE name = 'Algorithms' AND category = 'Concepts';
