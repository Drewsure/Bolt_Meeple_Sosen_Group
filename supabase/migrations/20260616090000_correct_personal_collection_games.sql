/*
  Correct personal collection catalogue entries.

  - Removes games that are not in the user's collection.
  - Normalizes Japanese edition display names to English.
  - Adds manual local entries for Azul and Roller Coaster Challenge.
*/

DELETE FROM games
WHERE bgg_id IN (2961, 164847)
   OR title IN ('Confusion: Espionage and Deception in the Cold War', 'Clover');

UPDATE games
SET
  title = 'Agricola: All Creatures Big and Small - The Big Box',
  original_name = 'Agricola: All Creatures Big and Small - The Big Box',
  description = 'Agricola: All Creatures Big and Small - The Big Box is a two-player farming game about expanding pastures, building farm spaces, and raising animals through tight worker-placement choices.',
  updated_at = now()
WHERE bgg_id = 255262
   OR title = 'アグリコラ：牧場の動物たち THE BIG BOX';

UPDATE games
SET
  title = 'Clover Bouquet',
  original_name = 'Clover Bouquet',
  description = 'Clover Bouquet is a light two-player Japanese card game with a gentle flower theme, useful for quick table talk around choosing, matching, and timing.',
  updated_at = now()
WHERE bgg_id = 336718
   OR title = 'クローバーブーケ (Clover Bouquet)';

UPDATE games
SET
  title = 'Hey, That''s My Fish!',
  original_name = 'Hey, That''s My Fish!',
  description = 'Hey, That''s My Fish! is a quick penguin movement game about claiming fish tiles while the ice floes disappear, creating simple English around routes, blocking, and counting.',
  updated_at = now()
WHERE bgg_id = 8203
   OR title = 'それはオレの魚だ！';

UPDATE games
SET
  title = 'Framework',
  original_name = 'Framework',
  description = 'Framework is a calm tile-laying puzzle game about matching colors, completing task frames, and building a shared-looking pattern with quiet tactical choices.',
  updated_at = now()
WHERE bgg_id = 353152
   OR title = 'フレームワーク';

UPDATE games
SET
  cover_image_url = '/images/collection/230802.jpg',
  description = 'Azul Mini is the portable version of Azul, an abstract tile-drafting game about choosing colorful Portuguese-style tiles and placing them carefully to complete scoring patterns.',
  updated_at = now()
WHERE bgg_id = 230802
   OR title = 'Azul Mini';

INSERT INTO games (
  title,
  original_name,
  weight,
  bgg_rank,
  min_players,
  max_players,
  duration_minutes,
  min_playtime_minutes,
  max_playtime_minutes,
  year_published,
  language_dependence,
  cover_image_url,
  source_collection,
  item_type,
  complexity_level,
  player_count,
  description,
  is_featured,
  is_silver_circle
) VALUES
  (
    'Azul',
    'Azul',
    1.774,
    99,
    2,
    4,
    45,
    30,
    45,
    2017,
    'No necessary in-game text',
    '/images/collection/azul-board-game.jpg',
    'manual-preview',
    'standalone',
    'Beginner',
    '2-4',
    'Azul is an abstract tile-drafting game about decorating a palace wall with patterned Portuguese tiles, creating useful table talk about colors, placement, patterns, and choices.',
    false,
    true
  ),
  (
    'Roller Coaster Challenge',
    'Roller Coaster Challenge',
    1.2,
    NULL,
    1,
    1,
    20,
    15,
    30,
    2017,
    'No necessary in-game text',
    '/images/collection/roller-coaster-challenge.jpg',
    'manual-preview',
    'standalone',
    'Beginner',
    '1-1',
    'Roller Coaster Challenge is a solo logic puzzle about building a working coaster track, making it useful for simple English around position, direction, height, and problem solving.',
    false,
    true
  )
ON CONFLICT (title) DO UPDATE
SET
  original_name = EXCLUDED.original_name,
  weight = EXCLUDED.weight,
  bgg_rank = EXCLUDED.bgg_rank,
  min_players = EXCLUDED.min_players,
  max_players = EXCLUDED.max_players,
  duration_minutes = EXCLUDED.duration_minutes,
  min_playtime_minutes = EXCLUDED.min_playtime_minutes,
  max_playtime_minutes = EXCLUDED.max_playtime_minutes,
  year_published = EXCLUDED.year_published,
  language_dependence = EXCLUDED.language_dependence,
  cover_image_url = EXCLUDED.cover_image_url,
  source_collection = EXCLUDED.source_collection,
  item_type = EXCLUDED.item_type,
  complexity_level = EXCLUDED.complexity_level,
  player_count = EXCLUDED.player_count,
  description = EXCLUDED.description,
  is_featured = EXCLUDED.is_featured,
  is_silver_circle = EXCLUDED.is_silver_circle,
  updated_at = now();
