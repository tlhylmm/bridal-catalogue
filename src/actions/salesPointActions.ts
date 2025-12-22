'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface Location {
    city: string;
    address: string;
    mapLink?: string;
}

export async function createSalesPoint(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const locationsStr = formData.get('locations') as string;

    const locations: Location[] = locationsStr ? JSON.parse(locationsStr) : [];

    const { error } = await supabase.from('sales_points').insert({
        name,
        locations
    });

    if (error) {
        console.error('Error creating sales point:', error);
        throw new Error('Failed to create sales point: ' + error.message);
    }

    revalidatePath('/admin/sales-points');
    revalidatePath('/sales-points');
    redirect('/admin/sales-points');
}

export async function updateSalesPoint(id: string, formData: FormData) {
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const locationsStr = formData.get('locations') as string;

    const locations: Location[] = locationsStr ? JSON.parse(locationsStr) : [];

    const { error } = await supabase.from('sales_points').update({
        name,
        locations
    }).eq('id', id);

    if (error) {
        console.error('Error updating sales point:', error);
        throw new Error('Failed to update sales point: ' + error.message);
    }

    revalidatePath('/admin/sales-points');
    revalidatePath('/sales-points');
    redirect('/admin/sales-points');
}

export async function deleteSalesPoint(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('sales_points').delete().eq('id', id);

    if (error) {
        console.error('Error deleting sales point:', error);
        throw new Error('Failed to delete sales point');
    }

    revalidatePath('/admin/sales-points');
    revalidatePath('/sales-points');
}
