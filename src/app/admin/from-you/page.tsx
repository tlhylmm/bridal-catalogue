import { createClient } from '@/utils/supabase/server';
import { deleteFromYouImage } from '@/actions/fromYouActions';
import DeleteButton from '@/components/admin/DeleteButton';
import FromYouForm from '@/components/admin/FromYouForm';

export const dynamic = 'force-dynamic';

export default async function AdminFromYouPage() {
    const supabase = await createClient();

    const { data: images } = await supabase
        .from('from_you_images')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <h1 className="admin-page-title">From You - Customer Gallery</h1>

            {/* Add new photo form */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add New Photo</h2>
                <FromYouForm />
            </div>

            {/* Existing photos */}
            <div className="admin-card">
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Uploaded Photos</h2>

                {images && images.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {images.map((img) => (
                            <div key={img.id} style={{
                                position: 'relative',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img.image_url}
                                    alt={img.caption || 'Customer photo'}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '0.75rem' }}>
                                    {img.caption && (
                                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>{img.caption}</p>
                                    )}
                                    <form action={deleteFromYouImage.bind(null, img.id, img.image_url)}>
                                        <DeleteButton itemName="this photo" />
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
                        No photos yet. Add your first one above!
                    </p>
                )}
            </div>
        </div>
    );
}
