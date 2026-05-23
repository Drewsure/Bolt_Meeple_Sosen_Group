import { Award, BookOpen, ShieldCheck, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard({ onJoin }: { onJoin: () => void }) {
  const { profile, user } = useAuth();
  const name = profile?.display_name || (user ? 'Guild Member' : 'Prospective Member');

  return (
    <main className="page-shell">
      <div className="container-shell">
        <p className="eyebrow">Member Profile / Badges</p>
        <div className="mt-7 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <section className="paper-panel p-7">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#cf612d] font-display text-4xl text-white">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <h1 className="font-display mt-7 text-5xl tracking-wider">{name}</h1>
            <p className="eyebrow mt-2">{profile?.rank || 'Visitor / Unranked'}</p>
            <div className="mt-9 grid grid-cols-2 gap-3">
              <div className="border border-[#eadfce] p-4"><p className="line-label">XP</p><p className="metric mt-2">{profile?.xp_points || 0}</p></div>
              <div className="border border-[#eadfce] p-4"><p className="line-label">Sessions</p><p className="metric mt-2">{profile?.total_sessions || 0}</p></div>
            </div>
            {!user && <button onClick={onJoin} className="rule-button rule-button-primary mt-7 w-full">Sign In To Begin</button>}
            {user && <a href="#admin-images" className="rule-button mt-7 w-full">Image Admin Gate</a>}
          </section>
          <section className="paper-panel p-7">
            <div className="flex justify-between border-b border-[#eadfce] pb-5">
              <h2 className="font-display text-4xl tracking-wider text-[#cf612d]">Badge Cabinet</h2>
              <span className="line-label">Preview</span>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, name: 'Founding Member', status: 'Ready to earn', detail: 'Join the opening guild cohort.' },
                { icon: Star, name: 'Table Diplomat', status: 'Locked', detail: 'Complete a negotiation challenge.' },
                { icon: BookOpen, name: 'Vocabulary Keeper', status: 'Locked', detail: 'Submit three table debriefs.' },
                { icon: Award, name: 'Silver Mentor', status: 'Locked', detail: 'Host a welcoming community table.' },
              ].map(({ icon: Icon, name: title, status, detail }) => (
                <article key={title} className="border border-[#eadfce] p-5">
                  <Icon className="text-[#cf612d]" size={25} />
                  <h3 className="mt-5 font-bold">{title}</h3>
                  <p className="eyebrow mt-2">{status}</p>
                  <p className="mt-3 text-sm leading-6 text-[#776d62]">{detail}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
