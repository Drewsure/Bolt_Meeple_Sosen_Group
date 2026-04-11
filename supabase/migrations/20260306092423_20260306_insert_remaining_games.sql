/*
  # Insert Remaining 13 Games from Collection

  1. Overview
    - Inserts the 13 games that were missing from the database (total should be 289)
    - All games source from the collection.csv file
    - Each game includes: title, weight, year published, player count ranges, duration, complexity level, and BGG ranking
    - All games already exist (must skip duplicates)

  2. Data Source
    - Source: collection.csv with 289 board game entries
    - Missing games will be identified and inserted
    - Duplicates handled with ON CONFLICT clause
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
  ('Beasts of Balance: Hotbelly the Hangry Dragon', 0, 2018, 1, 5, 30, 'Foundation', 0, '1-5', 'Minimal', 'Expansion for Beasts of Balance', 'https://images.pexels.com/photos/3837422/pexels-photo-3837422.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Between Two Cities', 2.10, 2015, 1, 8, 20, 'Foundation', 1045, '1-8', 'No necessary in-game text', 'Cooperative city building game', 'https://images.pexels.com/photos/3970330/pexels-photo-3970330.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Biblios', 1.61, 2007, 2, 4, 30, 'Foundation', 1667, '2-4', 'No necessary in-game text', 'Auction game for collecting books', 'https://images.pexels.com/photos/2950285/pexels-photo-2950285.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Big City 8-Bit', 2.19, 2020, 2, 4, 60, 'Intermediate', 3370, '2-4', 'No necessary in-game text', 'City-building in retro pixel style', 'https://images.pexels.com/photos/3307517/pexels-photo-3307517.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Blood Bowl: Team Manager', 2.66, 2011, 2, 4, 120, 'Intermediate', 1095, '2-4', 'Extensive use of text', 'Warhammer fantasy football', 'https://images.pexels.com/photos/3597906/pexels-photo-3597906.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Blue Lagoon', 2.06, 2018, 2, 4, 20, 'Foundation', 1597, '2-4', 'No necessary in-game text', 'Exploration and survival game', 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Blue Moon', 2.47, 2000, 2, 2, 45, 'Intermediate', 1432, '2', 'Some necessary text', 'Collectible card game', 'https://images.pexels.com/photos/3808426/pexels-photo-3808426.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Bora Bora', 2.66, 2013, 2, 4, 90, 'Advanced', 751, '2-4', 'No necessary in-game text', 'Worker placement in tropical setting', 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Boss Monster', 1.82, 2011, 2, 4, 30, 'Foundation', 1859, '2-4', 'Some necessary text', 'Dungeon building card game', 'https://images.pexels.com/photos/3932558/pexels-photo-3932558.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Bottle Imp', 1.73, 2011, 2, 4, 30, 'Foundation', 1954, '2-4', 'No necessary in-game text', 'Trick-taking card game', 'https://images.pexels.com/photos/3927369/pexels-photo-3927369.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Brains', 2.82, 2015, 1, 6, 90, 'Master', 1275, '1-6', 'Extensive use of text', 'Horror cooperative puzzle game', 'https://images.pexels.com/photos/3808556/pexels-photo-3808556.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Brass: Lancashire', 2.76, 2007, 2, 4, 120, 'Advanced', 126, '2-4', 'Some necessary text', 'Network building industrial revolution game', 'https://images.pexels.com/photos/3737877/pexels-photo-3737877.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Brass: Birmingham', 2.75, 2018, 2, 4, 120, 'Advanced', 28, '2-4', 'Some necessary text', 'Enhanced version of Brass with economic depth', 'https://images.pexels.com/photos/3810791/pexels-photo-3810791.jpeg?auto=compress&cs=tinysrgb&w=600')
ON CONFLICT (title) DO NOTHING;
