import { Target, Users, Clock, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Game {
  title: string;
  level: 'Foundation' | 'Intermediate' | 'Advanced' | 'Master';
  bggRank: number;
  players: string;
  duration: number;
  mechanics: string[];
  focus: string[];
  category?: string;
  description: string;
  imageUrl: string;
}

const GAMES: Game[] = [
  {
    title: 'Ticket to Ride',
    level: 'Foundation',
    bggRank: 51,
    players: '2-5',
    duration: 60,
    mechanics: ['Route Building', 'Set Collection'],
    focus: ['Numbers', 'Negotiation', 'Route Planning'],
    category: 'Strategy',
    description: 'Claim railway routes and connect cities across the map. A perfectly balanced introduction to strategic board gaming with elegant mechanics.',
    imageUrl: 'https://images.pexels.com/photos/2950285/pexels-photo-2950285.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Carcassonne',
    level: 'Foundation',
    bggRank: 91,
    players: '2-6',
    duration: 45,
    mechanics: ['Tile Placement', 'Area Control'],
    focus: ['Spatial Reasoning', 'Negotiation'],
    category: 'Strategy',
    description: 'Build a medieval landscape tile by tile, claiming territories through strategic placement. A timeless classic combining luck and tactical depth.',
    imageUrl: 'https://images.pexels.com/photos/3307517/pexels-photo-3307517.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Acquire',
    level: 'Advanced',
    bggRank: 361,
    players: '2-6',
    duration: 90,
    mechanics: ['Stock Trading', 'Economic Simulation'],
    focus: ['Stock Market Vocabulary', 'Merger Negotiation', 'Financial Analysis'],
    category: 'Business',
    description: 'Become a corporate magnate by trading stocks and orchestrating hotel chain mergers. A ruthless economic simulation where negotiation is currency.',
    imageUrl: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Brass: Birmingham',
    level: 'Advanced',
    bggRank: 3,
    players: '2-4',
    duration: 120,
    mechanics: ['Network Building', 'Economic Simulation'],
    focus: ['Industry Terms', 'Contract Negotiation', 'Financial Strategy'],
    category: 'Business',
    description: 'Reshape the Industrial Revolution through canal and railway networks. Negotiate deals and dominate markets in this economic masterpiece.',
    imageUrl: 'https://images.pexels.com/photos/3597906/pexels-photo-3597906.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Power Grid',
    level: 'Advanced',
    bggRank: 12,
    players: '2-6',
    duration: 120,
    mechanics: ['Auction', 'Economic Management'],
    focus: ['Bidding Language', 'Resource Management', 'Market Analysis'],
    category: 'Business',
    description: 'Manage power stations and fuel supplies in a competitive energy market. Master auction bidding and resource management for supremacy.',
    imageUrl: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Pax Pamir',
    level: 'Master',
    bggRank: 28,
    players: '2-5',
    duration: 90,
    mechanics: ['Area Control', 'Card-Driven', 'Coalition Building'],
    focus: ['Diplomatic Language', 'Alliance Formation', 'Historical Context'],
    category: 'Strategy',
    description: 'Navigate the complex geopolitics of Central Asia through shifting alliances. A game of negotiation and historical strategy of supreme depth.',
    imageUrl: 'https://images.pexels.com/photos/3737877/pexels-photo-3737877.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Food Chain Magnate',
    level: 'Master',
    bggRank: 15,
    players: '2-5',
    duration: 240,
    mechanics: ['Economic Simulation', 'Stock Market'],
    focus: ['Business Vocabulary', 'Corporate Negotiation', 'Market Strategy'],
    category: 'Business',
    description: 'Build a fast food empire from nothing. A ruthless economic sandbox where ruthless negotiation and strategic vision determine victory.',
    imageUrl: 'https://images.pexels.com/photos/3810791/pexels-photo-3810791.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Great Western Trail',
    level: 'Master',
    bggRank: 17,
    players: '2-4',
    duration: 150,
    mechanics: ['Network Building', 'Economic Management'],
    focus: ['Commercial Strategy', 'Competitive Bidding', 'Supply Chain'],
    category: 'Business',
    description: 'Drive cattle across America and build railway networks. A sophisticated economic game demanding cunning negotiation and long-term strategy.',
    imageUrl: 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Orléans',
    level: 'Master',
    bggRank: 37,
    players: '2-5',
    duration: 90,
    mechanics: ['Deck Building', 'Area Control'],
    focus: ['Medieval Economics', 'Trade Negotiation', 'Resource Control'],
    category: 'Business',
    description: 'Control medieval trade through follower placement and area dominance. Master negotiation and resource management in this historical economic game.',
    imageUrl: 'https://images.pexels.com/photos/3808556/pexels-photo-3808556.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Terraforming Mars',
    level: 'Master',
    bggRank: 9,
    players: '1-5',
    duration: 120,
    mechanics: ['Tableau Building', 'Economic Management'],
    focus: ['Environmental Strategy', 'Corporate Development', 'Investment'],
    category: 'Business',
    description: 'Transform Mars into a habitable world through corporate projects. A sophisticated tableau-building game of environmental strategy and negotiation.',
    imageUrl: 'https://images.pexels.com/photos/3965543/pexels-photo-3965543.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'La Granja',
    level: 'Advanced',
    bggRank: 273,
    players: '1-4',
    duration: 120,
    mechanics: ['Worker Placement', 'Economic Management'],
    focus: ['Agricultural Terms', 'Market Timing', 'Resource Allocation'],
    category: 'Business',
    description: 'Manage a Spanish farm through strategic worker placement and trading. Master market negotiation and resource timing for agricultural supremacy.',
    imageUrl: 'https://images.pexels.com/photos/3935544/pexels-photo-3935544.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Ra',
    level: 'Advanced',
    bggRank: 117,
    players: '2-5',
    duration: 60,
    mechanics: ['Auction', 'Set Collection'],
    focus: ['Bidding Strategy', 'Negotiation', 'Competitive Analysis'],
    category: 'Strategy',
    description: 'Bid for Egyptian civilizations across three epochs. A masterclass in auction mechanics and negotiation wrapped in historical grandeur.',
    imageUrl: 'https://images.pexels.com/photos/3927369/pexels-photo-3927369.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Modern Art',
    level: 'Intermediate',
    bggRank: 219,
    players: '3-5',
    duration: 45,
    mechanics: ['Auction', 'Economic Simulation'],
    focus: ['Auction Language', 'Market Dynamics', 'Negotiation'],
    category: 'Business',
    description: 'Trade art masterpieces and speculate on market values. A short but vicious economic game where negotiation determines market dominance.',
    imageUrl: 'https://images.pexels.com/photos/3970330/pexels-photo-3970330.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'High Society',
    level: 'Intermediate',
    bggRank: 534,
    players: '3-5',
    duration: 30,
    mechanics: ['Auction', 'Bidding'],
    focus: ['Status Vocabulary', 'Strategic Bidding', 'Competitive Pricing'],
    category: 'Business',
    description: 'Bid for status and luxury items in high society. Quick, elegant, and brutally competitive negotiation of social position.',
    imageUrl: 'https://images.pexels.com/photos/3932558/pexels-photo-3932558.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    title: 'Airlines Europe',
    level: 'Intermediate',
    bggRank: 657,
    players: '2-5',
    duration: 75,
    mechanics: ['Stock Trading', 'Route Building'],
    focus: ['Airline Terminology', 'Investment Strategy', 'Market Competition'],
    category: 'Business',
    description: 'Build airline networks and speculate on stock prices. Navigate market negotiation and competitive route building across Europe.',
    imageUrl: 'https://images.pexels.com/photos/3808426/pexels-photo-3808426.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Foundation':
      return 'bg-blue-900/20 border-blue-700/50 text-blue-400';
    case 'Intermediate':
      return 'bg-green-900/20 border-green-700/50 text-green-400';
    case 'Advanced':
      return 'bg-amber-900/20 border-amber-700/50 text-amber-400';
    case 'Master':
      return 'bg-red-900/20 border-red-700/50 text-red-400';
    default:
      return 'bg-slate-800/20 border-slate-700/50';
  }
};

export function Armory() {
  const { language } = useAuth();

  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-red-600 rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <Zap className="w-16 h-16 text-amber-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-7xl md:text-8xl font-bebas text-white mb-6 tracking-wider drop-shadow-2xl">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 text-transparent bg-clip-text">
              {language === 'ja' ? '兵器庫' : 'THE ARMORY'}
            </span>
          </h1>
          <p className="text-xl text-amber-200 max-w-2xl mx-auto font-light">
            {language === 'ja' ? '精鋭な戦略シミュレーション。基礎的な戦術からマスターレベルの経済戦争まで。' : 'Elite strategic simulations. From foundational tactics to master-level economic warfare.'}
          </p>
        </div>

        <div className="space-y-16">
          {['Foundation', 'Intermediate', 'Advanced', 'Master'].map((level) => (
            <div key={level}>
              <div className="mb-8">
                <div className="inline-flex items-center gap-6">
                  <div className={`h-1 w-12 ${
                    level === 'Foundation' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    level === 'Intermediate' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    level === 'Advanced' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                    'bg-gradient-to-r from-red-400 to-red-600'
                  }`}></div>
                  <h2 className={`text-4xl font-bebas tracking-widest px-8 py-3 border-2 ${getLevelColor(level)}`}>
                    {language === 'ja' ? (level === 'Foundation' ? 'ファンデーション' : level === 'Intermediate' ? '中級' : level === 'Advanced' ? 'アドバンス' : 'マスター') : level.toUpperCase()}
                  </h2>
                  <p className="text-amber-300 text-lg font-light ml-4">
                    {language === 'ja' ? (
                      level === 'Foundation' && '⚪ 戦略的な旅を始める'
                      || level === 'Intermediate' && '🟢 戦術的な正確性を開発する'
                      || level === 'Advanced' && '🟡 経済シミュレーションをマスター'
                      || level === 'Master' && '🔴 複雑なエコシステムを指揮'
                    ) : (
                      level === 'Foundation' && '⚪ Begin your strategic journey'
                      || level === 'Intermediate' && '🟢 Develop tactical precision'
                      || level === 'Advanced' && '🟡 Master economic simulation'
                      || level === 'Master' && '🔴 Command complex ecosystems'
                    )}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {GAMES.filter((g) => g.level === level).map((game) => (
                  <div
                    key={game.title}
                    className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105 flex flex-col"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-slate-700/50 group-hover:border-amber-500/50"></div>

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative h-48 overflow-hidden mb-4">
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    </div>

                    <div className="relative p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-2xl font-bebas text-white tracking-wide group-hover:text-amber-300 transition-colors">
                            {game.title}
                          </h3>
                          <p className="text-amber-400 text-xs font-bebas tracking-widest mt-1">
                            🏆 RANK #{game.bggRank}
                          </p>
                          {game.category && (
                            <p className="text-slate-400 text-xs font-bebas tracking-widest mt-1 uppercase">
                              {game.category}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="text-amber-100 text-sm font-light mb-4 leading-relaxed">
                        {game.description}
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
                        <div className="flex flex-col items-center">
                          <Users className="w-6 h-6 text-amber-400 mb-2" />
                          <p className="text-sm font-bebas text-amber-300">{game.players}</p>
                          <p className="text-xs text-slate-500">{language === 'ja' ? 'プレイヤー' : 'PLAYERS'}</p>
                        </div>
                        <div className="flex flex-col items-center border-l border-r border-slate-700/30">
                          <Clock className="w-6 h-6 text-amber-400 mb-2" />
                          <p className="text-sm font-bebas text-amber-300">{game.duration}m</p>
                          <p className="text-xs text-slate-500">{language === 'ja' ? '期間' : 'DURATION'}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <Target className="w-6 h-6 text-amber-400 mb-2" />
                          <p className="text-sm font-bebas text-amber-300">{language === 'ja' ? 'エキスパート' : 'Expert'}</p>
                          <p className="text-xs text-slate-500">{language === 'ja' ? '難易度' : 'DIFFICULTY'}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-xs font-bebas text-amber-400 tracking-widest mb-3 uppercase">🎲 {language === 'ja' ? 'コアメカニクス' : 'Core Mechanics'}</p>
                        <div className="flex flex-wrap gap-2">
                          {game.mechanics.map((mech) => (
                            <span
                              key={mech}
                              className="text-xs bg-gradient-to-r from-slate-800 to-slate-900 border border-amber-500/30 text-amber-300 px-3 py-2 rounded-full font-semibold"
                            >
                              {mech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bebas text-green-400 tracking-widest mb-3 uppercase">💬 {language === 'ja' ? '言語フォーカス' : 'Language Focus'}</p>
                        <div className="flex flex-wrap gap-2">
                          {game.focus.map((f) => (
                            <span
                              key={f}
                              className="text-xs bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/40 text-green-300 px-3 py-2 rounded-full font-semibold"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
