-- V15.0 Database Migration - User Ratings System
-- Run this in your Supabase SQL editor

-- 1. Create user_ratings table
CREATE TABLE IF NOT EXISTS user_ratings (
    id BIGSERIAL PRIMARY KEY,
    anime_id BIGINT NOT NULL REFERENCES animes(id) ON DELETE CASCADE,
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
    review TEXT,
    watched_episodes INTEGER DEFAULT 0,
    is_rewatching BOOLEAN DEFAULT false,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(anime_id)
);

-- 2. Add rating columns to animes table
ALTER TABLE animes 
ADD COLUMN IF NOT EXISTS user_rating DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS watched_episodes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_episodes INTEGER;

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_ratings_anime_id ON user_ratings(anime_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_rating ON user_ratings(rating DESC);
CREATE INDEX IF NOT EXISTS idx_animes_user_rating ON animes(user_rating DESC) WHERE user_rating IS NOT NULL;

-- 4. Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_ratings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_ratings_updated_at
    BEFORE UPDATE ON user_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_user_ratings_updated_at();

-- 5. Sync existing data (optional - updates total_episodes from episodes column)
UPDATE animes 
SET total_episodes = episodes 
WHERE total_episodes IS NULL AND episodes IS NOT NULL;

-- Verification queries
-- SELECT COUNT(*) FROM user_ratings;
-- SELECT * FROM animes WHERE user_rating IS NOT NULL LIMIT 5;
