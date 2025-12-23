import { createClient } from '@/utils/supabase/server';
import DressForm from '@/components/admin/DressForm';

export const dynamic = 'force-dynamic';

export default async function NewDressPage() {
    const supabase = await createClient();
    const { data: collections } = await supabase
        .from('collections')
        .select('id, name')
        .order('name', { ascending: true });

    return (
        <div>
            <h1 className="admin-page-title">Yeni Kıyafet Ekle</h1>
            <div className="admin-card">
                <DressForm collections={collections || []} />
            </div>
        </div>
    );
}
