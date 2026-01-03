import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import EditCollectionForm from '@/components/admin/EditCollectionForm';

export const dynamic = 'force-dynamic';

export default async function EditCollectionPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    const { data: collection } = await supabase
        .from('collections')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!collection) {
        notFound();
    }

    return (
        <div>
            <h1 className="admin-page-title">Koleksiyonu Düzenle</h1>
            <div className="admin-card">
                <EditCollectionForm collection={collection} />
            </div>
        </div>
    );
}
