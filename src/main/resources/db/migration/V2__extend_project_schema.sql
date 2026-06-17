-- V2: Extend project table with slug (stable operational identity) and rich case-study fields.
-- All new columns are nullable or have defaults so existing rows and the running application
-- are completely unaffected by this migration.

ALTER TABLE project ADD COLUMN IF NOT EXISTS slug         VARCHAR(160);
ALTER TABLE project ADD COLUMN IF NOT EXISTS problem      TEXT;
ALTER TABLE project ADD COLUMN IF NOT EXISTS highlight    TEXT;
ALTER TABLE project ADD COLUMN IF NOT EXISTS challenge    TEXT;
ALTER TABLE project ADD COLUMN IF NOT EXISTS featured     BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE project ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

-- Add unique constraint on slug after the column exists.
-- IF NOT EXISTS syntax for constraints requires PostgreSQL 9.x+; Render uses a modern version.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'project_slug_unique'
    ) THEN
        ALTER TABLE project ADD CONSTRAINT project_slug_unique UNIQUE (slug);
    END IF;
END $$;
