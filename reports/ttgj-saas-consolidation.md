# TTGJ SaaS Consolidation

## Foundation Sources

- Main database: `D:\TABLE TOP GAMES JAPAN PROJECT\## FEB26_UPDATED 3 SHEET - master_database - Copy.xlsx`
- Project vault: `D:\TABLE TOP GAMES JAPAN PROJECT`
- Obsidian strategy vault: `D:\Obsidian\SECOND BRAIN`
- Current working app: `Bolt_Meeple_Sosen_Group`
- GitHub reference attempts:
  - `Drewsure/tabletop-japan`
  - `Drewsure/TableTop-Games-Japan`
  - `Drewsure/TableTop-Games-Japan-aistudio-version-`
- Lovable reference project:
  - `https://lovable.dev/projects/a001f894-a54c-4f7e-8abd-72a124e7d960`

## Product Thesis

TableTop Games Japan should be participation infrastructure, not only a directory.

The strongest opportunity is helping people confidently enter Japan's analog game communities. The product should combine public discovery, beginner onboarding, venue/event intelligence, and a paid partner dashboard.

## Project Compass: From Cafe To Collection

Every meaningful product decision should help a visitor move through a connected tabletop journey:

1. Search for a game and understand where it is playable.
2. Visit a venue with enough practical confidence to walk through the door.
3. Find a secondhand copy through trusted local resale paths.
4. Buy a new copy through an appropriate retailer or international purchase path.

This is the public-product compass. TTGJ should connect games, venues, confidence cues, maps, retailers, resale options, and online sellers instead of presenting them as isolated directories.

It is also a sustainable business compass. Claimed listings, promoted visibility, verified venue data, retailer relationships, itinerary products, and affiliate commerce should support the free public guide without weakening trust.

## Competitive Lessons

- Jelly Jelly and Bodoge prove that venue maps and community trust are essential.
- Board Game Cafe Finder proves that location and available-game search should be first-class.
- GameShelf shows the SaaS layer: game libraries, events, reservations, analytics, loyalty, and operational tooling.
- Bear Cool highlights events, solo-player entry, play records, and friend/community discovery.
- Local listing SaaS products show the monetization path: claim, clean, promote, measure, and upgrade.

## Obsidian Strategy Lessons

- Foreigners need onboarding infrastructure, not translation alone.
- Beginner pathways create permission to join.
- Recurring beginner events create low-pressure entry points.
- Physical community data is hard to maintain and becomes a moat when cleaned and verified.
- AI-assisted community data maintenance can monitor fragmented event and venue sources, but human verification remains important.

## SaaS Shape

### Public Product

- Venue, store, group, creator, event, and online seller discovery.
- Search by area, game, open hours, English support, solo-friendly entry, beginner-friendliness, and event type.
- Venue pages with confidence cues: what to expect, etiquette, language expectations, what to bring, and whether solo visitors are welcome.
- "Where can I play this game?" lookup.

### Partner Product

- Claim and verify listing.
- Update hours, game library, images, events, offers, and onboarding notes.
- Track leads, clicks, listing health, and campaign readiness.
- Publish recurring beginner nights.

### Admin Product

- Workbook import and normalization.
- Data quality dashboard.
- Verification queue.
- Outreach tracker.
- Event/source monitoring.
- Bilingual content review.

## Current Implementation Pass

The first working pass adds a `TTGJ SaaS` app section using normalized venue data from the project vault, plus a frontend shell that reflects the SaaS direction:

- Public directory search
- Database-derived cafe and store map with category filters, synchronized search, clustered markers, venue selection, and street-map links
- Cafe recommendations
- Event entry points
- Creator discovery
- Group discovery
- Online seller and retailer discovery
- Game-led discovery and Japanese board game pathways
- Cafe-to-collection tourist journey and commerce pipeline
- Lovable-derived event candidates, creator profiles, Japanese game profiles, retailer paths, online sellers, and starter editorial guides
- Tabletop experience pathways
- Blog, SEO, GEO, and AEO guide surfaces
- Partner dashboard preview
- Pricing tiers
- Competitive rationale
- Data pipeline

## Section Build Sequence

The public navigation now has a distinct first-pass surface for:

1. Map and venue directory
2. Cafes
3. Events
4. Creators
5. Groups
6. Online sales and retailers
7. Game list and Japanese board games
8. Experiences
9. Blog and answer-ready guides
10. For Shops partner tooling
11. Pricing

The next build step is to regenerate `src/data/ttgjVenues.ts` from the main workbook rather than the smaller CSV sample, then move the same shape into Supabase tables. After that, replace the preview catalog records in `src/data/ttgjCatalog.ts` with normalized event, creator, group, game, retailer, seller, experience, and guide tables.

The live map now uses MapLibre GL JS with the free OpenFreeMap `liberty` style. It renders real geographic tiles, native venue clustering, cafe/store filters, and venue-level detail selection. The illustrated Japan asset remains suitable for brand artwork, but it is no longer responsible for plotting real places. Set `VITE_TTGJ_MAP_STYLE_URL` if the launch deployment later moves to a different tile provider or self-hosted style.

The map dataset uses the `UPDATED` worksheet in `D:\TABLE TOP GAMES JAPAN PROJECT\## FEB26_UPDATED 3 SHEET - master_database - Copy.xlsx`. The worksheet range contains 392 rows: one heading row, one blank row, and 390 populated venue records with coordinate pairs. Run `npm run import:ttgj` after workbook edits to refresh the generated frontend dataset. Once the Supabase venue table is loaded, the same map component can render the database response without changing its visual contract.

The Lovable preview contains useful legacy public content for events, creators, online sellers, retailers, Japanese games, blog guides, partner tools, and pricing. This content has been incorporated as a richer frontend foundation in `src/data/ttgjCatalog.ts`. Time-sensitive events are marked for verification before launch. The Lovable groups and community-experience routes were mostly empty shells, so those areas should be populated through verified local sources and moderated user contributions rather than invented records.
