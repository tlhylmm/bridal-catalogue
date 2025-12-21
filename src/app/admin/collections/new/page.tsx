import CollectionForm from '@/components/admin/CollectionForm';

export default function NewCollectionPage() {
    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>Add New Collection</h1>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <CollectionForm />
            </div>
        </div>
    );
}
