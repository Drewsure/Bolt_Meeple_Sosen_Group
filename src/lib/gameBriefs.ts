import type { Game } from '../types/database';

function playerPhrase(game: Pick<Game, 'min_players' | 'max_players'>) {
  const minimum = game.min_players;
  const maximum = game.max_players;

  if (!minimum || !maximum) return 'flexible table groups';
  if (minimum === 1 && maximum === 1) return 'solo play';
  if (minimum === 1) return `solo to ${maximum} players`;
  if (minimum === maximum) return `${minimum} players`;
  if (maximum >= 8) return `large groups of ${minimum}-${maximum}`;
  return `${minimum}-${maximum} players`;
}

function durationPhrase(duration: number | null) {
  if (!duration) return 'open-ended';
  if (duration <= 15) return `rapid ${duration}-minute`;
  if (duration <= 30) return `quick ${duration}-minute`;
  if (duration <= 60) return `focused ${duration}-minute`;
  if (duration <= 90) return `extended ${duration}-minute`;
  return `deep ${duration}-minute`;
}

function complexityPhrase(complexity: string | null) {
  if (complexity === 'Master') return 'heavy strategic';
  if (complexity === 'Advanced') return 'strategic';
  if (complexity === 'Intermediate') return 'tactical';
  return 'gateway-friendly';
}

function rankingPhrase(rank: number | null) {
  if (!rank) return '';
  if (rank <= 100) return 'top-ranked ';
  if (rank <= 500) return 'highly regarded ';
  if (rank <= 1000) return 'well-regarded ';
  return '';
}

function languagePhrase(languageDependence: string | null) {
  const dependence = languageDependence ?? '';
  if (dependence.includes('No necessary')) {
    return 'no required in-game text, making it strong for English table talk';
  }
  if (dependence.includes('Some necessary')) {
    return 'light reading needs that can be supported with a small phrase sheet';
  }
  if (dependence.includes('Moderate')) {
    return 'moderate text demands suited to guided vocabulary support';
  }
  if (dependence.includes('Extensive') || dependence.includes('Unplayable')) {
    return 'heavy language demands best handled with translation aids or guided play';
  }
  return 'language requirements to confirm before session planning';
}

function baseTitle(title: string) {
  return title.split(/[:\u2013-]/)[0].trim();
}

const themeOverrides: Array<[RegExp, string]> = [
  [/^10 days/i, 'a map-building travel puzzle about linking cities into a continuous route'],
  [/^7 wonders duel/i, 'a head-to-head ancient civilization contest of science, culture, military pressure, and monuments'],
  [/^7 wonders/i, 'ancient city building across three ages, with wonders, trade, science, and military rivalry'],
  [/above and below/i, 'village building above ground and storybook cave exploration below it'],
  [/acquire/i, 'hotel-chain mergers, stock ownership, and sharp corporate timing'],
  [/aeon'?s end/i, 'desperate fantasy mages defending their city from monstrous breaches'],
  [/agricola/i, 'farmstead survival, family growth, fields, animals, and scarce rural resources'],
  [/airlines/i, 'airline shares, route expansion, and transport-network investment'],
  [/android: netrunner/i, 'asymmetric cyberpunk hacking between a corporation and a runner'],
  [/ark nova/i, 'modern zoo planning, animal conservation, sponsorships, and habitat building'],
  [/azul/i, 'Portuguese tile artistry, pattern drafting, and elegant mosaic construction'],
  [/bananagrams/i, 'fast word-building with letter tiles and table-wide vocabulary pressure'],
  [/barenpark|baerenpark/i, 'building a bear park full of habitats, paths, and attraction tiles'],
  [/brass: birmingham/i, 'industrial-era Birmingham, canal and rail networks, coal, iron, beer, and manufactured goods'],
  [/brass/i, 'industrial revolution industry building, transport links, markets, and economic timing'],
  [/camel up/i, 'a chaotic desert camel race where players bet on a shifting stack of racing camels'],
  [/carcassonne/i, 'a growing medieval countryside of roads, cities, monasteries, farms, and tactical meeple claims'],
  [/catan/i, 'settling an island through roads, towns, resource trade, and robber-driven negotiation'],
  [/clank/i, 'fantasy dungeon treasure hunting where every greedy move risks waking the dragon'],
  [/codenames/i, 'spy-team clue giving, word association, and careful table communication'],
  [/concept/i, 'visual clue-giving with icons, categories, and shared deduction'],
  [/coup/i, 'courtly bluffing, hidden roles, influence, and sudden political takedowns'],
  [/decrypto/i, 'codebreaking and team word clues under spy-agency pressure'],
  [/dobble|spot it/i, 'rapid visual matching and reflex-driven pattern recognition'],
  [/dominion/i, 'building a medieval kingdom through deck construction, treasure, actions, and estates'],
  [/eclipse/i, 'galactic expansion, alien civilizations, ship upgrades, exploration, and space warfare'],
  [/everdell/i, 'woodland city building with charming critter workers and seasonal tableau growth'],
  [/for sale/i, 'property auctions followed by quick resale timing'],
  [/gaia project/i, 'space-faring factions colonizing planets and upgrading a shared galactic economy'],
  [/ginkgopolis/i, 'future eco-city construction through vertical urban planning and card-driven expansion'],
  [/great western trail/i, 'cattle driving across the American West with rail delivery and deck improvement'],
  [/hanabi/i, 'cooperative fireworks creation using limited clues and shared memory'],
  [/high society/i, 'luxury auctions, social prestige, and the danger of spending too much to look important'],
  [/isle of skye/i, 'Scottish clan territory building through tile pricing and landscape scoring'],
  [/jaipur/i, 'two-player market trading with camels, goods, timing, and set collection'],
  [/just one/i, 'cooperative party word clues where duplicate hints cancel out'],
  [/keyflower/i, 'village development, worker auctions, transport, and seasonal production'],
  [/kingdomino/i, 'domino-style kingdom building with terrain crowns and compact spatial choices'],
  [/la granja/i, 'Mallorcan farm management, market deliveries, and multi-use cards'],
  [/lost cities/i, 'expedition planning, risky investment, and tense two-player hand management'],
  [/love letter/i, 'court intrigue, deduction, and tiny-card bluffing around a royal message'],
  [/modern art/i, 'art auctions, market fashion, and reading the value of each artist'],
  [/pandemic/i, 'global disease outbreaks, crisis response, specialist roles, and cooperative containment'],
  [/patchwork/i, 'two-player quilt making with fabric tiles, buttons, and time-track efficiency'],
  [/power grid/i, 'electric utility auctions, fuel markets, city networks, and supply management'],
  [/puerto rico/i, 'colonial-era plantation production, shipping, buildings, and role selection'],
  [/ra\b/i, 'ancient Egyptian auctions around dynasties, monuments, floods, gods, and disasters'],
  [/race for the galaxy/i, 'space civilization development through planets, technologies, and simultaneous role selection'],
  [/sagrada/i, 'stained-glass window drafting with colored dice and placement restrictions'],
  [/scythe/i, 'alternate-history Eastern Europe with factions, engines, territory, and restrained conflict'],
  [/skull/i, 'biker-gang bluffing with roses, skulls, bids, and nerve'],
  [/sleeping gods/i, 'open-world nautical adventure, exploration, quests, and campaign discovery'],
  [/splendor/i, 'Renaissance gem trading, engine building, noble patronage, and efficient purchases'],
  [/terraforming mars/i, 'corporate Mars terraforming through oceans, forests, cities, heat, oxygen, and project cards'],
  [/ticket to ride/i, 'railway route building, destination tickets, and map-spanning network planning'],
  [/tokaido/i, 'a peaceful Japanese journey of meals, views, hot springs, souvenirs, and encounters'],
  [/viticulture/i, 'Tuscan winemaking, vineyards, workers, visitors, grapes, and seasonal planning'],
  [/wingspan/i, 'bird sanctuary building with habitats, eggs, food, and ecological engine growth'],
];

function themePhrase(title: string, itemType: string) {
  const matched = themeOverrides.find(([pattern]) => pattern.test(title));
  if (matched) {
    return matched[1];
  }

  const normalized = title.toLowerCase();
  if (normalized.includes('rail') || normalized.includes('train')) return 'transport networks, routes, cargo, and timing';
  if (normalized.includes('castle') || normalized.includes('kingdom')) return 'kingdom building, territory, and courtly competition';
  if (normalized.includes('zoo') || normalized.includes('animal')) return 'animals, habitats, collections, and careful stewardship';
  if (normalized.includes('mars') || normalized.includes('space') || normalized.includes('galaxy')) return 'science-fiction expansion, exploration, and long-range planning';
  if (normalized.includes('farm') || normalized.includes('garden')) return 'rural production, growth, and resource management';
  if (normalized.includes('market') || normalized.includes('stock') || normalized.includes('trade')) return 'markets, trade, money pressure, and opportunistic timing';
  if (normalized.includes('war') || normalized.includes('battle')) return 'conflict, positioning, and tactical pressure';
  if (itemType === 'expansion') return `new material for ${baseTitle(title)}, broadening its setting and table decisions`;
  return 'a distinct tabletop setting with decisions that can be turned into useful English conversation';
}

function oldGeneratedDescription(description: string, title: string) {
  return description.startsWith(`${title} is a `) || description.startsWith(`Expansion content for ${baseTitle(title)}, adding `);
}

export function buildGameBrief(game: Game) {
  if (game.description?.trim() && !oldGeneratedDescription(game.description.trim(), game.title)) {
    return game.description;
  }

  const rank = rankingPhrase(game.bgg_rank);
  const duration = durationPhrase(game.duration_minutes);
  const complexity = complexityPhrase(game.complexity_level);
  const players = playerPhrase(game);
  const language = languagePhrase(game.language_dependence);
  const theme = themePhrase(game.title, game.item_type);

  if (game.item_type === 'expansion') {
    return `${game.title} adds ${theme}. It expands ${baseTitle(game.title)} with ${complexity} options for ${players}, with ${language}.`;
  }

  return `${game.title} is about ${theme}. It plays as a ${rank}${duration} ${complexity} game for ${players}, with ${language}.`;
}
