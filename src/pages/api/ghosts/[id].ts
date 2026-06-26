import type { APIRoute } from 'astro';
import { deleteGhost, getGhostById, slugExists, updateGhost } from '../../../lib/ghosts';
import { parseGhostForm, validateGhost } from '../../../lib/form';
import { deleteGhostUploadFolder, processGhostImages } from '../../../lib/uploads';

export const POST: APIRoute = async ({ params, request, redirect }) => {
  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    return redirect('/admin/ghosts');
  }

  const formData = await request.formData();
  const method = String(formData.get('_method') ?? 'POST').toUpperCase();

  if (method === 'DELETE') {
    const existing = await getGhostById(id);
    await deleteGhost(id);
    if (existing) {
      await deleteGhostUploadFolder(existing.slug);
    }
    return redirect('/admin/ghosts?deleted=1');
  }

  if (method === 'PUT') {
    const existing = await getGhostById(id);
    if (!existing) {
      return redirect('/admin/ghosts');
    }

    const data = parseGhostForm(formData);
    const validationError = validateGhost(data);

    if (validationError) {
      return redirect(`/admin/ghosts/${id}/edit?error=${encodeURIComponent(validationError)}`);
    }

    if (await slugExists(data.slug, id)) {
      return redirect(`/admin/ghosts/${id}/edit?error=${encodeURIComponent('Slug already exists.')}`);
    }

    try {
      const images = await processGhostImages({
        slug: data.slug,
        formData,
        previousImages: existing.images,
        previousSlug: existing.slug,
      });

      const updated = await updateGhost(id, { ...data, images });
      if (!updated) {
        return redirect('/admin/ghosts');
      }

      return redirect('/admin/ghosts');
    } catch (error) {
      console.error('Update ghost error:', error);
      const message = error instanceof Error ? error.message : 'Failed to update entry.';
      return redirect(`/admin/ghosts/${id}/edit?error=${encodeURIComponent(message)}`);
    }
  }

  return redirect('/admin/ghosts');
};

export const prerender = false;
