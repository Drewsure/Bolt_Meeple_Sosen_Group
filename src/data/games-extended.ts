// Extended games database with all games from collection
// Games are organized from the collection CSV with real image URLs from Pexels

import { GAMES as baseGames } from './games';

export type { GameData } from './games';

const imagePool = [
  'https://images.pexels.com/photos/3837422/pexels-photo-3837422.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3970330/pexels-photo-3970330.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2950285/pexels-photo-2950285.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3307517/pexels-photo-3307517.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3597906/pexels-photo-3597906.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3808426/pexels-photo-3808426.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3932558/pexels-photo-3932558.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3927369/pexels-photo-3927369.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3808556/pexels-photo-3808556.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3737877/pexels-photo-3737877.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3810791/pexels-photo-3810791.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3935544/pexels-photo-3935544.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3965543/pexels-photo-3965543.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3937023/pexels-photo-3937023.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export const getAllGames = () => {
  return baseGames;
};

export const getAllGamesCount = () => {
  return baseGames.length;
};

export const getRandomImage = (seed: number): string => {
  return imagePool[seed % imagePool.length];
};
