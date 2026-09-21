-- V10: Fix schema drift between JPA entities and applied migrations.
-- The entities expect: site_config(config_key, config_value) and stat(stat_value)
-- But V6/V7 created: site_config(key, value) and stat(value)
-- This migration renames columns to match entity mappings.
-- Idempotent: uses IF EXISTS checks so it can run on already-fixed DBs.

-- ─── PART 1: Fix site_config columns ────────────────────────────────────────────
-- Rename 'key' -> 'config_key' and 'value' -> 'config_value'
-- Only run if old column names exist.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'site_config' AND column_name = 'key'
    ) THEN
        ALTER TABLE site_config RENAME COLUMN "key" TO config_key;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'site_config' AND column_name = 'value'
    ) THEN
        ALTER TABLE site_config RENAME COLUMN value TO config_value;
    END IF;
END $$;

-- Ensure config_value uses TEXT type (matching entity columnDefinition)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'site_config' AND column_name = 'config_value'
          AND data_type <> 'text'
    ) THEN
        ALTER TABLE site_config ALTER COLUMN config_value TYPE TEXT;
    END IF;
END $$;

-- ─── PART 2: Fix stat columns ───────────────────────────────────────────────────
-- Rename 'value' -> 'stat_value'
-- Only run if old column name exists.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'stat' AND column_name = 'value'
    ) THEN
        ALTER TABLE stat RENAME COLUMN value TO stat_value;
    END IF;
END $$;

-- Ensure stat_value uses VARCHAR(20) type (matching original V6)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'stat' AND column_name = 'stat_value'
          AND data_type <> 'character varying'
    ) THEN
        ALTER TABLE stat ALTER COLUMN stat_value TYPE VARCHAR(20);
    END IF;
END $$;

-- ─── PART 3: Validation ─────────────────────────────────────────────────────────
-- Verify the final schema matches entity expectations.
DO $$
DECLARE
    missing_columns TEXT := '';
BEGIN
    -- Check site_config
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'site_config' AND column_name = 'config_key'
    ) THEN
        missing_columns := missing_columns || 'site_config.config_key, ';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'site_config' AND column_name = 'config_value'
    ) THEN
        missing_columns := missing_columns || 'site_config.config_value, ';
    END IF;
    -- Check stat
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'stat' AND column_name = 'stat_value'
    ) THEN
        missing_columns := missing_columns || 'stat.stat_value, ';
    END IF;

    IF missing_columns <> '' THEN
        RAISE EXCEPTION
            'V10 validation failed: missing expected columns: %'
            'Check that renames succeeded.',
            rtrim(missing_columns, ', ');
    END IF;
END $$;