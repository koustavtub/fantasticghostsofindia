/** Canonical macro-regions for browse filters and admin autocomplete. */
export const INDIAN_REGIONS = [
  'Pan-India',
  'North India',
  'South India',
  'East India',
  'West India',
  'Central India',
  'Northeast India',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
  'Konkan',
  'Malabar',
  'Deccan',
  'Braj',
  'Mithila',
] as const;

export type RegionFilterSlug =
  | 'pan-india'
  | 'north-india'
  | 'south-india'
  | 'east-india'
  | 'west-india'
  | 'central-india'
  | 'northeast-india';

export const REGION_FILTERS: { slug: RegionFilterSlug; label: string }[] = [
  { slug: 'pan-india', label: 'Pan-India' },
  { slug: 'north-india', label: 'North India' },
  { slug: 'south-india', label: 'South India' },
  { slug: 'east-india', label: 'East India' },
  { slug: 'west-india', label: 'West India' },
  { slug: 'central-india', label: 'Central India' },
  { slug: 'northeast-india', label: 'Northeast India' },
];

const REGION_FILTER_SLUGS = new Set(REGION_FILTERS.map((f) => f.slug));

export function isRegionFilterSlug(value: string): value is RegionFilterSlug {
  return REGION_FILTER_SLUGS.has(value as RegionFilterSlug);
}

export function getRegionFilterLabel(slug: string): string | undefined {
  return REGION_FILTERS.find((f) => f.slug === slug)?.label;
}

/** Map free-text region values to one or more macro-region slugs. */
export function getRegionGroupSlugs(region: string): RegionFilterSlug[] {
  const r = region.toLowerCase().trim();
  if (!r) return [];

  const slugs = new Set<RegionFilterSlug>();

  for (const filter of REGION_FILTERS) {
    if (r === filter.label.toLowerCase()) {
      slugs.add(filter.slug);
    }
  }
  if (slugs.size > 0) return [...slugs];

  if (r.includes('pan-india') || r === 'pan india') slugs.add('pan-india');
  if (r.includes('northeast') || r.includes('bengal') || r.includes('assam')) {
    slugs.add('northeast-india');
  }
  if (
    r.includes('kerala') ||
    r.includes('tamil') ||
    r.includes('andhra') ||
    r.includes('telangana') ||
    r.includes('karnataka') ||
    ((r.includes('south') || r.includes('southern')) && r.includes('india')) ||
    r.includes('malabar') ||
    r.includes('deccan')
  ) {
    slugs.add('south-india');
  }
  if (
    r.includes('western') ||
    r.includes('west india') ||
    r.includes('maharashtra') ||
    r.includes('konkan') ||
    r.includes('gujarat') ||
    r.includes('goa')
  ) {
    slugs.add('west-india');
  }
  if (
    r.includes('north & central') ||
    r.includes('north and central') ||
    ((r.includes('north') || r.includes('northern')) && r.includes('india')) ||
    r.includes('uttar pradesh') ||
    r.includes('punjab') ||
    r.includes('rajasthan') ||
    r.includes('haryana') ||
    r.includes('braj')
  ) {
    slugs.add('north-india');
  }
  if (
    r.includes('central india') ||
    r.includes('madhya pradesh') ||
    r.includes('chhattisgarh') ||
    r.includes('malwa') ||
    r.includes('bundelkhand')
  ) {
    slugs.add('central-india');
  }
  if (
    r.includes('east india') ||
    r.includes('odisha') ||
    r.includes('bihar') ||
    r.includes('jharkhand') ||
    r.includes('west bengal') ||
    r.includes('mithila')
  ) {
    slugs.add('east-india');
  }

  return [...slugs];
}

/** Primary macro-region slug (first match). */
export function getRegionGroupSlug(region: string): RegionFilterSlug | null {
  return getRegionGroupSlugs(region)[0] ?? null;
}

/** Pick the best single canonical label when saving from admin. */
export function normalizeRegionInput(region: string): string {
  const trimmed = region.trim();
  if (!trimmed) return trimmed;

  const slugs = getRegionGroupSlugs(trimmed);
  if (slugs.length === 1) {
    return getRegionFilterLabel(slugs[0]) ?? trimmed.split('(')[0].trim();
  }
  if (slugs.length > 1) {
    return slugs
      .map((slug) => getRegionFilterLabel(slug))
      .filter(Boolean)
      .join(' & ');
  }

  // Exact match to known state/region list
  const exact = INDIAN_REGIONS.find(
    (item) => item.toLowerCase() === trimmed.toLowerCase()
  );
  if (exact) return exact;

  return trimmed.split('(')[0].split('&')[0].trim();
}

export function mergeRegionOptions(existing: string[] = []): string[] {
  const normalized = existing.map(normalizeRegionInput);
  return [...new Set([...INDIAN_REGIONS, ...normalized])].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );
}

export function regionBelongsToFilter(storedRegion: string, filterSlug: RegionFilterSlug): boolean {
  return getRegionGroupSlugs(storedRegion).includes(filterSlug);
}
