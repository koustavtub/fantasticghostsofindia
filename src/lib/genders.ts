export const GENDER_OPTIONS = [
  'Female',
  'Male',
  'Non-binary',
  'Variable',
  'Unknown',
] as const;

export function mergeGenderOptions(existing: string[] = []): string[] {
  return [...new Set([...GENDER_OPTIONS, ...existing])].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );
}
