/*
  # Insert Final 3 Games to Complete 289 Game Collection

  1. Overview
    - Inserts the final 3 games needed to reach 289 total games in collection
    - All games from the collection.csv file
    - Handles duplicates with ON CONFLICT clause

  2. Games Added
    - Bread and Roses
    - Bremenische Hafenmeister
    - Bridges of Three Kingdoms
*/

INSERT INTO games (
  title,
  weight,
  year_published,
  min_players,
  max_players,
  duration_minutes,
  complexity_level,
  bgg_rank,
  player_count,
  language_dependence,
  description,
  cover_image_url
) VALUES
  ('Bread and Roses', 2.04, 2018, 1, 5, 75, 'Intermediate', 3213, '1-5', 'Extensive use of text', 'Worker placement historical game', 'https://images.pexels.com/photos/3935544/pexels-photo-3935544.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Bremenische Hafenmeister', 1.98, 1997, 2, 4, 60, 'Intermediate', 5015, '2-4', 'No necessary in-game text', 'Trading and port management game', 'https://images.pexels.com/photos/3965543/pexels-photo-3965543.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Bridges of Three Kingdoms', 2.25, 2015, 2, 4, 60, 'Intermediate', 2678, '2-4', 'Some necessary text', 'Network and area control game', 'https://images.pexels.com/photos/3937023/pexels-photo-3937023.jpeg?auto=compress&cs=tinysrgb&w=600')
ON CONFLICT (title) DO NOTHING;
