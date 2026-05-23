import { Award, Crown, Medal, Users } from 'lucide-react';
import type { Section } from '../App';

export function Leaderboard({ onNavigate }: { onNavigate: (section: Section) => void }) {
  return (
    <main className="page-shell">
      <div className="container-shell">
        <p className="eyebrow">Ranking / Leaderboard</p>
        <h1 className="display-title mt-5 text-7xl sm:text-8xl">Guild Standing</h1>
        <div className="mt-9 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="paper-panel min-h-[360px] p-7">
            <div className="flex items-center justify-between border-b border-[#eadfce] pb-5">
              <h2 className="font-display text-3xl tracking-wider">Season Rankings</h2>
              <span className="line-label">Season Opens Soon</span>
            </div>
            <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
              <Crown className="text-[#cf612d]" size={37} strokeWidth={1.3} />
              <h3 className="font-editorial mt-6 text-2xl">No rankings recorded yet</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#776d62]">Complete a guild challenge or hosted session to establish the first table standings.</p>
              <button onClick={() => onNavigate('challenges')} className="rule-button mt-7">Browse Challenges</button>
            </div>
          </section>
          <div className="grid gap-4">
            {[
              { icon: Medal, title: 'Badges Issued', value: '0', caption: 'Recognition awaiting first missions' },
              { icon: Award, title: 'XP Recorded', value: '0', caption: 'A clear field for founding members' },
              { icon: Users, title: 'Guild Tables', value: '0', caption: 'Reserve your opening session' },
            ].map(({ icon: Icon, title, value, caption }) => (
              <article key={title} className="paper-panel flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <Icon className="text-[#cf612d]" size={23} />
                  <div><p className="line-label">{title}</p><p className="mt-1 text-sm text-[#776d62]">{caption}</p></div>
                </div>
                <p className="metric">{value}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
