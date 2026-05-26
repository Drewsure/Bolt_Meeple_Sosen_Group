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
  [/^18:/i, 'ten rounds of rock-paper-scissors mind games using fingers, timing, and prediction'],
  [/^7 wonders duel/i, 'a head-to-head ancient civilization contest of science, culture, military pressure, and monuments'],
  [/^7 wonders/i, 'ancient city building across three ages, with wonders, trade, science, and military rivalry'],
  [/above and below/i, 'village building above ground and storybook cave exploration below it'],
  [/acquire/i, 'hotel-chain mergers, stock ownership, and sharp corporate timing'],
  [/aeon'?s end/i, 'desperate fantasy mages defending their city from monstrous breaches'],
  [/agricola/i, 'farmstead survival, family growth, fields, animals, and scarce rural resources'],
  [/\u30a2\u30b0\u30ea\u30b3\u30e9|\u7267\u5834/i, 'small-farm planning with animals, fences, buildings, and careful two-player timing'],
  [/airlines/i, 'airline shares, route expansion, and transport-network investment'],
  [/android: netrunner/i, 'asymmetric cyberpunk hacking between a corporation and a runner'],
  [/architects of the west kingdom/i, 'medieval town construction, apprentices, debts, virtue, and worker placement'],
  [/aquatica/i, 'underwater kingdom building with manta cards, sea locations, characters, and rising ocean engines'],
  [/ark nova/i, 'modern zoo planning, animal conservation, sponsorships, and habitat building'],
  [/auztralia/i, 'an alternate-history Australian frontier where rail building and farming meet sleeping ancient horrors'],
  [/azul/i, 'Portuguese tile artistry, pattern drafting, and elegant mosaic construction'],
  [/baaaaa/i, 'a silly sheep-themed deduction puzzle where players interpret clues and chase the right flock'],
  [/bananagrams/i, 'fast word-building with letter tiles and table-wide vocabulary pressure'],
  [/barbarossa/i, 'clay sculpture riddles, guessing, and playful creative misdirection'],
  [/b.renpark|barenpark|baerenpark/i, 'building a bear park full of habitats, paths, and attraction tiles'],
  [/beasts of balance/i, 'stacking magical animals while a connected digital ecosystem reacts to each creature'],
  [/beat that/i, 'family dexterity challenges using cups, balls, household objects, and playful physical tasks'],
  [/betrayal at house on the hill/i, 'haunted-house exploration that turns into a sudden horror scenario with a hidden traitor'],
  [/beyond the sun/i, 'humanity researching technologies, colonizing space, and competing over future civilization paths'],
  [/big city/i, 'urban planning, neighborhoods, streetcars, parks, factories, and large city development'],
  [/bingo/i, 'number calling, pattern spotting, and simple table anticipation'],
  [/bitoku/i, 'spiritual forest stewardship with pilgrims, yokai, dice, crystals, and sacred paths'],
  [/blokus/i, 'abstract territory control with colorful polyomino pieces and tight spatial blocking'],
  [/bloody inn/i, 'darkly comic innkeeping where players manage guests, accomplices, and criminal timing'],
  [/boooop|boop/i, 'cats and kittens bouncing each other around a bed in a gentle abstract placement puzzle'],
  [/bounce-off/i, 'bouncing balls into target patterns in a quick dexterity contest'],
  [/bounty/i, 'chasing targets, collecting rewards, and weighing risk against payout'],
  [/brainbox: art/i, 'memory challenges built around famous artworks, observation, and quick recall'],
  [/brainbox: english/i, 'English vocabulary and observation challenges with memory-card prompts'],
  [/brass: birmingham/i, 'industrial-era Birmingham, canal and rail networks, coal, iron, beer, and manufactured goods'],
  [/brass/i, 'industrial revolution industry building, transport links, markets, and economic timing'],
  [/camel up/i, 'a chaotic desert camel race where players bet on a shifting stack of racing camels'],
  [/calico/i, 'quilting patterns, colored fabric tiles, buttons, and cats looking for cozy places'],
  [/camp pinetop/i, 'summer-camp exploration with badges, trails, outdoor skills, and friendly achievement'],
  [/carcassonne/i, 'a growing medieval countryside of roads, cities, monasteries, farms, and tactical meeple claims'],
  [/cartographers/i, 'fantasy map drawing, terrain planning, scoring edicts, and frontier ambushes'],
  [/cascadia/i, 'Pacific Northwest habitat building with wildlife patterns and landscape conservation'],
  [/castle combo/i, 'castle-and-village card combinations, character timing, and compact tableau building'],
  [/castles of burgundy/i, 'estate building in medieval Burgundy through dice planning, tiles, trade, and development'],
  [/cat in the box/i, 'quantum trick-taking where cards gain suits only when players declare them'],
  [/catan/i, 'settling an island through roads, towns, resource trade, and robber-driven negotiation'],
  [/celestial rainbows/i, 'colorful sky patterns, light arrangement, and gentle abstract planning'],
  [/charterstone/i, 'legacy village building where a shared town grows through buildings, workers, and discoveries'],
  [/cheating moth/i, 'comic card shedding where sneaky rule-breaking is part of the challenge'],
  [/chess/i, 'classic abstract warfare built around pieces, threats, sacrifices, and positional planning'],
  [/citadels/i, 'medieval city building with hidden roles, gold, districts, and character powers'],
  [/clank/i, 'fantasy dungeon treasure hunting where every greedy move risks waking the dragon'],
  [/clue|cluedo/i, 'mansion murder deduction with suspects, rooms, weapons, and evidence tracking'],
  [/clover bouquet|^clover$/i, 'cooperative word association where clue relationships are arranged like a four-leaf clover'],
  [/codinca/i, 'Mayan-style tile manipulation with rotating symbols and pattern goals'],
  [/codenames/i, 'spy-team clue giving, word association, and careful table communication'],
  [/concept/i, 'visual clue-giving with icons, categories, and shared deduction'],
  [/concordia/i, 'Roman-era trade expansion across the Mediterranean through cards, colonists, goods, and provinces'],
  [/confusion/i, 'Cold War espionage with uncertain movement rules, deduction, and spy-vs-spy positioning'],
  [/connect four/i, 'vertical four-in-a-row tactics with simple threats and blocking decisions'],
  [/costa rica/i, 'jungle exploration, wildlife photography, and push-your-luck expedition timing'],
  [/coup/i, 'courtly bluffing, hidden roles, influence, and sudden political takedowns'],
  [/cracked/i, 'egg-themed risk taking, quick reactions, and light party-game pressure'],
  [/cranium cadoo/i, "children's party challenges mixing drawing, acting, word clues, and creative tasks"],
  [/crew: mission deep sea/i, 'cooperative underwater trick-taking with limited communication and mission objectives'],
  [/crew: the quest for planet nine/i, 'cooperative space-mission trick-taking with strict communication limits'],
  [/cryptid: urban legends/i, 'two-player hidden-creature deduction across a city map of clues and misdirection'],
  [/cryptid/i, 'deducing the hidden habitat of a mysterious creature from overlapping geographic clues'],
  [/cubirds/i, 'collecting flocks of birds through clever hand management and row manipulation'],
  [/cult following/i, 'absurd persuasion where players invent strange beliefs and sell them to the table'],
  [/da vinci'?s mancala/i, 'mancala-style movement wrapped in Renaissance invention and pattern control'],
  [/dark moon/i, 'space-station paranoia with hidden infection, team votes, and survival pressure'],
  [/decrypto/i, 'codebreaking and team word clues under spy-agency pressure'],
  [/deep sea adventure/i, "shared-submarine treasure diving where greed drains everyone's oxygen"],
  [/desperados of dice town/i, 'cartoon Western dice duels with outlaws, jail breaks, and quick risks'],
  [/dice forge/i, 'mythic hero competition where players upgrade the faces of their dice'],
  [/villainous/i, 'Disney villains pursuing their own story goals while interfering with rivals'],
  [/dixit/i, 'dreamlike picture cards, poetic clues, and imaginative interpretation'],
  [/dobble|spot it/i, 'rapid visual matching and reflex-driven pattern recognition'],
  [/dog park/i, 'walking dogs, collecting breeds, and managing routes through a friendly park'],
  [/dominion/i, 'building a medieval kingdom through deck construction, treasure, actions, and estates'],
  [/draftosaurus/i, 'drafting dinosaur meeples into zoo pens for quick spatial scoring'],
  [/dream home/i, 'designing a house room by room with decor, roofs, and family-friendly planning'],
  [/duck & cover/i, 'rubber-duck card positioning with quick number calls and compact spatial choices'],
  [/dune: imperium/i, 'political struggle on Arrakis through deck-building, worker placement, factions, spice, and conflict'],
  [/earth\b/i, 'building a living ecosystem of plants, terrain, habitats, and growth engines'],
  [/eclipse/i, 'galactic expansion, alien civilizations, ship upgrades, exploration, and space warfare'],
  [/ecos: first continent/i, 'shaping a new continent with land, water, animals, and ecological scoring'],
  [/ecosystem/i, 'building a balanced natural food web from habitats and animal cards'],
  [/elephant ball/i, 'balancing objects and testing steady hands in a playful physical challenge'],
  [/emojito/i, 'reading emotions, expressions, and silly faces from illustrated prompt cards'],
  [/escape the labyrinth/i, 'navigating a shifting maze while racing to collect treasures and avoid dead ends'],
  [/everdell/i, 'woodland city building with charming critter workers and seasonal tableau growth'],
  [/evolution/i, 'adapting species with traits, food pressure, predators, and survival choices'],
  [/exit: the game/i, 'escape-room puzzles, clues, locks, and story-driven problem solving'],
  [/exploding kittens/i, 'chaotic card avoidance with attacks, skips, defuses, and cartoon danger'],
  [/express 01/i, 'train-themed route timing and compact transportation decisions'],
  [/fake artist/i, 'hidden-role drawing where one player pretends to understand the shared prompt'],
  [/fantasy realms/i, 'building a powerful fantasy hand from kingdoms, creatures, artifacts, and combos'],
  [/fast forward: fortress/i, 'a card-driven fortress challenge that reveals rules gradually as players continue'],
  [/first contact/i, 'alien-human communication through symbols, guesses, and cross-cultural deduction'],
  [/flip 7/i, 'press-your-luck number flipping where one duplicate can end the whole turn'],
  [/floriferous/i, 'a quiet garden walk of flowers, stones, sunlight, and set collection'],
  [/fluxx/i, 'constantly changing card rules, goals, keepers, and table conditions'],
  [/for northwood/i, 'solo woodland trick-taking with animal rulers and diplomatic visits'],
  [/forbidden island/i, 'cooperative treasure recovery on a sinking island of shifting danger'],
  [/for sale/i, 'property auctions followed by quick resale timing'],
  [/foreign king/i, 'Belgian industrial and political development through railroads and faction pressure'],
  [/forest shuffle/i, 'forest ecology with trees, animals, habitats, and multi-use cards'],
  [/forgotten waters/i, 'pirate adventure storytelling with ship roles, choices, quests, and comic narration'],
  [/\u30d5\u30ec\u30fc\u30e0\u30ef\u30fc\u30af/i, 'abstract tile placement where connected frames and colored tasks score through careful pattern building'],
  [/friday/i, 'solo island survival where Robinson improves through deck-building and repeated mistakes'],
  [/frosthaven/i, 'a large fantasy campaign of tactical battles, settlement growth, crafting, and harsh expeditions'],
  [/galaxy command/i, 'space-fleet orders, tactical missions, and command decisions'],
  [/galaxy trucker/i, 'building a ridiculous spaceship before sending it through meteors, pirates, and cargo runs'],
  [/^the game$/i, 'cooperative number sequencing where the table tries to keep four piles alive'],
  [/game of life/i, 'life-path choices about jobs, families, money, and lucky turns'],
  [/geistesblitz|ghost blitz/i, 'speedy object grabbing based on color, shape, and visual logic'],
  [/get on board/i, 'city bus-route drawing through passengers, landmarks, traffic, and urban planning'],
  [/gaia project/i, 'space-faring factions colonizing planets and upgrading a shared galactic economy'],
  [/ginkgopolis/i, 'future eco-city construction through vertical urban planning and card-driven expansion'],
  [/gloom in space/i, 'tragic comic storytelling moved into a gloomy science-fiction crew'],
  [/^gloom$/i, 'macabre storytelling where families suffer wonderfully terrible events before their final fate'],
  [/^go$/i, 'ancient abstract territory building through stones, influence, connection, and capture'],
  [/go fish/i, 'simple set collection through asking for ranks and remembering who has which cards'],
  [/gobblers/i, 'stacking abstract pieces that cover and uncover a three-in-a-row board'],
  [/great western trail/i, 'cattle driving across the American West with rail delivery and deck improvement'],
  [/grizzled/i, 'cooperative World War I survival about hardship, morale, support, and avoiding too many threats'],
  [/guess who/i, 'face-based deduction through yes-or-no questions and elimination'],
  [/hanabi/i, 'cooperative fireworks creation using limited clues and shared memory'],
  [/le havre/i, 'two-player harbor economics with buildings, goods, shipping, and inland production'],
  [/heat: pedal/i, '1960s-style motor racing with speed management, corners, heat, and daring overtakes'],
  [/hedbanz/i, 'guessing the card on your head through questions and category clues'],
  [/herd mentality/i, 'party questions where the safest answer is the one most people choose'],
  [/high society/i, 'luxury auctions, social prestige, and the danger of spending too much to look important'],
  [/^hive/i, 'abstract insect movement with ants, beetles, spiders, grasshoppers, and queen control'],
  [/hot streak/i, 'push-your-luck wagering built around runs, streaks, and timing'],
  [/hyper super yoga|yoga/i, 'silly physical pose challenges where players stretch into increasingly absurd positions'],
  [/^iki$/i, 'life in Edo-period Nihonbashi through artisans, street shops, fires, and seasonal planning'],
  [/in front of the elevators/i, 'queue management as passengers line up for elevators with timing and position choices'],
  [/influentia/i, 'Renaissance influence, faction pressure, and card-driven political maneuvering'],
  [/^the island$/i, 'escape from a sinking island while sea creatures threaten fleeing explorers'],
  [/isle of monsters/i, 'raising, feeding, and showing unusual monsters for festival scoring'],
  [/isle of skye/i, 'Scottish clan territory building through tile pricing and landscape scoring'],
  [/jaipur/i, 'two-player market trading with camels, goods, timing, and set collection'],
  [/jenga/i, 'wooden tower tension, steady hands, and risky block removal'],
  [/just one/i, 'cooperative party word clues where duplicate hints cancel out'],
  [/jungli-la/i, 'jungle pathfinding and expedition movement through changing routes'],
  [/junk art/i, 'world-tour dexterity sculpture challenges with strange pieces and unstable builds'],
  [/^k2/i, 'mountain climbing where teams manage altitude, weather, tents, and survival risk'],
  [/kalah/i, 'traditional mancala seed movement, captures, and counting tactics'],
  [/kanagawa/i, 'painting lessons, seasonal landscapes, studio growth, and Japanese art composition'],
  [/keyflower/i, 'village development, worker auctions, transport, and seasonal production'],
  [/kingdomino/i, 'domino-style kingdom building with terrain crowns and compact spatial choices'],
  [/konja/i, 'shamanic dice and ingredient gathering for magical rituals and clever timing'],
  [/labyrinth/i, 'a changing maze of paths, treasures, and route planning'],
  [/lanterns/i, 'floating lantern festivals, lake tiles, color dedication, and set collection'],
  [/let'?s catch the lion/i, 'a small shogi-style animal chess game about lions, chicks, and careful movement'],
  [/llamaland/i, 'mountain farming with llamas, crops, terraces, and stacked landscape tiles'],
  [/lord of the rings: duel/i, 'two-player Middle-earth conflict over alliances, quests, military pressure, and the Ring'],
  [/la granja/i, 'Mallorcan farm management, market deliveries, and multi-use cards'],
  [/lost cities/i, 'expedition planning, risky investment, and tense two-player hand management'],
  [/love letter/i, 'court intrigue, deduction, and tiny-card bluffing around a royal message'],
  [/make '?n'? break/i, 'building block structures against the clock from visual construction cards'],
  [/mastermind/i, 'code-breaking deduction with colored pegs and feedback patterns'],
  [/math fluxx/i, 'changing rules and goals built around numbers, operations, and quick arithmetic'],
  [/mechanica/i, 'factory automation with conveyor tiles, cleaning robots, and production lines'],
  [/medical frontier/i, 'medical research and treatment planning with science-themed decisions'],
  [/menara/i, 'cooperative temple construction with columns, floors, and fragile dexterity balance'],
  [/micro dojo/i, 'tiny dojo management with workers, resources, and efficient two-player planning'],
  [/micropolis/i, 'ant colony building with tunnels, soldiers, queens, and underground scoring'],
  [/^the mind$/i, 'silent cooperative timing where players place numbers in order without talking'],
  [/modern art/i, 'art auctions, market fashion, and reading the value of each artist'],
  [/modern society/i, 'urban life, social systems, and modern community decisions'],
  [/monopoly junior/i, 'simple property buying, rent, and money practice for younger players'],
  [/monster meister/i, 'monster collecting, quick recognition, and light family tactics'],
  [/munchkin/i, 'comic dungeon adventuring full of loot, monsters, betrayal, and ridiculous card effects'],
  [/my little scythe/i, 'friendly animal kingdoms using quests, pies, trophies, and gentle area control'],
  [/narabi/i, 'cooperative card ordering with hidden movement restrictions'],
  [/near and far/i, 'fantasy travel, quests, town visits, and storybook adventure across a campaign map'],
  [/not alone/i, 'one-against-many survival on an alien planet where a creature hunts stranded explorers'],
  [/now or never/i, 'fantasy town rebuilding, exploration, villagers, and story-driven missions'],
  [/ono 99/i, 'counting-card tension where players avoid pushing the shared total too high'],
  [/orl.ans/i, 'medieval French development through bag-building, trade routes, monks, knights, and citizens'],
  [/ostia/i, 'Roman harbor logistics, ships, warehouses, and maritime trade planning'],
  [/othello/i, 'classic disk-flipping territory tactics with corners, edges, and reversals'],
  [/pagoda/i, 'two-player pagoda construction with columns, colors, and tactical card play'],
  [/pandemic legacy/i, 'campaign-driven global disease response where the world map and rules permanently change'],
  [/pandemic/i, 'global disease outbreaks, crisis response, specialist roles, and cooperative containment'],
  [/pass the pigs/i, 'pig-dice rolling, risk-taking, and funny scoring positions'],
  [/patchwork/i, 'two-player quilt making with fabric tiles, buttons, and time-track efficiency'],
  [/\u305d\u308c\u306f\u30aa\u30ec\u306e\u9b5a/i, 'penguins hopping across melting ice floes to claim fish before escape routes vanish'],
  [/pendulum/i, 'real-time worker placement using sand timers, provinces, votes, and resource pressure'],
  [/photosynthesis/i, 'forest growth where trees compete for sunlight across a rotating sun path'],
  [/pictionary/i, 'drawing clues under time pressure so teammates can guess the answer'],
  [/pirate box/i, 'pirate treasure, secret boxes, and light push-your-luck choices'],
  [/planet unknown/i, 'polyomino planet development, resource tracks, rovers, and asteroid cleanup'],
  [/poison/i, 'potion cauldrons, color suits, and trick-taking style risk management'],
  [/poker/i, 'classic betting, hand ranking, bluffing, odds, and reading opponents'],
  [/power grid/i, 'electric utility auctions, fuel markets, city networks, and supply management'],
  [/puerto rico/i, 'colonial-era plantation production, shipping, buildings, and role selection'],
  [/quacks/i, 'push-your-luck potion brewing with ingredient bags and explosive cauldrons'],
  [/quest for el dorado/i, 'deck-building expedition racing through jungle terrain toward the lost city'],
  [/quickpick/i, 'speedy visual choice-making with monsters, masks, dinosaurs, and quick reactions'],
  [/ra\b/i, 'ancient Egyptian auctions around dynasties, monuments, floods, gods, and disasters'],
  [/race for the galaxy/i, 'space civilization development through planets, technologies, and simultaneous role selection'],
  [/raiders of the north sea/i, 'Viking raids, crew hiring, provisions, plunder, and village preparation'],
  [/red cathedral/i, "constructing St. Basil's Cathedral through dice rondels, resources, and workshop planning"],
  [/rhino hero/i, 'superhero tower building with folded cards, shaky floors, and dexterity tension'],
  [/^risk$/i, 'world-map conquest with armies, territories, dice battles, and alliances'],
  [/robin hood/i, 'outlaw adventure, Merry Men, quests, archery, and forest reputation'],
  [/robinson crusoe/i, 'cooperative island survival with shelter, exploration, inventions, weather, and danger'],
  [/root/i, 'asymmetric woodland warfare where factions pursue very different routes to power'],
  [/rubik'?s battle/i, 'fast pattern matching with cube-style colors and head-to-head reaction speed'],
  [/ruins/i, 'exploring ancient remains, uncovering risks, and managing expedition choices'],
  [/rumble nation/i, 'feudal-Japan area majority battles driven by dice placement and tactical timing'],
  [/rummikub/i, 'number-tile sets and runs that reward rearranging the whole table cleverly'],
  [/rush hour shift/i, 'traffic-jam sliding puzzles turned into a head-to-head route race'],
  [/saboteur/i, 'dwarven tunnel building with hidden traitors, blocked paths, and gold hunting'],
  [/^sail$/i, 'two-player cooperative trick-taking about steering a ship through dangerous waters'],
  [/san juan/i, 'Puerto Rico-style card city building with production, trading, and role selection'],
  [/sagrada/i, 'stained-glass window drafting with colored dice and placement restrictions'],
  [/scattergories/i, 'category lists, starting letters, and fast vocabulary recall'],
  [/^scout$/i, 'circus-themed ladder climbing where players improve their hand by scouting better acts'],
  [/scythe/i, 'alternate-history Eastern Europe with factions, engines, territory, and restrained conflict'],
  [/sea salt & paper/i, 'origami sea-life card collection with sets, pairs, and a sharp stop-or-continue choice'],
  [/search for planet x/i, 'astronomical deduction using research actions, sectors, and hidden-object logic'],
  [/seasons/i, 'fantasy mage duels with dice drafting, seasons, energy, and card combinations'],
  [/secret hitler/i, 'hidden-role political deduction with elections, policies, trust, and accusations'],
  [/seven!/i, 'number and timing tactics around the pressure of reaching seven'],
  [/shotzee/i, 'dice combinations adapted into a party drinking-game format'],
  [/shut the box/i, 'traditional dice-and-number tile puzzle about closing values efficiently'],
  [/skull/i, 'biker-gang bluffing with roses, skulls, bids, and nerve'],
  [/skull king/i, 'pirate trick-taking with bids, mermaids, skull kings, and risky predictions'],
  [/sky team/i, 'two-player cooperative airplane landing with dice placement and cockpit coordination'],
  [/slap it/i, 'fast reaction matching with silly prompts and table-slapping speed'],
  [/sleeping gods/i, 'open-world nautical adventure, exploration, quests, and campaign discovery'],
  [/small world/i, 'fantasy civilization conquest where quirky races rise, expand, and decline'],
  [/smartphone inc/i, 'smartphone manufacturing, pricing, technology upgrades, and global market competition'],
  [/snakes & ladders/i, 'classic luck-driven climbing and sliding across a numbered path'],
  [/solitaire/i, 'solo card ordering, patience, and pattern management'],
  [/space alert/i, 'real-time cooperative spaceship defense with programmed actions and incoming threats'],
  [/spaghetti/i, 'tangled noodle dexterity where players pull strands carefully without disturbing the pile'],
  [/spirit island/i, 'island spirits defending their land from colonizing invaders through asymmetric powers'],
  [/splendor/i, 'Renaissance gem trading, engine building, noble patronage, and efficient purchases'],
  [/squint/i, 'creating pictures from simple shapes so teammates can identify the clue'],
  [/stone age/i, 'prehistoric worker placement with food, tools, huts, agriculture, and resources'],
  [/stratego/i, 'hidden-rank battlefield movement with flags, bombs, scouts, and deduction'],
  [/suburbia/i, 'city-building tiles where neighborhoods, income, reputation, and civic planning interact'],
  [/suddenly stoned/i, 'adult party prompts built around altered attention and silly challenges'],
  [/survive/i, 'escaping a sinking island while boats, swimmers, sharks, whales, and sea monsters interfere'],
  [/sushi go party/i, 'a party-sized sushi drafting menu with desserts, specials, and combo scoring'],
  [/sushi go/i, 'quick sushi card drafting with maki rolls, dumplings, tempura, sashimi, and pudding'],
  [/taco cat goat cheese pizza/i, 'chaotic rhythm chanting, card matching, and slap-the-pile reflexes'],
  [/targi/i, 'two-player Tuareg tribe trading with desert goods, border actions, and tableau building'],
  [/tawantinsuyu/i, 'Inca empire planning with workers, gods, statues, tapestries, and mountain strategy'],
  [/terraforming mars/i, 'corporate Mars terraforming through oceans, forests, cities, heat, oxygen, and project cards'],
  [/things in rings/i, 'deducing secret Venn-diagram rules by placing strange objects into overlapping rings'],
  [/think again/i, 'party questions where the trick is often to answer against instinct'],
  [/through the ages/i, 'civilization development through leaders, technologies, wonders, military, and culture'],
  [/ticket to ride/i, 'railway route building, destination tickets, and map-spanning network planning'],
  [/tiny epic tactics/i, 'small-box fantasy skirmishes with terrain, heroes, tactics, and positioning'],
  [/tokaido/i, 'a peaceful Japanese journey of meals, views, hot springs, souvenirs, and encounters'],
  [/tokyo.?crossing/i, 'busy Tokyo street-crossing movement with timing, routes, and urban flow'],
  [/tomatomato/i, 'tongue-twisting tomato phrases that get harder as the silly sentence grows'],
  [/topiary/i, 'garden-view planning where visitors admire shaped hedges in the best sight lines'],
  [/topminos/i, 'domino-style tile placement with compact spatial scoring'],
  [/toy battle/i, 'toy-soldier area control with quick tactical deployment and battlefield pressure'],
  [/tranquility/i, 'silent cooperative sea voyage built from numbered island cards and careful placement'],
  [/trio/i, 'deduction and memory around finding matching sets of three cards'],
  [/twilight struggle/i, 'Cold War superpower influence, events, coups, and ideological pressure across the world map'],
  [/twirk/i, 'twisting physical party challenges and quick body-position prompts'],
  [/twister/i, 'physical color-and-limb movement that turns the mat into a balance challenge'],
  [/ubongo/i, 'fast geometric puzzle solving with tiles, shapes, and race-against-the-clock pressure'],
  [/^uno$/i, 'classic color-and-number card shedding with reverses, skips, draw cards, and table timing'],
  [/vast/i, 'asymmetric fantasy adventure where each role plays by different rules inside a dangerous location'],
  [/verflucht/i, 'quick haunted-card survival with cursed rooms and push-your-luck danger'],
  [/very silly sentences/i, 'grammar and sentence building with intentionally funny word combinations'],
  [/virus!/i, 'cartoon organ cards, infections, treatments, and racing to complete a healthy body'],
  [/viticulture/i, 'Tuscan winemaking, vineyards, workers, visitors, grapes, and seasonal planning'],
  [/way 2 go/i, 'team communication and route guidance where players give limited directions under pressure'],
  [/werewolves/i, 'village social deduction with hidden werewolves, villagers, night actions, and accusations'],
  [/white castle/i, 'Himeji Castle worker placement with dice bridges, courtiers, gardeners, and clan influence'],
  [/wizards wanted/i, 'wandering wizards fulfilling magical jobs, collecting ingredients, and managing reputation'],
  [/world'?s fair/i, "Chicago World's Fair exhibits, midway tickets, influential supporters, and area majority"],
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
  return `${baseTitle(title)}'s table situation, where players describe what they see, choose a move, and explain the reason`;
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
