import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch counts
    const { count: dressCount } = await supabase
        .from('dresses')
        .select('*', { count: 'exact', head: true });

    const { count: collectionCount } = await supabase
        .from('collections')
        .select('*', { count: 'exact', head: true });

    return (
        <div>
            <h1 className="admin-page-title">Dashboard</h1>

            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Welcome Back</h2>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    Manage your atelier&apos;s catalogue from this panel.
                </p>

                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <Link href="/admin/dresses" style={{ textDecoration: 'none' }}>
                        <div style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px', transition: 'border-color 0.2s' }}>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dressCount || 0}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#888' }}>Dresses</p>
                        </div>
                    </Link>
                    <Link href="/admin/collections" style={{ textDecoration: 'none' }}>
                        <div style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px', transition: 'border-color 0.2s' }}>
                            <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{collectionCount || 0}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#888' }}>Collections</p>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="admin-card">
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/admin/dresses/new" className="admin-btn admin-btn-primary">
                        + Add New Dress
                    </Link>
                    <Link href="/admin/collections/new" className="admin-btn admin-btn-primary">
                        + Add Collection
                    </Link>
                </div>
            </div>
        </div>
    );
}
