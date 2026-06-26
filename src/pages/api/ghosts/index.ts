import type { APIRoute } from 'astro';
import { createGhost, slugExists } from '../../../lib/ghosts';
import { parseGhostForm, validateGhost } from '../../../lib/form';
import { processGhostImages } from '../../../lib/uploads';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const data = parseGhostForm(formData);
  const validationError = validateGhost(data);

  if (validationError) {
    return redirect(`/admin/ghosts/new?error=${encodeURIComponent(validationError)}`);
  }

  if (await slugExists(data.slug)) {
    return redirect(`/admin/ghosts/new?error=${encodeURIComponent('Slug already exists.')}`);
  }

  try {
    const images = await processGhostImages({ slug: data.slug, formData });
    await createGhost({ ...data, images });
    return redirect('/admin/ghosts');
  } catch (error) {
    console.error('Create ghost error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create entry.';
    return redirect(`/admin/ghosts/new?error=${encodeURIComponent(message)}`);
  }
};

export const prerender = false;
