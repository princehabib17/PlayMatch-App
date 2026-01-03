-- Seed data for PlayMatch app
-- Provides sample data for testing and development

-- Insert sample users
INSERT INTO users (name, email, avatar_url, rating, games_played) VALUES
  ('John Doe', 'john@example.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 4.5, 45),
  ('Jane Smith', 'jane@example.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 4.2, 32),
  ('Mike Johnson', 'mike@example.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 3.8, 28),
  ('Sarah Williams', 'sarah@example.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 4.7, 51),
  ('David Brown', 'david@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 3.5, 19);

-- Insert sample venues
INSERT INTO venues (name, location, image_url, description, latitude, longitude) VALUES
  ('Metro Basketball Court', 'Makati City Sports Complex, Makati', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', 'Premium outdoor basketball court with professional-grade flooring and lighting', 14.5547, 121.0244),
  ('Powerhouse Gym Arena', 'BGC, Taguig City', 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=800', 'Indoor air-conditioned basketball court with spectator seating', 14.5528, 121.0473),
  ('Sunset Park Courts', 'Quezon City Memorial Circle', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800', 'Multiple outdoor courts in a beautiful park setting', 14.6542, 121.0497),
  ('Elite Sports Hub', 'Ortigas Center, Pasig', 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800', 'State-of-the-art indoor facility with modern amenities', 14.5832, 121.0611),
  ('Street Court Manila', 'Malate, Manila', 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800', 'Authentic street basketball experience with urban vibes', 14.5719, 120.9935);

-- Insert sample games (using user ID 1 as organizer)
INSERT INTO games (title, venue_id, organizer_id, datetime_start, duration_minutes, fee_per_player, max_players, skill_level, game_type, description, status) VALUES
  ('Friday Night Hoops', 1, 1, CURRENT_TIMESTAMP + INTERVAL '2 days', 90, 150.00, 10, 'Intermediate', 'Competitive', 'Competitive 5v5 game, bring your A-game!', 'open'),
  ('Weekend Pickup Game', 2, 2, CURRENT_TIMESTAMP + INTERVAL '3 days', 120, 200.00, 12, 'Advanced', 'Tournament', 'High-level tournament style game', 'open'),
  ('Sunday Fun Run', 3, 1, CURRENT_TIMESTAMP + INTERVAL '5 days', 90, 100.00, 10, 'Beginner', 'Casual', 'Casual game for beginners and intermediates', 'open'),
  ('Midweek Madness', 4, 3, CURRENT_TIMESTAMP + INTERVAL '1 day', 60, 250.00, 8, 'Advanced', 'Competitive', 'Intense 4v4 half-court action', 'open'),
  ('Morning Basketball', 5, 4, CURRENT_TIMESTAMP + INTERVAL '1 day', 90, 120.00, 10, 'Intermediate', 'Casual', 'Early morning pickup game', 'open'),
  ('Saturday Showdown', 1, 2, CURRENT_TIMESTAMP + INTERVAL '4 days', 120, 180.00, 12, 'Advanced', 'Tournament', 'Competitive tournament with prizes', 'open'),
  ('After Work Hoops', 2, 5, CURRENT_TIMESTAMP + INTERVAL '6 hours', 90, 150.00, 10, 'Intermediate', 'Casual', 'Perfect for after-work relaxation', 'open');

-- Insert some sample participants to make games look active
INSERT INTO game_participants (game_id, user_id, team, position, payment_status) VALUES
  (1, 2, 'A', 'Forward', 'paid'),
  (1, 3, 'A', 'Guard', 'paid'),
  (1, 4, 'B', 'Center', 'paid'),
  (1, 5, 'B', 'Guard', 'pending'),
  (2, 3, 'A', 'Guard', 'paid'),
  (2, 5, 'A', 'Forward', 'paid'),
  (3, 2, NULL, NULL, 'pending'),
  (3, 4, NULL, NULL, 'pending'),
  (4, 1, 'A', 'Guard', 'paid'),
  (4, 2, 'B', 'Forward', 'paid'),
  (5, 3, 'A', 'Center', 'paid');

-- Update games_played count for users
UPDATE users SET games_played = (
  SELECT COUNT(*) FROM game_participants WHERE user_id = users.id
);
