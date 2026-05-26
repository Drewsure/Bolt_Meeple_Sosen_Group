import { useEffect } from 'react';
import type { Section } from '../App';
import type { Language } from '../lib/i18n';

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://drewsure.github.io/Bolt_Meeple_Sosen_Group';
const imageUrl = `${siteUrl}/images/og-meeple-sosen.svg`;

const pageMeta: Record<Section, { title: string; description: string; keywords: string }> = {
  home: {
    title: 'Meeple Sosen Group | English Through Board Games In Fukuoka',
    description: 'A small, friendly English-through-board-games table in Nishi-ku, Fukuoka. Beginners welcome, Japanese support available, no tests and no board game experience needed.',
    keywords: 'English board games Fukuoka, English conversation Fukuoka, board game English class, Nishi-ku English, beginner English Japan',
  },
  situation: {
    title: 'Why Board Games Help English Conversation | Meeple Sosen Group',
    description: 'Learn how board games create natural reasons to speak English through choices, questions, planning, and reflection.',
    keywords: 'English conversation practice, board games language learning, Fukuoka English practice',
  },
  board: {
    title: 'How It Works | From Game To Conversation',
    description: 'See the Meeple Sosen session flow: choose a game, choose one English focus, use a conversation card, and record progress.',
    keywords: 'English session flow, conversation cards, board game English activities, English learning system',
  },
  armory: {
    title: 'How It Works | From Game To Conversation',
    description: 'Choose one English focus, use a conversation card, and turn a board game into supported English practice.',
    keywords: 'English focus cards, board game conversation prompts, English table activity',
  },
  challenges: {
    title: 'Conversation Cards | Meeple Sosen Group',
    description: 'Gentle table prompts that help players explain choices, ask questions, suggest plans, and review useful English.',
    keywords: 'conversation cards, English prompts, board game English',
  },
  games: {
    title: 'Game Library | Meeple Sosen Group',
    description: 'Browse a board game library used for English conversation sessions in Fukuoka, from relaxed beginner tables to deeper strategy games.',
    keywords: 'board game library Fukuoka, English board game collection, beginner board games English',
  },
  briefings: {
    title: 'Weekly English Game Briefings | Meeple Sosen Group',
    description: 'Weekly board game briefing cards for English conversation practice in Fukuoka, including phrases, prompts, table missions, and Silver Circle suitability.',
    keywords: 'English game briefing cards, board game English blog, Camel Up English phrases, Azul English conversation, Fukuoka English board games',
  },
  offers: {
    title: 'Join And Pricing | English Board Game Sessions In Fukuoka',
    description: 'Book English board game sessions, Silver Circle membership, private strategy English coaching, workshops, and weekly briefing-card learning products in Fukuoka.',
    keywords: 'English board game pricing Fukuoka, Silver Circle membership, English game workshop Fukuoka, private English coaching board games',
  },
  partnerships: {
    title: 'Corporate Workshops And Sponsor A Table | Meeple Sosen Group',
    description: 'Corporate soft-skill workshops and sponsored community tables using board games for communication, teamwork, English confidence, and local participation in Fukuoka.',
    keywords: 'corporate soft skill workshop Fukuoka, team building board games Japan, sponsor senior community table, English communication workshop',
  },
  'briefing-detail': {
    title: 'Camel Up English Briefing Card | Meeple Sosen Group',
    description: 'A standalone Camel Up briefing card for English conversation practice, with useful phrases, prompts, a table mission, and Silver Circle suitability.',
    keywords: 'Camel Up English briefing card, Camel Up English phrases, board game English conversation, Fukuoka English board games',
  },
  dossier: {
    title: 'About Meeple Sosen Group | English Through Board Games',
    description: 'Meet the thinking behind Meeple Sosen Group: a friendly participation system using analog games to support English conversation.',
    keywords: 'Meeple Sosen Group, English board game community, Fukuoka language learning',
  },
  ranking: {
    title: 'Community Progress | Meeple Sosen Group',
    description: 'A gentle progress area for session notes, table participation, and community growth.',
    keywords: 'English learning progress, community progress, board game English',
  },
  profile: {
    title: 'My Progress | Meeple Sosen Group',
    description: 'Track session notes, useful phrases, conversation cards, and next steps from English board game sessions.',
    keywords: 'English progress tracker, session notes, language learning reflection',
  },
  'silver-circle': {
    title: 'Silver Circle | English Board Games For Seniors In Fukuoka',
    description: 'A soft Japanese community program for seniors in Nishi-ku, Fukuoka using English board games for conversation, brain stimulation, and social participation.',
    keywords: 'シルバーサークル, 福岡市西区 高齢者 英語, senior board games Fukuoka, brain health community, English games seniors Japan',
  },
  'admin-images': {
    title: 'Image Maintenance | Meeple Sosen Group',
    description: 'Private maintenance tools for game image repair and library updates.',
    keywords: 'admin, image maintenance',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Meeple Sosen Group?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Meeple Sosen Group is a small English-through-board-games community in Nishi-ku, Fukuoka. It uses board games to create natural reasons to speak English.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do beginners need board game experience?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Beginners are welcome, Japanese support is available, and sessions can begin with simple games and short phrases.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does a session work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A session follows four steps: choose a game, choose one English focus, use a conversation card during play, and record one useful phrase or next step.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Silver Circle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Silver Circle is a friendly Japanese community program for seniors in Fukuoka that uses English board games to support conversation, social participation, and enjoyable cognitive stimulation. It is not medical care.',
      },
    },
  ],
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${siteUrl}/#localbusiness`,
  name: 'Meeple Sosen Group',
  alternateName: ['Silver Circle', 'Meeple Sosen English Board Games'],
  url: siteUrl,
  image: imageUrl,
  email: 'ministarenglish@mail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nishi-ku, Fukuoka',
    addressRegion: 'Fukuoka',
    addressCountry: 'JP',
  },
  areaServed: ['Nishi-ku, Fukuoka', 'Fukuoka City', 'Japan'],
  description: 'English-through-board-games sessions and senior community participation programs in Nishi-ku, Fukuoka.',
  knowsAbout: ['English conversation', 'Board games', 'Community participation', 'Senior social participation', 'Language learning'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: 'Meeple Sosen Group',
  url: siteUrl,
  inLanguage: ['en', 'ja'],
  publisher: {
    '@id': `${siteUrl}/#localbusiness`,
  },
};

function upsertMeta(selector: string, create: () => HTMLMetaElement, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setJsonLd(id: string, data: object) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function Seo({ section, language }: { section: Section; language: Language }) {
  useEffect(() => {
    const meta = pageMeta[section] ?? pageMeta.home;
    const canonical = section === 'home' ? siteUrl : `${siteUrl}/#${section}`;

    document.documentElement.lang = language;
    document.title = language === 'ja' ? `${meta.title} | 日本語` : meta.title;
    upsertMeta('meta[name="description"]', () => {
      const tag = document.createElement('meta');
      tag.name = 'description';
      return tag;
    }, meta.description);
    upsertMeta('meta[name="keywords"]', () => {
      const tag = document.createElement('meta');
      tag.name = 'keywords';
      return tag;
    }, meta.keywords);
    upsertMeta('meta[property="og:title"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:title');
      return tag;
    }, meta.title);
    upsertMeta('meta[property="og:description"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:description');
      return tag;
    }, meta.description);
    upsertMeta('meta[property="og:url"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:url');
      return tag;
    }, canonical);
    upsertMeta('meta[property="og:image"]', () => {
      const tag = document.createElement('meta');
      tag.setAttribute('property', 'og:image');
      return tag;
    }, imageUrl);

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    setJsonLd('schema-local-business', localBusinessSchema);
    setJsonLd('schema-website', websiteSchema);
    setJsonLd('schema-faq', faqSchema);
  }, [section, language]);

  return null;
}
