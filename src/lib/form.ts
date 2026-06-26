import type { NewGhost } from '../db/schema';
import { normalizeRegionInput } from './india-regions';
import { slugify } from './ghosts';

export function parseGhostForm(formData: FormData): Omit<NewGhost, 'images'> {
  const parseList = (value: FormDataEntryValue | null): string[] =>
    String(value ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  return {
    slug: String(formData.get('slug') ?? '').trim(),
    name: String(formData.get('name') ?? '').trim(),
    alternateNames: parseList(formData.get('alternateNames')),
    region: normalizeRegionInput(String(formData.get('region') ?? '')),
    gender: String(formData.get('gender') ?? 'Unknown').trim() || 'Unknown',
    summary: String(formData.get('summary') ?? '').trim(),
    appearance: String(formData.get('appearance') ?? '').trim(),
    behavior: String(formData.get('behavior') ?? '').trim(),
    lore: String(formData.get('lore') ?? '').trim(),
    protection: String(formData.get('protection') ?? '').trim(),
    tags: parseList(formData.get('tags')),
  };
}

export function validateGhost(data: Omit<NewGhost, 'images'>): string | null {
  if (!data.name) return 'Name is required.';
  if (!data.slug) return 'Slug is required.';
  if (!/^[a-z0-9-]+$/.test(data.slug)) return 'Slug must contain only lowercase letters, numbers, and hyphens.';
  if (!data.region) return 'Region is required.';
  if (!data.summary) return 'Summary is required.';
  if (!data.appearance) return 'Appearance is required.';
  if (!data.behavior) return 'Behavior is required.';
  if (!data.lore) return 'Lore is required.';
  if (!data.protection) return 'Protection is required.';
  return null;
}

export function autoSlug(name: string): string {
  return slugify(name);
}
