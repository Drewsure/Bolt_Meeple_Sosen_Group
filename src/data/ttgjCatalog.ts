export interface TTGJCatalogItem {
  title: string;
  meta: string;
  description: string;
  tags: string[];
  action: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  eventType?: string;
  featured?: boolean;
  websiteUrl?: string;
  affiliateUrl?: string;
  affiliateProgram?: string;
  affiliateStatus?: 'not_applicable' | 'pending' | 'active' | 'paused';
  affiliateDisclosure?: string;
}

export const ttgjEvents: TTGJCatalogItem[] = [
  {
    title: 'Catan Japan Championship - Kansai Regional',
    meta: 'Osaka | Jun 14, 2026',
    description: 'Regional qualifier at Namba Midosuji Hall for one of Japan\'s largest board game championships.',
    tags: ['Tournament', 'Kansai', 'Regional qualifier'],
    action: 'Review event',
    startsAt: '2026-06-14T09:30:00+09:00',
    location: 'Namba Midosuji Hall, Osaka',
    eventType: 'Tournament',
    featured: true,
  },
  {
    title: 'Catan Japan Championship - Kyushu Regional',
    meta: 'Fukuoka | Jun 21, 2026',
    description: 'Kyushu regional qualifier at Tenjin Crystal Building with a route into the national finals.',
    tags: ['Tournament', 'Kyushu', 'Competition'],
    action: 'Review event',
    startsAt: '2026-06-21T09:30:00+09:00',
    location: 'Tenjin Crystal Building, Fukuoka',
    eventType: 'Tournament',
    featured: true,
  },
  {
    title: 'Kyushu Board Game Carnival 2026',
    meta: 'Fukuoka | Jul 11-12, 2026',
    description: 'A two-day board game carnival with demos, sales, and community gaming at Fukuoka Island City Forum.',
    tags: ['Convention', 'Demos', 'Retail'],
    action: 'Review event',
    startsAt: '2026-07-11T10:00:00+09:00',
    endsAt: '2026-07-12T17:00:00+09:00',
    location: 'Fukuoka Island City Forum',
    eventType: 'Convention',
    featured: true,
  },
  {
    title: 'Catan Japan Championship - Kanto Regional',
    meta: 'Tokyo | Jul 19, 2026',
    description: 'A major Tokyo regional qualifier at the Metropolitan Industrial Trade Center in Hamamatsucho.',
    tags: ['Tournament', 'Tokyo', 'Regional qualifier'],
    action: 'Review event',
    startsAt: '2026-07-19T09:30:00+09:00',
    location: 'Metropolitan Industrial Trade Center, Tokyo',
    eventType: 'Tournament',
  },
  {
    title: 'Osaka Game Day - JIGG Kansai',
    meta: 'Osaka | Recurring meetup | Verify schedule',
    description: 'An English-friendly community meetup open to all nationalities, with shared games and a welcoming arrival path.',
    tags: ['Meetup', 'English support', 'Open play'],
    action: 'Review meetup',
    location: 'Osaka',
    eventType: 'Meetup',
  },
  {
    title: 'Human Shogi Under The Cherry Blossoms',
    meta: 'Yamagata | Annual cultural event',
    description: 'A remarkable seasonal event: life-sized shogi on Mount Maizuru beneath the cherry blossoms.',
    tags: ['Shogi', 'Culture', 'Seasonal guide'],
    action: 'Plan guide',
    location: 'Mount Maizuru, Yamagata',
    eventType: 'Special',
  },
];

export const ttgjCreators: TTGJCatalogItem[] = [
  {
    title: 'Oink Games',
    meta: 'Publisher | Compact art-forward games',
    description: 'Acclaimed Japanese publisher of Deep Sea Adventure, A Fake Artist Goes to New York, Startups, and other beautifully compact titles.',
    tags: ['Compact games', 'Party games', 'Worldwide'],
    action: 'Explore creator',
  },
  {
    title: 'Kanai Factory - Seiji Kanai',
    meta: 'Designer | Micro-game specialist',
    description: 'Creator of Love Letter and a prolific designer whose compact card games have reached tables around the world.',
    tags: ['Love Letter', 'Card games', 'Designer'],
    action: 'Explore creator',
  },
  {
    title: 'itten',
    meta: 'Publisher | Minimalist design studio',
    description: 'Japanese studio known for beautifully crafted games such as Tokyo Highway and MOON, combining strong objects with inventive play.',
    tags: ['Tokyo Highway', 'Design', 'Objects'],
    action: 'Explore creator',
  },
  {
    title: 'OKAZU Brand - Hisashi Hayashi',
    meta: 'Designer | Strategy games',
    description: 'Studio behind Yokohama, Trains, and other internationally known strategy games with a strong Euro-style influence.',
    tags: ['Yokohama', 'Strategy', 'Awarded'],
    action: 'Explore creator',
  },
  {
    title: 'Saashi & Saashi',
    meta: 'Publisher | Elegant independent games',
    description: 'A husband-and-wife studio creating refined games with distinctive illustration and memorable themes, including Coffee Roaster.',
    tags: ['Coffee Roaster', 'Indie', 'Illustration'],
    action: 'Explore creator',
  },
  {
    title: 'Arclight Games',
    meta: 'Publisher | Distribution network',
    description: 'One of Japan\'s largest tabletop publishers and distributors, connecting original Japanese games with major international titles.',
    tags: ['Publishing', 'Distribution', 'Events'],
    action: 'Explore creator',
  },
];

export const ttgjGroups: TTGJCatalogItem[] = [
  {
    title: 'JIGG Kansai Open Play',
    meta: 'Osaka | International tabletop community',
    description: 'An English-friendly open-play route for visitors looking to join a welcoming tabletop community in Kansai.',
    tags: ['Check schedule', 'English support', 'Open play'],
    action: 'Review group',
  },
  {
    title: 'Solo-Friendly Tables',
    meta: 'Join without a pre-made group',
    description: 'Find groups that explain arrival expectations and welcome people joining alone.',
    tags: ['Solo welcome', 'Beginner friendly', 'Regular'],
    action: 'Find a table',
  },
  {
    title: 'English-Support Communities',
    meta: 'Language confidence',
    description: 'Discover groups with known English support or games that work well across languages.',
    tags: ['English support', 'International', 'Open play'],
    action: 'Find a group',
  },
  {
    title: 'Regional Community Index',
    meta: 'Build from verified local sources',
    description: 'Browse local organizers, recurring venue nights, and regional communities to find a table near your route.',
    tags: ['Tokyo', 'Osaka', 'Fukuoka'],
    action: 'Browse regions',
  },
];

export const ttgjOnlineSales: TTGJCatalogItem[] = [
  {
    title: 'Amazon Japan',
    meta: 'Marketplace | International purchase path',
    description: 'Large selection of Japanese exclusives, imports, accessories, and fast domestic delivery. International availability varies by listing.',
    tags: ['Large selection', 'New games', 'Shipping varies'],
    action: 'Browse seller',
    websiteUrl: 'https://www.amazon.co.jp/',
    affiliateProgram: 'Amazon Associates Japan',
    affiliateStatus: 'pending',
  },
  {
    title: 'Oink Games Store',
    meta: 'Publisher direct | International shipping',
    description: 'A direct path to Oink Games compact releases with globally recognizable packaging and international shipping.',
    tags: ['Publisher direct', 'Ships internationally', 'Compact games'],
    action: 'Browse seller',
    websiteUrl: 'https://oinkgames.com/en/',
  },
  {
    title: 'ZenMarket',
    meta: 'Proxy buying service | Ship purchases home',
    description: 'A visitor-friendly route for ordering from Japanese stores and marketplaces, consolidating purchases, and shipping internationally.',
    tags: ['International shipping', 'Proxy buying', 'Consolidation'],
    action: 'Plan shipment',
    websiteUrl: 'https://zenmarket.jp/en/',
    affiliateProgram: 'ZenMarket Affiliate Program',
    affiliateStatus: 'pending',
  },
  {
    title: 'Sugorokuya Online',
    meta: 'Specialist retailer | Curated catalogue',
    description: 'Online store of the Tokyo specialty retailer with indie, family, and expert-recommended games.',
    tags: ['Curated games', 'Expert picks', 'Specialist'],
    action: 'Browse seller',
    websiteUrl: 'https://sugorokuya.jp/',
  },
  {
    title: 'Engames Online Store',
    meta: 'Publisher and retailer | Toyama',
    description: 'Original Japanese games and a curated range of domestic and international titles from a regional tabletop business.',
    tags: ['Original games', 'Regional retailer', 'Publisher'],
    action: 'Browse seller',
    websiteUrl: 'https://www.engames-s.com/',
  },
  {
    title: 'Mercari',
    meta: 'Marketplace | Secondhand discovery',
    description: 'A useful resale path for rare and out-of-print games. Check seller language, payment, and delivery terms before ordering.',
    tags: ['Secondhand', 'Rare finds', 'Marketplace'],
    action: 'Browse resale',
    websiteUrl: 'https://jp.mercari.com/',
  },
  {
    title: 'Surugaya Online',
    meta: 'Secondhand specialist | Used games and collector finds',
    description: 'A major Japanese secondhand path for used games, hobby goods, and rare finds. Check condition labels and purchasing terms before ordering.',
    tags: ['Secondhand', 'Rare finds', 'Collector route'],
    action: 'Browse resale',
    websiteUrl: 'https://www.suruga-ya.jp/',
    affiliateProgram: 'Surugaya Affiliate',
    affiliateStatus: 'pending',
  },
  {
    title: 'Rakuten',
    meta: 'Marketplace | Price comparison',
    description: 'Multiple sellers, price comparison, and broad domestic inventory with payment and delivery context to explain.',
    tags: ['Multiple sellers', 'New games', 'Compare prices'],
    action: 'Browse seller',
    websiteUrl: 'https://www.rakuten.co.jp/',
    affiliateProgram: 'Rakuten Affiliate',
    affiliateStatus: 'pending',
  },
];

export const ttgjRetailers: TTGJCatalogItem[] = [
  {
    title: 'Yellow Submarine',
    meta: 'Specialist chain | Akihabara and regional stores',
    description: 'A core in-person discovery path for tabletop games, RPGs, miniatures, and hobby supplies.',
    tags: ['Specialist', 'RPG', 'Miniatures'],
    action: 'Find stores',
    websiteUrl: 'https://yellowsubmarine.co.jp/',
  },
  {
    title: 'Sugorokuya',
    meta: 'Specialist retailer | Tokyo',
    description: 'A beloved tabletop specialist with curated games, recommendations, and a strong visitor itinerary role.',
    tags: ['Curated', 'Tokyo', 'Expert advice'],
    action: 'Find stores',
    websiteUrl: 'https://sugorokuya.jp/',
  },
  {
    title: 'Mandarake',
    meta: 'Secondhand retailer | Akihabara and beyond',
    description: 'A useful collector stop for vintage games, used hobby goods, and rare finds. Check the branch guide before visiting.',
    tags: ['Secondhand', 'Rare finds', 'Collector route'],
    action: 'Find stores',
    websiteUrl: 'https://order.mandarake.co.jp/order/?lang=en',
  },
  {
    title: 'Hobby Station',
    meta: 'Retail chain | Play spaces and tournaments',
    description: 'Trading-card and board game retailer with play spaces and recurring events across several major cities.',
    tags: ['Play space', 'TCG', 'Events'],
    action: 'Find stores',
    websiteUrl: 'https://www.hbst.net/',
  },
  {
    title: 'Kappa Castle Game & Hobby',
    meta: 'Retail store | Okinawa',
    description: 'A regional Okinawa stop for tabletop games and hobby goods, useful for visitors exploring beyond the major cities.',
    tags: ['Okinawa', 'Regional', 'Live map'],
    action: 'Find stores',
    websiteUrl: 'https://www.engames-s.com/',
  },
  {
    title: 'Engames',
    meta: 'Retailer, cafe, and publisher | Toyama',
    description: 'A strong example of a connected tabletop business: physical retail, play space, publishing, and regional community support.',
    tags: ['Toyama', 'Publisher', 'Cafe'],
    action: 'Find stores',
  },
];

export const ttgjGames: TTGJCatalogItem[] = [
  {
    title: 'SCOUT',
    meta: 'Kei Kajino | One More Game! | 2-5 players | 15 min',
    description: 'A climbing card game where players can recruit cards from other formations. A strong language-light visitor recommendation.',
    tags: ['Card game', 'Language light', '2019'],
    action: 'Explore game',
  },
  {
    title: 'Love Letter',
    meta: 'Seiji Kanai | Arclight | 2-6 players | 20 min',
    description: 'A fast game of risk, deduction, and luck that became one of Japan\'s most influential modern micro-games.',
    tags: ['Card game', 'Micro-game', '2012'],
    action: 'Explore game',
  },
  {
    title: 'Deep Sea Adventure',
    meta: 'Oink Games | 2-6 players | 30 min',
    description: 'A compact push-your-luck diving game where every player shares the same dwindling oxygen supply.',
    tags: ['Party game', 'Compact', '2014'],
    action: 'Explore game',
  },
  {
    title: 'A Fake Artist Goes To New York',
    meta: 'Jun Sasaki | Oink Games | 5-10 players | 20 min',
    description: 'Everyone draws one line, but one player does not know the subject. A social game that travels well across language barriers.',
    tags: ['Party game', 'Language light', '2012'],
    action: 'Explore game',
  },
  {
    title: 'Yokohama',
    meta: 'Hisashi Hayashi | OKAZU Brand | 2-4 players | 90 min',
    description: 'A deeper strategy game about building trade routes and prestige in Meiji-era Yokohama.',
    tags: ['Strategy', 'Historic theme', '2016'],
    action: 'Explore game',
  },
  {
    title: 'Bomb Busters',
    meta: 'Hisashi Hayashi | Engames | 2-5 players | 30 min',
    description: 'A cooperative deduction game with limited communication and a strong teaching-table story for venue discovery.',
    tags: ['Cooperative', 'Deduction', '2024'],
    action: 'Explore game',
  },
];

export const ttgjExperiences: TTGJCatalogItem[] = [
  {
    title: 'Akihabara Cafe To Collection Route',
    meta: 'Half-day tabletop itinerary',
    description: 'Search for a game, visit a welcoming cafe, explore specialist stores, then finish with a secondhand collector stop.',
    tags: ['Tokyo', 'Cafe to collection', 'Visitor route'],
    action: 'Plan route',
  },
  {
    title: 'Tabletop Tokyo Starter Route',
    meta: 'First-time visitor pathway',
    description: 'A practical route connecting a specialist shop, a welcoming cafe, and an easy first table.',
    tags: ['Tokyo', 'Visitors', 'Starter route'],
    action: 'View pathway',
  },
  {
    title: 'Game Market Planning Guide',
    meta: 'Convention preparation',
    description: 'Understand what to expect, how to prepare, and how to reconnect with creators after the event.',
    tags: ['Game Market', 'Creators', 'Guide'],
    action: 'View guide',
  },
  {
    title: 'Kyushu Community Weekend',
    meta: 'Regional travel and play',
    description: 'Connect Fukuoka tabletop events, local cafes, regional sellers, and community tables into one weekend.',
    tags: ['Fukuoka', 'Regional', 'Community'],
    action: 'Plan route',
  },
  {
    title: 'Share Your Tabletop Japan Story',
    meta: 'Community stories',
    description: 'Discover tabletop Japan through trip reports, photo journals, and videos from players exploring local scenes.',
    tags: ['Trip reports', 'Photo journals', 'Moderation'],
    action: 'Review feature',
  },
];

export const ttgjGuides: TTGJCatalogItem[] = [
  {
    title: 'Best Board Game Stores In Tokyo',
    meta: 'Shopping guide | Starter editorial',
    description: 'A curated guide to Tokyo specialty stores, major hobby chains, secondhand stops, and neighborhood routes.',
    tags: ['SEO', 'Tokyo', 'Retailers'],
    action: 'Read guide',
  },
  {
    title: 'How To Visit A Board Game Cafe In Japan',
    meta: 'Beginner answer guide',
    description: 'Explain reservations, fees, etiquette, solo visits, useful phrases, and what happens when you arrive.',
    tags: ['AEO', 'Cafes', 'First visit'],
    action: 'Read guide',
  },
  {
    title: 'Board Gaming In Fukuoka',
    meta: 'Community recommendations',
    description: 'Turn local community knowledge into a practical Kyushu guide for places to play, buy, and meet people.',
    tags: ['GEO', 'Fukuoka', 'Community'],
    action: 'Read guide',
  },
  {
    title: 'Inside Japan\'s Board Game Scene',
    meta: 'Culture guide and video pathway',
    description: 'Connect tabletop cafes, indie designers, publishers, and visitor-ready itineraries into one cultural overview.',
    tags: ['Culture', 'Creators', 'Video'],
    action: 'Read guide',
  },
  {
    title: 'Can I Join A Board Game Group Alone?',
    meta: 'Confidence guide',
    description: 'Answer the questions that prevent newcomers from taking the first step into a table.',
    tags: ['AEO', 'Solo friendly', 'Groups'],
    action: 'Read guide',
  },
];
