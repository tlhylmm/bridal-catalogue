import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import DressForm from '@/components/admin/DressForm';

export const dynamic = 'force-dynamic';

export default async function EditDressPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    const { data: dress } = await supabase
        .from('dresses')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!dress) {
        notFound();
    }

    const { data: collections } = await supabase
        .from('collections')
        .select('id, name')
        .order('name', { ascending: true });

    return (
        <div>
            <h1 className="admin-page-title">Kıyafeti Düzenle</h1>
            <div className="admin-card">
                <DressForm collections={collections || []} dress={dress} isEdit />
            </div>
        </div>
    );
}
