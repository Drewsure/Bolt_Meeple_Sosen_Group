# TTGJ Supabase Content Deployment

The public TTGJ layout now reads managed content from `public.ttgj_catalog_entries`
when Supabase is available. Until the hosted migration is applied and records are
seeded, the page continues to use the approved local launch set.

## Hosted setup

1. Open the Supabase SQL Editor for the TTGJ project.
2. Run `supabase/migrations/20260531120000_add_ttgj_catalog_content.sql`.
3. Ensure the approved editor account has trusted `app_metadata.role` set to
   `admin` or `catalog_editor`. Do not store this role in user-editable metadata.
4. Restart the local Vite server so `.env.local` is loaded.
5. Open `#ttgj-admin`, sign in with the approved editor account, and choose
   **Seed launch set**.
6. Return to `#ttgj` and confirm the public event calendar and catalog sections
   still show the approved content.

## Access model

- Visitors and signed-in users can read published content.
- Draft and archived content remain hidden from visitors.
- Only trusted `admin` or `catalog_editor` accounts can create, update, delete,
  publish, or seed catalog records.
- The frontend uses only the Supabase publishable key.
- Never place a service-role or secret key in Vite environment variables.

## Managed content types

- Events
- Creators
- Groups
- Online sales
- Retailers
- Game list
- Experiences
- Blog and guides

Venue ownership, claim approval, and owner-scoped listing changes should remain a
separate follow-on workflow because owners must only edit records they control.
