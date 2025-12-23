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
                    <Link href="/admin" className="admin-nav-link">Kontrol Paneli</Link>
                    <Link href="/admin/dresses" className="admin-nav-link">Gelinlikler</Link>
                    <Link href="/admin/collections" className="admin-nav-link">Koleksiyonlar</Link>
                    <Link href="/admin/from-you" className="admin-nav-link">Sizden Gelenler</Link>
                    <Link href="/admin/sales-points" className="admin-nav-link">Satış Noktaları</Link>
                </nav>

                <div className="admin-user">
                    <span className="admin-email">{user.email}</span>
                    <Link href="/" className="admin-back-link">Siteye geri dön</Link>
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
