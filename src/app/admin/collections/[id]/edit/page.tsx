import { createClient } from '@/utils/supabase/server';
import { updateCollection } from '@/actions/collectionActions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditCollectionPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();

    const { data: collection } = await supabase
        .from('collections')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!collection) {
        notFound();
    }

    const updateWithId = updateCollection.bind(null, collection.id);

    return (
        <div>
            <h1 className="admin-page-title">Edit Collection</h1>
            <div className="admin-card">
                <form action={updateWithId} className="admin-form">
                    <div className="admin-input-group">
                        <label className="admin-label">Collection Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            defaultValue={collection.name}
                            className="admin-input"
                        />
                    </div>
                    <div className="admin-input-group">
                        <label className="admin-label">Slug (URL)</label>
                        <input
                            name="slug"
                            type="text"
                            required
                            defaultValue={collection.slug}
                            className="admin-input"
                        />
                    </div>
                    <button type="submit" className="admin-btn admin-btn-primary">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
