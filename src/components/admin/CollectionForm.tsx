'use client';

import { createCollection } from '@/actions/collectionActions';

export default function CollectionForm() {
    return (
        <form action={createCollection} style={{ maxWidth: '500px', display: 'grid', gap: '1.5rem' }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Koleksiyon Adı</label>
                <input name="name" type="text" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc' }} placeholder="e.g. 2025 Collection" />
            </div>
            <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Link Adı (.com/isim kısmında görünecek kısım)</label>
                <input name="slug" type="text" required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc' }} placeholder="e.g. 2025-collection" />
            </div>
            <button
                type="submit"
                style={{
                    backgroundColor: 'var(--color-black)',
                    color: '#fff',
                    padding: '1rem',
                    border: 'none',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontWeight: 700
                }}
            >
                Koleksiyonu Kaydet
            </button>
        </form>
    );
}
