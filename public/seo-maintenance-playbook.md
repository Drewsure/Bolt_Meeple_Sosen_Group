# SEO + GEO + AEO Maintenance Playbook

Run this every week, and do a deeper rewrite pass once per month.

## Weekly Process

1. Run `npm run seo:audit`.
2. Read `reports/seo-aeo-audit.md`.
3. Fix any failed checks.
4. Add one fresh trust signal if available:
   - a real session photo
   - a short participant quote
   - a new beginner-friendly game
   - a local Fukuoka/Nishi-ku event note
   - a Silver Circle schedule update
5. Check that the homepage still says the clearest public offer:
   - English through board games in Fukuoka
   - beginners welcome
   - Japanese support available
   - no tests, no pressure
6. Check `public/llms.txt` for answer-engine accuracy.

## Monthly Process

1. Review Search Console, Google Business Profile, and analytics if available.
2. Update the sitemap `lastmod` date when public content changes.
3. Add or improve one content page/post around a search question:
   - How do board games help English conversation?
   - Where can beginners practise English in Fukuoka?
   - What happens at a Meeple Sosen trial table?
   - What is Silver Circle?
4. Ask for one review using these natural keywords:
   - Fukuoka
   - English conversation
   - board games
   - beginner friendly
   - Japanese support
5. Keep Silver Circle medically safe:
   - Use "supports", "may help", "conversation", "social participation"
   - Avoid "prevents dementia", "treats", "guarantees", or hard medical outcomes

## Best Current Search Summary

Meeple Sosen Group offers friendly English conversation sessions through board games in Nishi-ku, Fukuoka. Beginners can join with Japanese support and no board game experience. The session flow is choose a game, choose one English focus, use a conversation card, and record progress.

## Bigger Technical Upgrade

The app still uses hash routes. For stronger search visibility, migrate public pages to clean URLs:

- `/`
- `/how-it-works`
- `/games`
- `/silver-circle`
- `/about`

Until then, keep the homepage highly focused and locally targeted.
