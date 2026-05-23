import { Swords, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  onInitialize: () => void;
}

export function Hero({ onInitialize }: HeroProps) {
  const { language } = useAuth();
  const [balls, setBalls] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const newBalls = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }));
    setBalls(newBalls);

    const interval = setInterval(() => {
      setBalls(prev =>
        prev.map(ball => ({
          ...ball,
          y: (ball.y + Math.random() * 0.5) % 100,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZGJmNmUiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      {balls.map(ball => (
        <div
          key={ball.id}
          className="absolute rounded-full bg-gradient-to-br from-amber-300 to-amber-600 shadow-lg"
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            width: `${ball.size * 8}px`,
            height: `${ball.size * 8}px`,
            opacity: 0.6,
            animation: `float-${ball.id} 20s infinite ease-in-out`,
          }}
        >
          <style>{`
            @keyframes float-${ball.id} {
              0%, 100% { transform: translateY(0px) translateX(0px); }
              25% { transform: translateY(-20px) translateX(10px); }
              50% { transform: translateY(20px) translateX(-10px); }
              75% { transform: translateY(-10px) translateX(20px); }
            }
          `}</style>
        </div>
      ))}

      <div className="relative z-20 max-w-6xl mx-auto px-6 text-center">
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 blur-2xl opacity-40"></div>
            <Swords className="relative w-28 h-28 text-amber-300 drop-shadow-2xl" strokeWidth={1.5} />
          </div>
        </div>

        <div className="mb-8 flex justify-center gap-4">
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDelay: '0.3s' }} />
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDelay: '0.6s' }} />
        </div>

        <h1 className="text-7xl md:text-9xl font-bebas tracking-wider text-white mb-4 drop-shadow-2xl leading-tight">
          <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 text-transparent bg-clip-text">
            {language === 'ja' ? 'THE ULTIMATE' : 'ENGLISH IS'}
          </span>
          <br />
          <span className="text-white">{language === 'ja' ? 'STRATEGY GAME' : 'THE ULTIMATE'}</span>
          <br />
          <span className="bg-gradient-to-r from-red-400 to-amber-400 text-transparent bg-clip-text">
            {language === 'ja' ? 'IS CALLING' : 'STRATEGY GAME'}
          </span>
        </h1>

        <p className="text-2xl md:text-3xl text-amber-200 mb-16 max-w-3xl mx-auto font-light tracking-wide">
          {language === 'ja' ? '戦略的支配の準備はできていますか？' : 'Are you ready to'} <span className="font-bebas text-amber-300">{language === 'ja' ? 'あなたの勝利を発揮する' : 'AUTHOR YOUR VICTORY'}</span>{language === 'en' ? '?' : ''}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <button
            onClick={onInitialize}
            className="group relative px-16 py-5 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-bebas text-2xl tracking-widest overflow-hidden transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-amber-500/50"
            style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-yellow-200 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <span className="relative z-10">ENTER THE GAME</span>
          </button>

          <div className="relative px-12 py-5 bg-gradient-to-r from-slate-800 to-slate-700 border-2 border-amber-500 text-amber-300 font-bebas text-xl tracking-widest overflow-hidden shadow-2xl"
            style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}>
            <span className="relative z-10">VIEW RESERVES</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-8">
          <div className="text-center backdrop-blur-md bg-slate-800/30 p-6 rounded-lg border border-amber-500/30 hover:border-amber-500 transition-all">
            <div className="text-5xl font-bebas text-amber-400 mb-2">291</div>
            <div className="text-amber-200 font-light tracking-wide">Strategic Assets</div>
          </div>
          <div className="text-center backdrop-blur-md bg-slate-800/30 p-6 rounded-lg border border-amber-500/30 hover:border-amber-500 transition-all">
            <div className="text-5xl font-bebas text-amber-400 mb-2">∞</div>
            <div className="text-amber-200 font-light tracking-wide">Depths Explored</div>
          </div>
          <div className="text-center backdrop-blur-md bg-slate-800/30 p-6 rounded-lg border border-amber-500/30 hover:border-amber-500 transition-all">
            <div className="text-5xl font-bebas text-amber-400 mb-2">L1</div>
            <div className="text-amber-200 font-light tracking-wide">Founder Club</div>
          </div>
        </div>

        <div className="text-slate-400 text-sm font-light tracking-widest">
          ✦ PREMIUM MEMBER SOCIETY ✦
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}
