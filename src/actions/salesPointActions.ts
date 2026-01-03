'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ActionResult {
    success: boolean;
    error?: string;
}

interface Location {
    city: string;
    address: string;
    mapLink?: string;
}

export async function createSalesPoint(formData: FormData): Promise<ActionResult> {
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
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/sales-points');
    revalidatePath('/sales-points');
    return { success: true };
}

export async function updateSalesPoint(id: string, formData: FormData): Promise<ActionResult> {
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
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/sales-points');
    revalidatePath('/sales-points');
    return { success: true };
}

export async function deleteSalesPoint(id: string): Promise<ActionResult> {
    const supabase = await createClient();
    const { error } = await supabase.from('sales_points').delete().eq('id', id);

    if (error) {
        console.error('Error deleting sales point:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/sales-points');
    revalidatePath('/sales-points');
    return { success: true };
}
