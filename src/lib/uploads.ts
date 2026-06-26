import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function getUploadRoot(): string {
  return process.env.UPLOAD_DIR ?? path.join(projectRoot, 'uploads');
}

export function getGhostUploadDir(slug: string): string {
  return path.join(getUploadRoot(), 'ghosts', slug);
}

export function toPublicPath(slug: string, filename: string): string {
  return `/uploads/ghosts/${slug}/${filename}`;
}

function sanitizeFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, '-');
  return base || `image-${Date.now()}`;
}

function uniqueFilename(original: string): string {
  const ext = path.extname(original).toLowerCase() || '.jpg';
  const stem = path.basename(original, ext).slice(0, 40).replace(/[^a-zA-Z0-9-]/g, '-') || 'image';
  return `${stem}-${Date.now()}${ext}`;
}

export async function ensureGhostUploadDir(slug: string): Promise<string> {
  const dir = getGhostUploadDir(slug);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function saveGhostImages(slug: string, files: File[]): Promise<string[]> {
  if (files.length === 0) return [];

  const dir = await ensureGhostUploadDir(slug);
  const saved: string[] = [];

  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error(`Unsupported file type: ${file.name}`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large: ${file.name}`);
    }

    const filename = uniqueFilename(sanitizeFilename(file.name));
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), buffer);
    saved.push(toPublicPath(slug, filename));
  }

  return saved;
}

export async function deleteImageFile(publicPath: string): Promise<void> {
  const relative = publicPath.replace(/^\/uploads\/ghosts\//, '');
  const filePath = path.join(getUploadRoot(), 'ghosts', relative);
  try {
    await fs.unlink(filePath);
  } catch {
    // file may already be gone
  }
}

export async function deleteGhostUploadFolder(slug: string): Promise<void> {
  const dir = getGhostUploadDir(slug);
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // folder may not exist
  }
}

export async function moveGhostUploadFolder(oldSlug: string, newSlug: string): Promise<void> {
  if (oldSlug === newSlug) return;

  const oldDir = getGhostUploadDir(oldSlug);
  const newDir = getGhostUploadDir(newSlug);

  try {
    await fs.access(oldDir);
  } catch {
    return;
  }

  await fs.mkdir(path.dirname(newDir), { recursive: true });

  try {
    await fs.rename(oldDir, newDir);
  } catch {
    await fs.cp(oldDir, newDir, { recursive: true });
    await fs.rm(oldDir, { recursive: true, force: true });
  }
}

export function remapImagePaths(paths: string[], oldSlug: string, newSlug: string): string[] {
  if (oldSlug === newSlug) return paths;
  const prefix = `/uploads/ghosts/${oldSlug}/`;
  const newPrefix = `/uploads/ghosts/${newSlug}/`;
  return paths.map((p) => (p.startsWith(prefix) ? p.replace(prefix, newPrefix) : p));
}

export async function resolveUploadFile(relativePath: string): Promise<{ filePath: string; contentType: string } | null> {
  const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(getUploadRoot(), 'ghosts', normalized);

  if (!filePath.startsWith(path.join(getUploadRoot(), 'ghosts'))) {
    return null;
  }

  try {
    await fs.access(filePath);
  } catch {
    return null;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType =
    ext === '.png' ? 'image/png'
    : ext === '.webp' ? 'image/webp'
    : ext === '.gif' ? 'image/gif'
    : 'image/jpeg';

  return { filePath, contentType };
}

export function getImageFilesFromForm(formData: FormData): File[] {
  return formData
    .getAll('images')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

export function getExistingImagesFromForm(formData: FormData): string[] {
  return formData
    .getAll('existingImages')
    .map((v) => String(v).trim())
    .filter(Boolean);
}

export async function processGhostImages(options: {
  slug: string;
  formData: FormData;
  previousImages?: string[];
  previousSlug?: string;
}): Promise<string[]> {
  const { slug, formData, previousImages = [], previousSlug } = options;

  if (previousSlug && previousSlug !== slug) {
    await moveGhostUploadFolder(previousSlug, slug);
  }

  let kept = getExistingImagesFromForm(formData);
  if (previousSlug && previousSlug !== slug) {
    kept = remapImagePaths(kept, previousSlug, slug);
  }

  const removed = previousImages.filter((img) => !kept.includes(img));
  for (const img of removed) {
    await deleteImageFile(img);
  }

  const newImages = await saveGhostImages(slug, getImageFilesFromForm(formData));
  return [...kept, ...newImages];
}
