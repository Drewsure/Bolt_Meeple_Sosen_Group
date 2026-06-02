import {
  ttgjCreators,
  ttgjEvents,
  ttgjExperiences,
  ttgjGames,
  ttgjGroups,
  ttgjGuides,
  ttgjOnlineSales,
  ttgjRetailers,
} from '../data/ttgjCatalog';
import type { TTGJCatalogItem } from '../data/ttgjCatalog';
import { isSupabaseConfigured, supabase } from './supabase';

export type TTGJCatalogKind = 'event' | 'creator' | 'group' | 'online_sale' | 'retailer' | 'game' | 'experience' | 'guide';
export type TTGJCatalogStatus = 'draft' | 'published' | 'archived';

export interface TTGJCatalogEntry extends TTGJCatalogItem {
  id: string;
  kind: TTGJCatalogKind;
  slug: string;
  status: TTGJCatalogStatus;
  sortOrder: number;
  websiteUrl?: string;
  imageUrl?: string;
  affiliateUrl?: string;
  affiliateProgram?: string;
  affiliateStatus?: 'not_applicable' | 'pending' | 'active' | 'paused';
  affiliateDisclosure?: string;
}

export type TTGJCatalogGroups = Record<TTGJCatalogKind, TTGJCatalogEntry[]>;

const kindLabels: Record<TTGJCatalogKind, string> = {
  event: 'Events',
  creator: 'Creators',
  group: 'Groups',
  online_sale: 'Online sales',
  retailer: 'Retailers',
  game: 'Game list',
  experience: 'Experiences',
  guide: 'Blog and guides',
};

export const ttgjCatalogKinds = Object.keys(kindLabels) as TTGJCatalogKind[];
export { kindLabels as ttgjCatalogKindLabels };

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function fallbackEntries(kind: TTGJCatalogKind, items: TTGJCatalogItem[]): TTGJCatalogEntry[] {
  return items.map((item, index) => ({
    ...item,
    id: `local-${kind}-${slugify(item.title)}`,
    kind,
    slug: slugify(item.title),
    status: 'published',
    sortOrder: (index + 1) * 10,
  }));
}

export const fallbackTTGJCatalog: TTGJCatalogGroups = {
  event: fallbackEntries('event', ttgjEvents),
  creator: fallbackEntries('creator', ttgjCreators),
  group: fallbackEntries('group', ttgjGroups),
  online_sale: fallbackEntries('online_sale', ttgjOnlineSales),
  retailer: fallbackEntries('retailer', ttgjRetailers),
  game: fallbackEntries('game', ttgjGames),
  experience: fallbackEntries('experience', ttgjExperiences),
  guide: fallbackEntries('guide', ttgjGuides),
};

function emptyGroups(): TTGJCatalogGroups {
  return {
    event: [],
    creator: [],
    group: [],
    online_sale: [],
    retailer: [],
    game: [],
    experience: [],
    guide: [],
  };
}

function fromDatabase(row: Record<string, unknown>): TTGJCatalogEntry {
  return {
    id: String(row.id),
    kind: row.kind as TTGJCatalogKind,
    slug: String(row.slug),
    title: String(row.title),
    meta: String(row.meta ?? ''),
    description: String(row.description ?? ''),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    action: String(row.action_label ?? 'Explore'),
    status: row.status as TTGJCatalogStatus,
    featured: Boolean(row.featured),
    startsAt: row.starts_at ? String(row.starts_at) : undefined,
    endsAt: row.ends_at ? String(row.ends_at) : undefined,
    location: row.location ? String(row.location) : undefined,
    eventType: row.event_type ? String(row.event_type) : undefined,
    websiteUrl: row.website_url ? String(row.website_url) : undefined,
    imageUrl: row.image_url ? String(row.image_url) : undefined,
    affiliateUrl: row.affiliate_url ? String(row.affiliate_url) : undefined,
    affiliateProgram: row.affiliate_program ? String(row.affiliate_program) : undefined,
    affiliateStatus: row.affiliate_status ? row.affiliate_status as TTGJCatalogEntry['affiliateStatus'] : 'not_applicable',
    affiliateDisclosure: row.affiliate_disclosure ? String(row.affiliate_disclosure) : undefined,
    sortOrder: Number(row.sort_order ?? 100),
  };
}

function toDatabase(entry: Partial<TTGJCatalogEntry> & Pick<TTGJCatalogEntry, 'kind' | 'title'>) {
  return {
    kind: entry.kind,
    slug: entry.slug || slugify(entry.title),
    title: entry.title,
    meta: entry.meta ?? '',
    description: entry.description ?? '',
    tags: entry.tags ?? [],
    action_label: entry.action ?? 'Explore',
    status: entry.status ?? 'draft',
    featured: entry.featured ?? false,
    starts_at: entry.startsAt || null,
    ends_at: entry.endsAt || null,
    location: entry.location || null,
    event_type: entry.eventType || null,
    website_url: entry.websiteUrl || null,
    image_url: entry.imageUrl || null,
    affiliate_url: entry.affiliateUrl || null,
    affiliate_program: entry.affiliateProgram || null,
    affiliate_status: entry.affiliateStatus ?? 'not_applicable',
    affiliate_disclosure: entry.affiliateDisclosure || '',
    sort_order: entry.sortOrder ?? 100,
  };
}

function grouped(rows: TTGJCatalogEntry[]) {
  return rows.reduce((result, entry) => {
    result[entry.kind].push(entry);
    return result;
  }, emptyGroups());
}

export async function getPublicTTGJCatalog(): Promise<TTGJCatalogGroups> {
  if (!isSupabaseConfigured) return fallbackTTGJCatalog;

  try {
    const { data, error } = await supabase
      .from('ttgj_catalog_entries')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true });

    if (error || !data?.length) return fallbackTTGJCatalog;
    return grouped(data.map((row) => fromDatabase(row as Record<string, unknown>)));
  } catch {
    return fallbackTTGJCatalog;
  }
}

export async function getManagedTTGJCatalog(): Promise<TTGJCatalogEntry[]> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured for permanent TTGJ content editing.');
  const { data, error } = await supabase
    .from('ttgj_catalog_entries')
    .select('*')
    .order('kind', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => fromDatabase(row as Record<string, unknown>));
}

export async function saveTTGJCatalogEntry(entry: Partial<TTGJCatalogEntry> & Pick<TTGJCatalogEntry, 'kind' | 'title'>) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured for permanent TTGJ content editing.');
  const payload = toDatabase(entry);
  const query = entry.id && !entry.id.startsWith('local-')
    ? supabase.from('ttgj_catalog_entries').update(payload).eq('id', entry.id)
    : supabase.from('ttgj_catalog_entries').insert(payload);
  const { data, error } = await query.select('*').single();
  if (error) throw new Error(error.message);
  return fromDatabase(data as Record<string, unknown>);
}

export async function deleteTTGJCatalogEntry(id: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured for permanent TTGJ content editing.');
  const { error } = await supabase.from('ttgj_catalog_entries').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function seedFallbackTTGJCatalog() {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured for permanent TTGJ content editing.');
  const payload = ttgjCatalogKinds.flatMap((kind) => fallbackTTGJCatalog[kind].map(toDatabase));
  const { data, error } = await supabase
    .from('ttgj_catalog_entries')
    .upsert(payload, { onConflict: 'kind,slug' })
    .select('*');
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => fromDatabase(row as Record<string, unknown>));
}
