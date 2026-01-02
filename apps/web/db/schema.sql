-- PlayMatch Database Schema
-- PostgreSQL database for the PlayMatch sports game matching app

-- Drop existing tables if they exist (for fresh install)
DROP TABLE IF EXISTS game_participants CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Venues table
CREATE TABLE venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  venue_id INTEGER REFERENCES venues(id) ON DELETE SET NULL,
  organizer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  datetime_start TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 90,
  fee_per_player DECIMAL(10, 2) DEFAULT 0.00,
  max_players INTEGER NOT NULL DEFAULT 10,
  skill_level VARCHAR(50) DEFAULT 'Beginner',
  game_type VARCHAR(50) DEFAULT 'Casual',
  description TEXT,
  rules TEXT,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_status CHECK (status IN ('open', 'full', 'in_progress', 'completed', 'cancelled')),
  CONSTRAINT valid_skill_level CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
  CONSTRAINT positive_max_players CHECK (max_players > 0),
  CONSTRAINT positive_fee CHECK (fee_per_player >= 0)
);

-- Game participants table
CREATE TABLE game_participants (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  team VARCHAR(1),
  position VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_user_per_game UNIQUE (game_id, user_id),
  CONSTRAINT valid_team CHECK (team IN ('A', 'B') OR team IS NULL),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'refunded'))
);

-- Indexes for performance
CREATE INDEX idx_games_datetime ON games(datetime_start);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_venue ON games(venue_id);
CREATE INDEX idx_games_organizer ON games(organizer_id);
CREATE INDEX idx_participants_game ON game_participants(game_id);
CREATE INDEX idx_participants_user ON game_participants(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
