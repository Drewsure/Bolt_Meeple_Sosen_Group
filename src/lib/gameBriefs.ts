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

export function buildGameBrief(game: Game) {
  if (game.description?.trim()) {
    return game.description;
  }

  const rank = rankingPhrase(game.bgg_rank);
  const duration = durationPhrase(game.duration_minutes);
  const complexity = complexityPhrase(game.complexity_level);
  const players = playerPhrase(game);
  const language = languagePhrase(game.language_dependence);

  if (game.item_type === 'expansion') {
    return `Expansion content for ${baseTitle(game.title)}, adding ${complexity} options for ${players} with ${language}.`;
  }

  return `${game.title} is a ${rank}${duration} ${complexity} title for ${players}, with ${language}.`;
}
