-- Create GIN index for full text search on posts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'posts_fts_idx'
    ) THEN
        CREATE INDEX posts_fts_idx ON posts USING GIN (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,'')));
    END IF;
END$$;
