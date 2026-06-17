-- V7: Create site_config key-value table for singleton textual content.
--
-- GOVERNANCE: This table stores ONLY the following 16 singleton values.
-- It must NOT be used for repeatable content, ordered lists, structured records,
-- typed values (numbers/booleans/dates), or infrastructure config (use env vars for those).
--
-- Allowed keys:
--   full_name, role, email, linkedin_url, github_url,
--   location, education_short, primary_stack,
--   hero_availability_text, hero_title_line1, hero_title_line2, hero_description,
--   about_heading, about_para_1, about_para_2, footer_tech_text

CREATE TABLE IF NOT EXISTS site_config (
    key   VARCHAR(80) PRIMARY KEY,
    value TEXT        NOT NULL
);
