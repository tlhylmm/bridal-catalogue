'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCollection(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;

    const { error } = await supabase.from('collections').insert({
        name,
        slug,
    });

    if (error) {
        console.error('Error creating collection:', error);
        throw new Error('Failed to create collection: ' + error.message);
    }

    revalidatePath('/admin/collections');
    revalidatePath('/collections');
    redirect('/admin/collections');
}

export async function updateCollection(id: string, formData: FormData) {
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;

    const { error } = await supabase.from('collections').update({
        name,
        slug,
    }).eq('id', id);

    if (error) {
        console.error('Error updating collection:', error);
        throw new Error('Failed to update collection: ' + error.message);
    }

    revalidatePath('/admin/collections');
    revalidatePath('/collections');
    redirect('/admin/collections');
}

export async function deleteCollection(id: string) {
    const supabase = await createClient();

    // First, fetch all dresses in this collection
    const { data: dresses } = await supabase
        .from('dresses')
        .select('id, main_image, gallery_images')
        .eq('collection_id', id);

    // Delete all dress images from storage
    if (dresses && dresses.length > 0) {
        const imagesToDelete: string[] = [];

        for (const dress of dresses) {
            // Extract filename from main image URL
            if (dress.main_image) {
                const urlParts = dress.main_image.split('/');
                imagesToDelete.push(urlParts[urlParts.length - 1]);
            }

            // Extract filenames from gallery images
            if (dress.gallery_images && Array.isArray(dress.gallery_images)) {
                dress.gallery_images.forEach((url: string) => {
                    const urlParts = url.split('/');
                    imagesToDelete.push(urlParts[urlParts.length - 1]);
                });
            }
        }

        // Delete all images from storage
        if (imagesToDelete.length > 0) {
            try {
                await supabase.storage.from('images').remove(imagesToDelete);
            } catch (err) {
                console.error('Error deleting images from storage:', err);
            }
        }

        // Delete all dresses in this collection
        const { error: dressDeleteError } = await supabase
            .from('dresses')
            .delete()
            .eq('collection_id', id);

        if (dressDeleteError) {
            console.error('Error deleting dresses:', dressDeleteError);
            throw new Error('Failed to delete dresses in collection');
        }
    }

    // Finally, delete the collection itself
    const { error } = await supabase.from('collections').delete().eq('id', id);

    if (error) {
        console.error('Error deleting collection:', error);
        throw new Error('Failed to delete collection');
    }

    revalidatePath('/admin/collections');
    revalidatePath('/admin/dresses');
    revalidatePath('/collections');
}
