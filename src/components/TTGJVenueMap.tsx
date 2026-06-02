import {
  Clock3,
  Coffee,
  ExternalLink,
  Globe2,
  LocateFixed,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Snowflake,
  Store,
  WalletCards,
  Waves,
  X,
} from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap, type MapLayerMouseEvent } from 'maplibre-gl';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TTGJVenue } from '../data/ttgjVenues';

type MapFilter = 'All' | 'Cafes' | 'Stores';
type VenueKind = Exclude<MapFilter, 'All'> | 'Other';
type RegionFilter = 'All Japan' | 'Tokyo' | 'Osaka' | 'Fukuoka' | 'Hokkaido' | 'Kyoto' | 'Okinawa';

const openFreeMapStyle = import.meta.env.VITE_TTGJ_MAP_STYLE_URL || 'https://tiles.openfreemap.org/styles/liberty';
const japanBounds: maplibregl.LngLatBoundsLike = [[127.5, 24.0], [145.8, 45.8]];

const mapFilters: Array<{ label: MapFilter; icon: typeof MapPin }> = [
  { label: 'All', icon: LocateFixed },
  { label: 'Cafes', icon: Coffee },
  { label: 'Stores', icon: Store },
];

const regionFilters: Array<{ label: RegionFilter; icon: typeof MapPin }> = [
  { label: 'All Japan', icon: Globe2 },
  { label: 'Tokyo', icon: MapPin },
  { label: 'Osaka', icon: MapPin },
  { label: 'Fukuoka', icon: Waves },
  { label: 'Hokkaido', icon: Snowflake },
  { label: 'Kyoto', icon: MapPin },
  { label: 'Okinawa', icon: Waves },
];

function getVenueKind(venue: TTGJVenue): VenueKind {
  const category = venue.category.toLowerCase();
  if (category.includes('caf')) return 'Cafes';
  if (category.includes('store') || category.includes('retailer') || category.includes('shop')) return 'Stores';
  return 'Other';
}

function venueMatchesRegion(venue: TTGJVenue, region: RegionFilter) {
  if (region === 'All Japan') return true;
  return [venue.city, venue.prefecture, venue.address].join(' ').toLowerCase().includes(region.toLowerCase());
}

function getOpenStreetMapUrl(venue: TTGJVenue) {
  return venue.latitude && venue.longitude
    ? `https://www.openstreetmap.org/?mlat=${venue.latitude}&mlon=${venue.longitude}#map=17/${venue.latitude}/${venue.longitude}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${venue.name} ${venue.address}`)}`;
}

function getExternalUrl(value: string) {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function getVenueImage(venue: TTGJVenue) {
  if (venue.imageUrl) return venue.imageUrl;
  return getVenueKind(venue) === 'Stores' ? '/images/ttgj-game-market.jpeg' : '/images/ttgj-dancing-meeples.jpeg';
}

function VenueDetail({ venue, onClose }: { venue: TTGJVenue; onClose: () => void }) {
  return (
    <aside className="absolute inset-x-3 bottom-3 z-10 max-h-[calc(100%-1.5rem)] overflow-y-auto rounded-md border border-[#dfc99f] bg-white shadow-xl sm:left-3 sm:right-auto sm:w-[360px]">
      <div className="relative aspect-[16/8] overflow-hidden bg-[#f0e3c8]">
        <img src={getVenueImage(venue)} alt="" className="h-full w-full object-cover" />
        {!venue.imageUrl && (
          <span className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-1 text-[10px] font-black uppercase text-[#6d6258] shadow-sm">
            Venue photo pending
          </span>
        )}
        <button type="button" onClick={onClose} aria-label="Close venue details" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-[#6d6258] shadow-md transition hover:text-[#a60000]">
          <X size={16} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#bc4937]">{venue.category}</p>
        <h3 className="mt-2 text-lg font-black leading-tight">{venue.name}</h3>
        <p className="mt-1 text-xs font-semibold text-[#6d6258]">{venue.city}, {venue.prefecture}</p>
        <p className="mt-3 text-xs leading-5 text-[#5d635f]">{venue.description}</p>

        {venue.specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {venue.specialties.map((specialty) => (
              <span key={specialty} className="rounded bg-[#f7f3ed] px-2 py-1 text-[10px] font-black text-[#6d6258]">{specialty}</span>
            ))}
          </div>
        )}

        <div className="mt-3 grid gap-2 border-t border-[#eadcbc] pt-3 text-[11px] font-semibold leading-4 text-[#6d6258]">
          <span className="flex gap-2"><MapPin size={14} className="shrink-0 text-[#bc4937]" /><span>{venue.address}</span></span>
          {venue.hours && <span className="flex gap-2"><Clock3 size={14} className="shrink-0 text-[#bc4937]" /><span><strong>Hours:</strong> {venue.hours}</span></span>}
          {venue.priceRange && <span className="flex gap-2"><WalletCards size={14} className="shrink-0 text-[#bc4937]" /><span><strong>Pricing:</strong> {venue.priceRange}</span></span>}
          <span><strong>English support:</strong> {venue.englishFriendly || 'Not yet confirmed'}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`#ttgj-owner?venue=${encodeURIComponent(venue.sourceId)}`} className="inline-flex items-center gap-1.5 rounded bg-[#1a1a2e] px-3 py-2 text-[11px] font-black text-white">
            <ShieldCheck size={13} /> Claim this venue
          </a>
          {venue.website && (
            <a href={getExternalUrl(venue.website)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded bg-[#a60000] px-3 py-2 text-[11px] font-black text-white">
              <Globe2 size={13} /> Website
            </a>
          )}
          <a href={getOpenStreetMapUrl(venue)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded border border-[#ddc89f] bg-white px-3 py-2 text-[11px] font-black text-[#6d6258]">
            <MapPin size={13} /> Map
          </a>
          {venue.social && (
            <a href={getExternalUrl(venue.social)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded border border-[#ddc89f] bg-white px-3 py-2 text-[11px] font-black text-[#6d6258]">
              Social <ExternalLink size={13} />
            </a>
          )}
        </div>

        {(venue.phone || venue.email) && (
          <div className="mt-3 grid gap-2 border-t border-[#eadcbc] pt-3 text-[11px] font-semibold text-[#6d6258]">
            {venue.phone && <a href={`tel:${venue.phone}`} className="flex items-center gap-2 hover:text-[#a60000]"><Phone size={13} /> {venue.phone}</a>}
            {venue.email && <a href={`mailto:${venue.email}`} className="flex items-center gap-2 hover:text-[#a60000]"><Mail size={13} /> {venue.email}</a>}
          </div>
        )}
      </div>
    </aside>
  );
}

export function TTGJVenueMap({ venues }: { venues: TTGJVenue[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const venueLookupRef = useRef(new Map<string, TTGJVenue>());
  const [mapFilter, setMapFilter] = useState<MapFilter>('All');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('All Japan');
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [listLimit, setListLimit] = useState(5);
  const [mapLoaded, setMapLoaded] = useState(false);
  const geocodedVenues = useMemo(
    () => venues.filter((venue) => venue.latitude !== null && venue.longitude !== null),
    [venues],
  );
  const regionCounts = useMemo(
    () => new Map(regionFilters.map(({ label }) => [label, geocodedVenues.filter((venue) => venueMatchesRegion(venue, label)).length])),
    [geocodedVenues],
  );
  const visibleVenues = useMemo(
    () => geocodedVenues.filter((venue) => venueMatchesRegion(venue, regionFilter) && (mapFilter === 'All' || getVenueKind(venue) === mapFilter)),
    [geocodedVenues, mapFilter, regionFilter],
  );
  const venueLookup = useMemo(() => new Map(visibleVenues.map((venue) => [venue.sourceId, venue])), [visibleVenues]);
  const selectedVenue = venueLookup.get(selectedVenueId);
  const geoJson = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point>>(() => ({
    type: 'FeatureCollection',
    features: visibleVenues.map((venue) => ({
      type: 'Feature',
      id: venue.sourceId,
      geometry: {
        type: 'Point',
        coordinates: [venue.longitude as number, venue.latitude as number],
      },
      properties: {
        id: venue.sourceId,
        name: venue.name,
        kind: getVenueKind(venue),
      },
    })),
  }), [visibleVenues]);

  useEffect(() => {
    venueLookupRef.current = venueLookup;
  }, [venueLookup]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: openFreeMapStyle,
      bounds: japanBounds,
      fitBoundsOptions: { padding: 32 },
      minZoom: 2.8,
      maxZoom: 17,
      scrollZoom: false,
      attributionControl: {},
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      map.addSource('venues', {
        type: 'geojson',
        data: geoJson,
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 48,
      });
      map.addLayer({
        id: 'venue-clusters',
        type: 'circle',
        source: 'venues',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#bc4937', 40, '#a60000', 150, '#172b30'],
          'circle-radius': ['step', ['get', 'point_count'], 18, 40, 23, 150, 29],
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 2,
        },
      });
      map.addLayer({
        id: 'venue-cluster-count',
        type: 'symbol',
        source: 'venues',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#fff',
        },
      });
      map.addLayer({
        id: 'venue-points',
        type: 'circle',
        source: 'venues',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'kind'],
            'Cafes', '#a60000',
            'Stores', '#17623c',
            '#4b5563',
          ],
          'circle-radius': ['case', ['boolean', ['feature-state', 'selected'], false], 9, 6],
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 2,
        },
      });

      map.on('click', 'venue-clusters', async (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        const clusterId = feature?.properties?.cluster_id as number | undefined;
        if (clusterId === undefined || !feature) return;
        const source = map.getSource('venues') as GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({ center: (feature.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
      });
      map.on('click', 'venue-points', (event: MapLayerMouseEvent) => {
        const id = event.features?.[0]?.properties?.id as string | undefined;
        if (!id) return;
        setSelectedVenueId(id);
        map.easeTo({ center: (event.features?.[0]?.geometry as GeoJSON.Point).coordinates as [number, number], zoom: Math.max(map.getZoom(), 12) });
      });
      ['venue-clusters', 'venue-points'].forEach((layer) => {
        map.on('mouseenter', layer, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', layer, () => { map.getCanvas().style.cursor = ''; });
      });
      setMapLoaded(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const source = mapRef.current?.getSource('venues') as GeoJSONSource | undefined;
    if (source) source.setData(geoJson);
    if (!venueLookup.has(selectedVenueId)) setSelectedVenueId('');
  }, [geoJson, selectedVenueId, venueLookup]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapLoaded || !map) return;
    map.removeFeatureState({ source: 'venues' });
    if (selectedVenueId) map.setFeatureState({ source: 'venues', id: selectedVenueId }, { selected: true });
  }, [mapLoaded, selectedVenueId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapLoaded || !map || visibleVenues.length === 0) return;
    if (regionFilter === 'All Japan') {
      map.fitBounds(japanBounds, { padding: 32 });
      return;
    }
    const bounds = new maplibregl.LngLatBounds();
    visibleVenues.forEach((venue) => bounds.extend([venue.longitude as number, venue.latitude as number]));
    map.fitBounds(bounds, { padding: 70, maxZoom: 11 });
  }, [mapLoaded, regionFilter, visibleVenues]);

  const selectVenue = (venue: TTGJVenue) => {
    setSelectedVenueId(venue.sourceId);
    mapRef.current?.easeTo({ center: [venue.longitude as number, venue.latitude as number], zoom: 13 });
  };

  return (
    <section className="mt-8 overflow-hidden rounded-lg border border-[#dfc99f] bg-[#f6ecd8] shadow-sm">
      <div className="grid xl:grid-cols-[500px_1fr]">
        <div className="border-b border-[#dfc99f] p-5 xl:border-b-0 xl:border-r xl:p-6">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#bc4937]">
            <span className="h-px w-6 bg-[#bc4937]" /> {geocodedVenues.length} listed venues <span className="h-px w-6 bg-[#bc4937]" />
          </p>
          <h3 className="font-display mt-3 text-4xl leading-none text-[#171717] sm:text-5xl">
            Find a cafe <span className="text-[#bc1f2d]">near you</span>
          </h3>
          <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-[#754a21]">
            Browse places to play with map context, English support, game counts, and practical visit details.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {regionFilters.map(({ label, icon: Icon }) => (
              <button
                type="button"
                key={label}
                onClick={() => { setRegionFilter(label); setListLimit(5); setSelectedVenueId(''); }}
                aria-pressed={regionFilter === label}
                className={`inline-flex items-center gap-1.5 rounded border px-3 py-2 text-xs font-black transition ${
                  regionFilter === label
                    ? 'border-[#b67d35] bg-[#dfbd7f] text-[#5e3510] shadow-sm'
                    : 'border-[#dfc99f] bg-[#fff9ed] text-[#754a21] hover:border-[#bc4937]'
                }`}
              >
                <Icon size={14} className={regionFilter === label ? 'text-[#bc4937]' : 'text-[#d1793f]'} />
                {label}
                <span className="rounded bg-[#bc1f2d] px-1.5 py-0.5 text-[10px] text-white">{regionCounts.get(label)}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 inline-flex gap-1 rounded border border-[#dfc99f] bg-[#ead8b4] p-1">
            {mapFilters.map(({ label, icon: Icon }) => (
              <button
                type="button"
                key={label}
                onClick={() => { setMapFilter(label); setListLimit(5); }}
                aria-pressed={mapFilter === label}
                className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[11px] font-black transition ${
                  mapFilter === label ? 'bg-white text-[#a60000] shadow-sm' : 'text-[#754a21] hover:text-[#a60000]'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

        </div>

        <div className="relative min-h-[620px] bg-[#efe4ce]">
          <div className="absolute inset-3 border-4 border-[#e56b15] bg-[#e9efea] sm:inset-5">
            <div ref={mapContainerRef} className="h-full w-full" aria-label="Interactive map of tabletop venues in Japan" />
          </div>
          {!mapLoaded && (
            <div className="absolute inset-5 grid place-items-center bg-[#f7f3ed]/85">
              <p className="text-sm font-black text-[#6d6258]">Loading live map...</p>
            </div>
          )}
          {selectedVenue && <VenueDetail venue={selectedVenue} onClose={() => setSelectedVenueId('')} />}
        </div>
      </div>
      <div className="border-t border-[#dfc99f] bg-[#fffaf0] p-5 xl:p-6">
        <div className="grid gap-2 lg:grid-cols-2">
          {visibleVenues.slice(0, listLimit).map((venue) => (
            <button
              type="button"
              key={venue.sourceId}
              onClick={() => selectVenue(venue)}
              className={`grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded border-l-4 px-3 py-3 text-left shadow-sm transition ${
                selectedVenueId === venue.sourceId
                  ? 'border-l-[#a60000] border-y-[#ddc89f] border-r-[#ddc89f] bg-white'
                  : 'border-l-[#d3a968] border-y-[#ead8b4] border-r-[#ead8b4] bg-[#fff9ed] hover:border-l-[#bc4937] hover:bg-white'
              }`}
            >
              <span className="grid h-10 w-10 place-items-center rounded border border-[#dfc99f] bg-[#f2dfbd] text-[#a60000]">
                {getVenueKind(venue) === 'Stores' ? <Store size={18} /> : <Coffee size={18} />}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-[#171717]">{venue.name}</span>
                <span className="mt-1 block truncate text-[11px] font-semibold text-[#a66528]">{venue.city} · {venue.specialties.slice(0, 2).join(' · ') || venue.category}</span>
                <span className="mt-1 block text-[11px] font-black text-[#397446]">{venue.englishFriendly ? `${venue.englishFriendly} English support` : 'English support not yet confirmed'}</span>
              </span>
              <span className="max-w-[110px] text-right text-[11px] font-black text-[#b06d16]">{venue.priceRange || 'Price TBC'}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setListLimit((current) => Math.min(current + 10, visibleVenues.length))}
          disabled={listLimit >= visibleVenues.length}
          className="mt-5 inline-flex items-center gap-2 rounded bg-[#bd1121] px-4 py-3 text-xs font-black text-white shadow-sm transition hover:bg-[#9e0d1a] disabled:cursor-default disabled:bg-[#9a7b67]"
        >
          {listLimit >= visibleVenues.length
            ? `All ${visibleVenues.length} venue listings shown`
            : `Show 10 more listings · ${Math.min(listLimit, visibleVenues.length)} of ${visibleVenues.length} shown`}
        </button>
      </div>
    </section>
  );
}
