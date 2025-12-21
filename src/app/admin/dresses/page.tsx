import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { deleteDress } from '@/actions/dressActions';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminDressesPage() {
    const supabase = await createClient();
    const { data: dresses } = await supabase
        .from('dresses')
        .select('*, collections(name)')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Manage Dresses</h1>
                <Link href="/admin/dresses/new" className="admin-btn admin-btn-primary">
                    + Add New Dress
                </Link>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Collection</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dresses?.map((dress) => (
                            <tr key={dress.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{dress.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>/{dress.slug}</div>
                                </td>
                                <td>{dress.collections?.name || '-'}</td>
                                <td>
                                    <div className="admin-actions">
                                        <Link href={`/admin/dresses/${dress.id}/edit`} className="admin-btn admin-btn-secondary">
                                            Edit
                                        </Link>
                                        <form action={deleteDress.bind(null, dress.id)}>
                                            <DeleteButton itemName={dress.name} />
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!dresses || dresses.length === 0) && (
                            <tr>
                                <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                                    No dresses found. Add your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
