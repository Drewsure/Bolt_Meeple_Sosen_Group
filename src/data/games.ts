export interface GameData {
  id: string;
  nameEn: string;
  nameJa: string;
  descriptionEn: string;
  descriptionJa: string;
  players: string;
  duration: number;
  year: number;
  weight: number;
  rating: number;
  bggRank: number;
  complexity: 'Foundation' | 'Intermediate' | 'Advanced' | 'Master';
  imageUrl: string;
  category?: string;
  mechanics?: string[];
}

export const GAMES: GameData[] = [
  {
    id: '10-days-usa',
    nameEn: '10 Days in the USA',
    nameJa: 'アメリカ合衆国10日間',
    descriptionEn: 'Connect cities across America through strategic route management and lucky card draws.',
    descriptionJa: 'アメリカ中の都市を戦略的なルート管理と幸運なカードドローで接続します。',
    players: '2-4',
    duration: 30,
    year: 2003,
    weight: 1.38,
    rating: 6.5,
    bggRank: 3120,
    complexity: 'Foundation',
    imageUrl: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Travel',
    mechanics: ['Route Building', 'Set Collection'],
  },
  {
    id: '7-wonders',
    nameEn: '7 Wonders',
    nameJa: '7 ワンダーズ',
    descriptionEn: 'Build three different civilizations through simultaneous card drafting across three ages.',
    descriptionJa: '3つの時代を通じて同時カードドラフトで3つの異なる文明を構築します。',
    players: '2-7',
    duration: 30,
    year: 2010,
    weight: 2.31,
    rating: 7.67,
    bggRank: 112,
    complexity: 'Advanced',
    imageUrl: 'https://images.pexels.com/photos/3970330/pexels-photo-3970330.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Civilization',
    mechanics: ['Card Drafting', 'Simultaneous Action Selection'],
  },
  {
    id: '7-wonders-duel',
    nameEn: '7 Wonders Duel',
    nameJa: '7 ワンダーズ デュエル',
    descriptionEn: 'Head-to-head civilization building with tactical card play and variable game boards.',
    descriptionJa: '戦術的なカードプレイと可変ゲームボードを使用した1対1の文明構築。',
    players: '2-2',
    duration: 30,
    year: 2015,
    weight: 2.23,
    rating: 8.08,
    bggRank: 23,
    complexity: 'Advanced',
    imageUrl: 'https://images.pexels.com/photos/2950285/pexels-photo-2950285.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Civilization',
    mechanics: ['Card Drafting', 'Head-to-Head'],
  },
  {
    id: 'acquire',
    nameEn: 'Acquire',
    nameJa: 'アクワイア',
    descriptionEn: 'Orchestrate hotel chain mergers and stock trading in a ruthless economic simulation.',
    descriptionJa: 'ホテルチェーンの合併と株式取引を激しい経済シミュレーションで調整します。',
    players: '2-6',
    duration: 90,
    year: 2008,
    weight: 2.49,
    rating: 7.36,
    bggRank: 361,
    complexity: 'Advanced',
    imageUrl: 'https://images.pexels.com/photos/3810791/pexels-photo-3810791.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Business',
    mechanics: ['Stock Trading', 'Economic Simulation'],
  },
  {
    id: 'brass-birmingham',
    nameEn: 'Brass: Birmingham',
    nameJa: 'ブラス:バーミンガム',
    descriptionEn: 'Reshape the Industrial Revolution through canal and railway networks and ruthless negotiation.',
    descriptionJa: '運河と鉄道ネットワークを通じて産業革命を再構成し、激しく交渉します。',
    players: '2-4',
    duration: 120,
    year: 2018,
    weight: 3.87,
    rating: 8.57,
    bggRank: 1,
    complexity: 'Master',
    imageUrl: 'https://images.pexels.com/photos/3597906/pexels-photo-3597906.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Economic',
    mechanics: ['Network Building', 'Economic Simulation'],
  },
  {
    id: 'brass-lancashire',
    nameEn: 'Brass: Lancashire',
    nameJa: 'ブラス:ランカシャー',
    descriptionEn: 'The original Industrial Revolution economic game with complex canal and rail building.',
    descriptionJa: '複雑な運河と鉄道建設を備えたオリジナルの産業革命経済ゲーム。',
    players: '2-4',
    duration: 120,
    year: 2007,
    weight: 3.85,
    rating: 8.2,
    bggRank: 22,
    complexity: 'Master',
    imageUrl: 'https://images.pexels.com/photos/3808556/pexels-photo-3808556.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Economic',
    mechanics: ['Network Building', 'Economic Simulation'],
  },
  {
    id: 'carcassonne',
    nameEn: 'Carcassonne',
    nameJa: 'カルカソンヌ',
    descriptionEn: 'Build a medieval landscape tile by tile, claiming territories through strategic placement.',
    descriptionJa: '中世の風景をタイルごとに構築し、戦略的な配置を通じて領土を主張します。',
    players: '2-6',
    duration: 45,
    year: 2000,
    weight: 1.89,
    rating: 7.41,
    bggRank: 238,
    complexity: 'Foundation',
    imageUrl: 'https://images.pexels.com/photos/3307517/pexels-photo-3307517.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Strategy',
    mechanics: ['Tile Placement', 'Area Control'],
  },
  {
    id: 'power-grid',
    nameEn: 'Power Grid',
    nameJa: 'パワーグリッド',
    descriptionEn: 'Manage power stations and fuel supplies in a competitive energy market with auction bidding.',
    descriptionJa: 'オークション入札で競争的なエネルギー市場で発電所と燃料供給を管理します。',
    players: '2-6',
    duration: 120,
    year: 2004,
    weight: 3.25,
    rating: 7.87,
    bggRank: 73,
    complexity: 'Advanced',
    imageUrl: 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Economic',
    mechanics: ['Auction', 'Economic Management'],
  },
  {
    id: 'terra-mars',
    nameEn: 'Terraforming Mars',
    nameJa: 'テラフォーミング・マーズ',
    descriptionEn: 'Transform Mars into a habitable world through corporate projects and environmental strategy.',
    descriptionJa: 'コーポレートプロジェクトと環境戦略を通じて火星を居住可能な世界に変えます。',
    players: '1-5',
    duration: 120,
    year: 2016,
    weight: 3.27,
    rating: 8.34,
    bggRank: 9,
    complexity: 'Master',
    imageUrl: 'https://images.pexels.com/photos/3937023/pexels-photo-3937023.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Science',
    mechanics: ['Tableau Building', 'Economic Management'],
  },
  {
    id: 'ticket-ride',
    nameEn: 'Ticket to Ride',
    nameJa: 'チケット・トゥ・ライド',
    descriptionEn: 'Claim railway routes and connect cities across the map with elegant mechanics.',
    descriptionJa: '鉄道ルートを主張し、優雅なメカニクスでマップ上の都市を接続します。',
    players: '2-5',
    duration: 60,
    year: 2004,
    weight: 1.85,
    rating: 7.54,
    bggRank: 51,
    complexity: 'Foundation',
    imageUrl: 'https://images.pexels.com/photos/3808426/pexels-photo-3808426.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Route Building',
    mechanics: ['Route Building', 'Set Collection'],
  },
];

// Helper to get games by complexity
export const getGamesByComplexity = (complexity: GameData['complexity']): GameData[] => {
  return GAMES.filter(game => game.complexity === complexity);
};

// Helper to search games
export const searchGames = (query: string, language: 'ja' | 'en'): GameData[] => {
  const lowerQuery = query.toLowerCase();
  return GAMES.filter(game => {
    const name = language === 'ja' ? game.nameJa : game.nameEn;
    return name.toLowerCase().includes(lowerQuery);
  });
};

// Total game count
export const TOTAL_GAMES = GAMES.length;
