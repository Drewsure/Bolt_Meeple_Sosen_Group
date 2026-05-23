import { Award, Crown, Lightbulb, Shield, Swords, Target, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const badges = [
  { icon: Swords, name: 'Master Negotiator', detail: 'Submitted tips for Negotiation Challenges' },
  { icon: TrendingUp, name: 'Industrial Tycoon', detail: 'Submitted tips for Trade & Economic Challenges' },
  { icon: Swords, name: 'Strategic Commander', detail: 'Submitted tips for Leadership Challenges' },
  { icon: Lightbulb, name: 'Linguistic Architect', detail: 'Submitted tips for Formal Writing Challenges' },
  { icon: Users, name: 'Grand Diplomat', detail: 'Submitted tips for Diplomacy Challenges' },
  { icon: Target, name: 'Silver Tongue', detail: 'Submitted tips with Persuasion focus' },
  { icon: Shield, name: 'Guild Pioneer', detail: 'First tip ever submitted' },
  { icon: Crown, name: 'Master Strategist', detail: 'Completed a Master-level challenge' },
];

export function Dashboard({ onJoin: _onJoin }: { onJoin: () => void }) {
  const { profile, user } = useAuth();
  const name = profile?.display_name || (user ? 'Guild Member' : 'Preview Member');
  const email = user?.email || 'Sign in to view member details';
  const xp = profile?.xp_points || 0;

  return (
    <main className="page-shell bg-[radial-gradient(circle_at_center,#fff7e7,#fbf7ef)]">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <h1 className="font-display text-3xl tracking-wide">{name}</h1>
        <p className="mt-1 text-xs text-[#71675c]">{email}</p>
        <span className="mt-2 inline-flex rounded border border-[#ebbd66] bg-[#fff4d5] px-2 py-1 text-[10px] font-bold text-[#d16a21]">{user ? 'Member' : 'Preview'}</span>
        <div className="mt-9 grid gap-4 sm:grid-cols-4">
          {[{ icon: Swords, label: 'Challenges Done' }, { icon: Lightbulb, label: 'Tips Submitted' }, { icon: TrendingUp, label: 'Votes Earned' }, { icon: Target, label: 'Badges Earned' }].map(({ icon: Icon, label }) => (
            <article key={label} className="reference-panel py-6 text-center"><Icon className="mx-auto text-[#d46a20]" size={21} /><p className="font-display mt-2 text-2xl">0</p><p className="text-[10px] text-[#746b61]">{label}</p></article>
          ))}
        </div>
        <h2 className="font-display mt-10 text-2xl tracking-wide">Strategic Linguistic Growth</h2>
        <section className="reference-panel mt-4 p-7">
          <div className="flex justify-between"><div><p className="text-[10px] text-[#82766b]">Current Rank</p><p className="font-display text-3xl text-[#d06122]">Recruit</p></div><div className="text-right"><p className="text-[10px] text-[#82766b]">Total Points</p><p className="font-display text-3xl">{xp} XP</p></div></div>
          <div className="mt-6 h-4 rounded-full border border-[#dedad4] bg-white"><div className="h-full w-0 rounded-full bg-[#d56a22]" /></div>
          <p className="mt-3 text-right text-[10px] font-bold text-[#e07521]">Next: Strategist (5 XP to go)</p>
          <div className="mt-5 grid grid-cols-5 gap-2 text-center font-display text-[10px] text-[#a29a91]"><span className="border-t-4 border-[#aca59d] pt-2 text-[#554b42]">Recruit</span><span className="border-t-4 border-[#dedad5] pt-2">Strategist</span><span className="border-t-4 border-[#dedad5] pt-2">Operative</span><span className="border-t-4 border-[#dedad5] pt-2">Commander</span><span className="border-t-4 border-[#dedad5] pt-2">Grand Master</span></div>
        </section>
        <div className="mt-10 flex justify-between"><h2 className="font-display text-2xl tracking-wide">Strategic Domain Badges</h2><span className="text-xs text-[#776e63]">0 / 8 earned</span></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          {badges.map(({ icon: Icon, name: badge, detail }) => (
            <article key={badge} className="rounded-xl border border-[#e1ded7] bg-[#f8f7f4] p-5 text-center text-[#989997]"><Icon className="mx-auto" size={30} /><h3 className="font-display mt-4 text-sm text-[#36312d]">{badge}</h3><p className="mt-2 text-[10px] leading-4">{detail}</p></article>
          ))}
        </div>
        <h2 className="font-display mt-10 text-2xl tracking-wide">Completed Challenges</h2>
        <section className="reference-panel mt-4 py-12 text-center"><Award className="mx-auto text-[#f0c457]" size={42} /><h3 className="font-display mt-4 text-lg text-[#71685e]">No Challenges Completed Yet</h3><p className="mt-2 text-xs text-[#92897f]">Submit tips on Guild Challenges to earn badges and XP.</p></section>
      </div>
    </main>
  );
}
