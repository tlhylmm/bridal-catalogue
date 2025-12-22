import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { deleteSalesPoint } from '@/actions/salesPointActions';
import DeleteButton from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

interface Location {
    city: string;
    address: string;
    mapLink?: string;
}

export default async function AdminSalesPointsPage() {
    const supabase = await createClient();

    const { data: salesPoints } = await supabase
        .from('sales_points')
        .select('*')
        .order('name', { ascending: true });

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Sales Points</h1>
                <Link href="/admin/sales-points/new" className="admin-btn admin-btn-primary">
                    Add Sales Point
                </Link>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Locations</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesPoints?.map((point) => {
                            const locations = point.locations as Location[];
                            const cities = [...new Set(locations.map(l => l.city))];

                            return (
                                <tr key={point.id}>
                                    <td style={{ fontWeight: 600 }}>{point.name}</td>
                                    <td>
                                        <span style={{ color: '#666', fontSize: '0.9rem' }}>
                                            {locations.length} location{locations.length !== 1 ? 's' : ''}
                                            {cities.length > 0 && ` (${cities.join(', ')})`}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <Link
                                                href={`/admin/sales-points/${point.id}/edit`}
                                                className="admin-btn admin-btn-secondary"
                                            >
                                                Edit
                                            </Link>
                                            <form action={deleteSalesPoint.bind(null, point.id)}>
                                                <DeleteButton itemName={point.name} />
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {(!salesPoints || salesPoints.length === 0) && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                                    No sales points yet. Add your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
