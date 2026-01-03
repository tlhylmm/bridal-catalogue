import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { DeleteCollectionButton } from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage() {
    const supabase = await createClient();

    // Fetch collections
    const { data: collections } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch dress counts per collection
    const { data: dresses } = await supabase
        .from('dresses')
        .select('collection_id');

    // Count dresses per collection
    const dressCountMap = new Map<string, number>();
    dresses?.forEach(dress => {
        if (dress.collection_id) {
            dressCountMap.set(
                dress.collection_id,
                (dressCountMap.get(dress.collection_id) || 0) + 1
            );
        }
    });

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Koleksiyonları Yönet</h1>
                <Link href="/admin/collections/new" className="admin-btn admin-btn-primary">
                    + Yeni Koleksiyon Ekle
                </Link>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Koleksiyon Adı</th>
                            <th>Link Adı</th>
                            <th>Kıyafet Sayısı</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collections?.map((col) => {
                            const dressCount = dressCountMap.get(col.id) || 0;
                            return (
                                <tr key={col.id}>
                                    <td style={{ fontWeight: 600 }}>{col.name}</td>
                                    <td style={{ color: '#888' }}>{col.slug}</td>
                                    <td>
                                        <span style={{
                                            background: dressCount > 0 ? '#f0f0f0' : '#fef2f2',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            color: dressCount > 0 ? '#666' : '#dc2626'
                                        }}>
                                            {dressCount} gelinlik
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <Link href={`/admin/collections/${col.id}/edit`} className="admin-btn admin-btn-secondary">
                                                Düzenle
                                            </Link>
                                            <DeleteCollectionButton
                                                collectionId={col.id}
                                                collectionName={col.name}
                                                dressCount={dressCount}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {(!collections || collections.length === 0) && (
                            <tr>
                                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                                    Burada koleksiyon bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
