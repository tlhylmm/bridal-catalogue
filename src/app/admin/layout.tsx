import Link from "next/link";
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import './admin.css';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    Gültekin Admin
                </div>

                <nav className="admin-nav">
                    <Link href="/admin" className="admin-nav-link">Dashboard</Link>
                    <Link href="/admin/dresses" className="admin-nav-link">Dresses</Link>
                    <Link href="/admin/collections" className="admin-nav-link">Collections</Link>
                    <Link href="/admin/from-you" className="admin-nav-link">From You</Link>
                    <Link href="/admin/sales-points" className="admin-nav-link">Sales Points</Link>
                </nav>

                <div className="admin-user">
                    <span className="admin-email">{user.email}</span>
                    <Link href="/" className="admin-back-link">Return to Site</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
