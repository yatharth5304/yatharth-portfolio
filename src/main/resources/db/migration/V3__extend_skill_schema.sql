-- V3: Extend skill table with is_primary flag.
-- Controls whether a skill chip receives primary visual styling in the portfolio.
-- Defaults to FALSE so existing skill rows are unaffected.

ALTER TABLE skill ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT FALSE;
