/*
  Affiliate-commerce metadata for TTGJ shopping guides.

  Ordinary official-site links remain usable before partner approval.
  Affiliate URLs must be activated deliberately and displayed with a visible
  PR / advertising disclosure in the public interface.
*/

ALTER TABLE ttgj_catalog_entries ADD COLUMN IF NOT EXISTS affiliate_url text;
ALTER TABLE ttgj_catalog_entries ADD COLUMN IF NOT EXISTS affiliate_program text;
ALTER TABLE ttgj_catalog_entries ADD COLUMN IF NOT EXISTS affiliate_status text NOT NULL DEFAULT 'not_applicable'
  CHECK (affiliate_status IN ('not_applicable', 'pending', 'active', 'paused'));
ALTER TABLE ttgj_catalog_entries ADD COLUMN IF NOT EXISTS affiliate_disclosure text NOT NULL DEFAULT '';

