import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import SalesPointForm from '@/components/admin/SalesPointForm';

export const dynamic = 'force-dynamic';

export default async function EditSalesPointPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    const { data: salesPoint } = await supabase
        .from('sales_points')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!salesPoint) {
        notFound();
    }

    return (
        <div>
            <h1 className="admin-page-title">Satış Noktası Düzenle</h1>
            <SalesPointForm
                initialData={{
                    id: salesPoint.id,
                    name: salesPoint.name,
                    locations: salesPoint.locations || []
                }}
            />
        </div>
    );
}
