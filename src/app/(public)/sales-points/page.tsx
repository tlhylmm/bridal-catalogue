import { createClient } from '@/utils/supabase/server';
import SalesPointsClient from '@/components/SalesPointsClient';

export const dynamic = 'force-dynamic';

export default async function SalesPointsPage() {
    const supabase = await createClient();

    const { data: salesPoints } = await supabase
        .from('sales_points')
        .select('*')
        .order('name', { ascending: true });

    return (
        <SalesPointsClient salesPoints={salesPoints || []} />
    );
}
