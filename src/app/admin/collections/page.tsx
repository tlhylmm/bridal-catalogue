import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { deleteCollection } from '@/actions/collectionActions';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage() {
    const supabase = await createClient();
    const { data: collections } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Manage Collections</h1>
                <Link href="/admin/collections/new" className="admin-btn admin-btn-primary">
                    + Add New Collection
                </Link>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collections?.map((col) => (
                            <tr key={col.id}>
                                <td style={{ fontWeight: 600 }}>{col.name}</td>
                                <td style={{ color: '#888' }}>{col.slug}</td>
                                <td>
                                    <div className="admin-actions">
                                        <Link href={`/admin/collections/${col.id}/edit`} className="admin-btn admin-btn-secondary">
                                            Edit
                                        </Link>
                                        <form action={deleteCollection.bind(null, col.id)}>
                                            <DeleteButton itemName={col.name} />
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!collections || collections.length === 0) && (
                            <tr>
                                <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                                    No collections found. Add your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
