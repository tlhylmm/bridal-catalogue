'use client';

import { useState } from 'react';
import { updateCollection } from '@/actions/collectionActions';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastProvider';
import { generateSlug } from '@/utils/slugify';

interface Collection {
    id: string;
    name: string;
    slug: string;
}

export default function EditCollectionForm({ collection }: { collection: Collection }) {
    const [name, setName] = useState(collection.name);
    const [slug, setSlug] = useState(collection.slug);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const handleNameBlur = () => {
        if (name && !slug) {
            setSlug(generateSlug(name));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('slug', slug);

            const result = await updateCollection(collection.id, formData);

            if (result.success) {
                showToast(`'${name}' koleksiyonu başarıyla güncellendi!`, 'success');
                router.push('/admin/collections');
                router.refresh();
            } else {
                showToast(`Hata: ${result.error}`, 'error');
            }
        } catch (err: unknown) {
            console.error('Koleksiyon güncellenirken hata:', err);
            showToast(`'${name}' koleksiyonu güncellenirken hata oluştu!`, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-input-group">
                <label className="admin-label">Koleksiyon Adı</label>
                <input
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleNameBlur}
                    className="admin-input"
                />
            </div>
            <div className="admin-input-group">
                <label className="admin-label">Link Adı (.com/isim kısmında görünüşü)</label>
                <input
                    name="slug"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="admin-input"
                />
            </div>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                {submitting ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
        </form>
    );
}
