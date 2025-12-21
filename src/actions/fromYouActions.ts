'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createFromYouImage(formData: FormData) {
    const supabase = await createClient();
    const imageUrl = formData.get('imageUrl') as string;
    const caption = formData.get('caption') as string;

    const { error } = await supabase.from('from_you_images').insert({
        image_url: imageUrl,
        caption: caption || null,
    });

    if (error) {
        console.error('Error creating from you image:', error);
        throw new Error('Failed to add image: ' + error.message);
    }

    revalidatePath('/admin/from-you');
    revalidatePath('/from-you');
}

export async function deleteFromYouImage(id: string, imageUrl: string) {
    const supabase = await createClient();

    // Extract filename from URL and delete from storage
    try {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        await supabase.storage.from('images').remove([fileName]);
    } catch (err) {
        console.error('Error deleting image from storage:', err);
    }

    // Delete from database
    const { error } = await supabase.from('from_you_images').delete().eq('id', id);

    if (error) {
        console.error('Error deleting from you image:', error);
        throw new Error('Failed to delete image');
    }

    revalidatePath('/admin/from-you');
    revalidatePath('/from-you');
}
