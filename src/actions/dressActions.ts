'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
    success: boolean;
    error?: string;
}

export async function createDress(formData: FormData): Promise<ActionResult> {
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const collectionId = formData.get('collectionId') as string;
    const description = formData.get('description') as string;
    const silhouette = formData.get('silhouette') as string;
    const fabric = formData.get('fabric') as string;
    const neckline = formData.get('neckline') as string;
    const mainImage = formData.get('mainImage') as string;
    const galleryImagesStr = formData.get('galleryImages') as string;

    const galleryImages = galleryImagesStr ? JSON.parse(galleryImagesStr) : [];

    const { error } = await supabase.from('dresses').insert({
        name,
        slug,
        collection_id: collectionId || null,
        description,
        silhouette,
        fabric,
        neckline,
        main_image: mainImage,
        gallery_images: galleryImages
    });

    if (error) {
        console.error('Error creating dress:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/dresses');
    revalidatePath('/collections');
    return { success: true };
}

export async function updateDress(id: string, formData: FormData): Promise<ActionResult> {
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const collectionId = formData.get('collectionId') as string;
    const description = formData.get('description') as string;
    const silhouette = formData.get('silhouette') as string;
    const fabric = formData.get('fabric') as string;
    const neckline = formData.get('neckline') as string;
    const mainImage = formData.get('mainImage') as string;
    const galleryImagesStr = formData.get('galleryImages') as string;

    const galleryImages = galleryImagesStr ? JSON.parse(galleryImagesStr) : [];

    const { error } = await supabase.from('dresses').update({
        name,
        slug,
        collection_id: collectionId || null,
        description,
        silhouette,
        fabric,
        neckline,
        main_image: mainImage,
        gallery_images: galleryImages
    }).eq('id', id);

    if (error) {
        console.error('Error updating dress:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/dresses');
    revalidatePath('/collections');
    return { success: true };
}

export async function deleteDress(id: string): Promise<ActionResult> {
    const supabase = await createClient();

    // First, get the dress to find its images
    const { data: dress } = await supabase
        .from('dresses')
        .select('main_image, gallery_images')
        .eq('id', id)
        .single();

    // Delete images from storage
    if (dress) {
        const imagesToDelete: string[] = [];

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

        // Delete all images from storage
        if (imagesToDelete.length > 0) {
            try {
                await supabase.storage.from('images').remove(imagesToDelete);
            } catch (err) {
                console.error('Error deleting images from storage:', err);
            }
        }
    }

    // Delete the dress record
    const { error } = await supabase.from('dresses').delete().eq('id', id);

    if (error) {
        console.error('Error deleting dress:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/dresses');
    revalidatePath('/collections');
    return { success: true };
}
