import { Search, Zap } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTranslation } from '../lib/i18n';
import { getAllGames } from '../lib/gamesService';

interface Game {
  id: string;
  title: string;
  complexity_level: string;
  bgg_rank: number | null;
  weight: number;
  year_published: number;
  min_players: number;
  max_players: number;
  duration_minutes: number;
  cover_image_url: string | null;
}

export function Reserves() {
  const [searchTerm, setSearchTerm] = useState('');
  const [complexityFilter, setComplexityFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'weight' | 'year'>('name');
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useAuth();

  useEffect(() => {
    const loadGames = async () => {
      try {
        const games = await getAllGames();
        setAllGames(games as Game[]);
      } catch (error) {
        console.error('Error loading games:', error);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  const filteredGames = useMemo(() => {
    let filtered = [...allGames];

    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (complexityFilter) {
      filtered = filtered.filter(game => game.complexity_level === complexityFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.bgg_rank || 999999) - (a.bgg_rank || 999999);
        case 'weight':
          return b.weight - a.weight;
        case 'year':
          return b.year_published - a.year_published;
        case 'name':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [searchTerm, complexityFilter, sortBy, allGames]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Foundation':
        return 'border-blue-600 bg-blue-950/40 text-blue-300';
      case 'Intermediate':
        return 'border-green-600 bg-green-950/40 text-green-300';
      case 'Advanced':
        return 'border-amber-600 bg-amber-950/40 text-amber-300';
      case 'Master':
        return 'border-red-600 bg-red-950/40 text-red-300';
      default:
        return 'border-slate-600 bg-slate-800/40 text-slate-300';
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-red-600 rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <Zap className="w-16 h-16 text-amber-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-7xl md:text-8xl font-bebas text-white mb-6 tracking-wider drop-shadow-2xl">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 text-transparent bg-clip-text">
              {getTranslation(language, 'theReserves')}
            </span>
          </h1>
          <p className="text-xl text-amber-200 max-w-2xl mx-auto font-light">
            {getTranslation(language, 'completeCollection')}
          </p>
        </div>

        <div className="mb-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-amber-400" />
              <input
                type="text"
                placeholder={getTranslation(language, 'searchGames')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['Foundation', 'Intermediate', 'Advanced', 'Master'].map(level => (
                <button
                  key={level}
                  onClick={() => setComplexityFilter(complexityFilter === level ? null : level)}
                  className={`px-4 py-2 rounded-full font-bebas text-sm transition-all ${
                    complexityFilter === level
                      ? `${getLevelColor(level)} border-2`
                      : 'bg-slate-800 text-slate-400 border-2 border-slate-700 hover:border-amber-500'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1 rounded text-sm font-bebas transition-all ${
                sortBy === 'name'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {language === 'ja' ? '名前' : 'Name'}
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1 rounded text-sm font-bebas transition-all ${
                sortBy === 'rating'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {getTranslation(language, 'rating')}
            </button>
            <button
              onClick={() => setSortBy('weight')}
              className={`px-3 py-1 rounded text-sm font-bebas transition-all ${
                sortBy === 'weight'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {getTranslation(language, 'depth')}
            </button>
            <button
              onClick={() => setSortBy('year')}
              className={`px-3 py-1 rounded text-sm font-bebas transition-all ${
                sortBy === 'year'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {getTranslation(language, 'year')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-amber-200 font-light text-lg">
              {language === 'ja' ? 'ゲームを読み込み中...' : 'Loading games...'}
            </p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-amber-200 font-light text-lg">
              {getTranslation(language, 'noResults')}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-amber-300 font-bebas tracking-widest">
                {filteredGames.length} / {allGames.length} {language === 'ja' ? 'ゲーム' : 'GAMES'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/30 flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-sm border-2 border-slate-700/50 group-hover:border-amber-500/50"></div>

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative h-32 overflow-hidden bg-slate-800">
                    {game.cover_image_url && (
                      <img
                        src={game.cover_image_url}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  </div>

                  <div className="relative p-4 flex-1 flex flex-col">
                    <h3 className="font-bebas text-white text-lg tracking-wide mb-1 group-hover:text-amber-300 transition-colors line-clamp-2">
                      {game.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/30">
                        <p className="text-xs text-amber-400 tracking-wide font-bebas mb-0.5">
                          {getTranslation(language, 'players_label')}
                        </p>
                        <p className="font-bebas text-amber-200 text-xs">{game.min_players}-{game.max_players}</p>
                      </div>

                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/30">
                        <p className="text-xs text-amber-400 tracking-wide font-bebas mb-0.5">
                          {getTranslation(language, 'time_label')}
                        </p>
                        <p className="font-bebas text-amber-200 text-xs">{game.duration_minutes}m</p>
                      </div>

                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/30">
                        <p className="text-xs text-green-400 tracking-wide font-bebas mb-0.5">
                          {getTranslation(language, 'year')}
                        </p>
                        <p className="font-bebas text-green-200 text-xs">{game.year_published}</p>
                      </div>

                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/30">
                        <p className="text-xs text-blue-400 tracking-wide font-bebas mb-0.5">
                          {getTranslation(language, 'depth')}
                        </p>
                        <p className="font-bebas text-blue-200 text-xs">{game.weight.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-auto">
                      <span
                        className={`text-xs font-bebas tracking-wider px-2 py-1 rounded-full border ${getLevelColor(
                          game.complexity_level
                        )}`}
                      >
                        {game.complexity_level}
                      </span>
                      <span className="text-xs text-slate-500 font-bebas tracking-wider">
                        {game.bgg_rank ? `#${game.bgg_rank}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
