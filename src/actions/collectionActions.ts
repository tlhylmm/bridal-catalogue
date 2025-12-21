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
    const { error } = await supabase.from('collections').delete().eq('id', id);

    if (error) {
        console.error('Error deleting collection:', error);
        throw new Error('Failed to delete collection');
    }

    revalidatePath('/admin/collections');
    revalidatePath('/collections');
}
