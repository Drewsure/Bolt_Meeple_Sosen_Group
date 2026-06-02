# TTGJ Launch Utility Audit

## What is now useful

- Visitors can begin with a venue, a specific game, a group, a trading-card interest, or a mystery-game experience.
- The map, cafe listings, event calendar, game-led journey, Japanese-games guide, shopping guide, itineraries, and owner cockpit are connected by clear next-step actions.
- Trading Cards has a focused portal for stores, tournaments, new and used purchases, and player discovery.
- Mystery Games has a focused portal for murder mysteries, escape and puzzle experiences, detective tabletop games, events, venues, and itineraries.
- Events now open a details window and generate a downloadable calendar file.
- Internal launch notes, automation readiness, and verification queues are separated from the public site in the `#ttgj-staff` operations preview.
- The staff portal includes SEO, GEO, AEO, and editorial publication planning, preview scheduling controls, queue ownership, and cadence.

## Highest-priority automation

### 1. Venue verification and refresh

Create a recurring admin queue for website, opening-hours, address, English-support, and tax-free checks. Flag stale records and owner-confirmed records separately.

### 2. Venue onboarding

Connect claim requests, owner verification, quick publish, library-size bands, CSV uploads, and optional BGG title matching to Supabase. Keep a human review queue for uncertain matches.

### 3. Game identity and venue inventory

Deploy the BGG search bridge, cache title identities, and connect each venue's featured games or full library to BGG IDs. Visitors should be able to start with a title and see where it can be played or bought.

### 4. Events

Move events into a managed Supabase workflow with owner submissions, moderation, expiry, recurring-event support, official URLs, and calendar exports.

### 5. Trading cards

Add structured venue fields for card games supported, sealed stock, singles, play space, casual nights, tournaments, and English support. This should not be mixed into the board-game inventory table.

### 6. Mystery games

Add structured experience fields for format, language level, English facilitation, duration, group size, price, booking URL, location, and schedule. Mystery games need booking data more than inventory data.

### 7. Affiliate links

Track affiliate status, disclosure text, approved URLs, clicks, and conversion-ready placements. Retain ordinary official-site links until a partnership is active.

### Staff operations schema

Deploy `20260602120000_add_ttgj_staff_automation.sql` to add the staff-only automation registry, run logs, publication queue, and verification-task queue. Connect trusted scheduled server jobs after authentication and role policies are validated.

## Systems needing more attention

### Launch blockers

- Supabase migrations and edge functions exist locally but still need deployment and production validation.
- Owner authentication, authorization, moderation, and record ownership require end-to-end testing.
- Legal pages need final production text and distinct public routes.
- Several editorial guide cards are still previews rather than complete articles.

### Important next improvements

- Replace static recommended-place ratings with verified data or remove ratings until sourced.
- Add genuine nearby sorting with location permission and a manual area fallback.
- Expand retailer and cafe detail pages with photos, official links, hours, and last-verified dates.
- Connect itinerary answers to saved routes and shareable trip plans.
- Add city and prefecture landing pages for SEO, GEO, and answer-engine visibility.
- Split the large application bundles before launch to improve mobile performance.

## Suggested implementation order

1. Deploy and validate Supabase.
2. Finish owner claim and moderation workflows.
3. Deploy BGG search and venue-game matching.
4. Add trading-card and mystery-game schemas.
5. Build managed event submissions and recurring schedules.
6. Finish public detail pages, legal routes, and editorial guides.
7. Add analytics, affiliate measurement, and performance optimization.
