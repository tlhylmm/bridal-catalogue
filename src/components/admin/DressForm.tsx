'use client';

import { useState } from 'react';
import { createDress, updateDress } from '@/actions/dressActions';
import ImageUploader from './ImageUploader';
import GalleryUploader from './GalleryUploader';

interface Collection {
    id: string;
    name: string;
}

interface DressData {
    id?: string;
    name?: string;
    slug?: string;
    collection_id?: string;
    description?: string;
    silhouette?: string;
    fabric?: string;
    neckline?: string;
    main_image?: string;
    gallery_images?: string[];
}

interface DressFormProps {
    collections: Collection[];
    dress?: DressData;
    isEdit?: boolean;
}

export default function DressForm({ collections, dress, isEdit = false }: DressFormProps) {
    const [mainImageUrl, setMainImageUrl] = useState(dress?.main_image || '');
    const [galleryImages, setGalleryImages] = useState<string[]>(dress?.gallery_images || []);

    const formAction = isEdit && dress?.id
        ? updateDress.bind(null, dress.id)
        : createDress;

    return (
        <form action={formAction} className="admin-form">
            <div className="admin-form-row">
                <div className="admin-input-group">
                    <label className="admin-label">Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        defaultValue={dress?.name}
                        className="admin-input"
                    />
                </div>
                <div className="admin-input-group">
                    <label className="admin-label">Slug (URL)</label>
                    <input
                        name="slug"
                        type="text"
                        required
                        defaultValue={dress?.slug}
                        className="admin-input"
                        placeholder="e.g. the-aylin-gown"
                    />
                </div>
            </div>

            <div className="admin-input-group">
                <label className="admin-label">Collection</label>
                <select name="collectionId" defaultValue={dress?.collection_id || ''} className="admin-select">
                    <option value="">-- No Collection --</option>
                    {collections.map((col) => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                </select>
            </div>

            <div className="admin-input-group">
                <label className="admin-label">Description</label>
                <textarea
                    name="description"
                    rows={4}
                    defaultValue={dress?.description}
                    className="admin-textarea"
                />
            </div>

            <div className="admin-form-row-3">
                <div className="admin-input-group">
                    <label className="admin-label">Silhouette</label>
                    <input
                        name="silhouette"
                        type="text"
                        defaultValue={dress?.silhouette}
                        className="admin-input"
                    />
                </div>
                <div className="admin-input-group">
                    <label className="admin-label">Fabric</label>
                    <input
                        name="fabric"
                        type="text"
                        defaultValue={dress?.fabric}
                        className="admin-input"
                    />
                </div>
                <div className="admin-input-group">
                    <label className="admin-label">Neckline</label>
                    <input
                        name="neckline"
                        type="text"
                        defaultValue={dress?.neckline}
                        className="admin-input"
                    />
                </div>
            </div>

            <div className="admin-images-section">
                <h3 className="admin-images-title">Images</h3>

                <ImageUploader
                    label="Main Image"
                    defaultImage={dress?.main_image}
                    onUploadComplete={(url) => setMainImageUrl(url)}
                />
                <input name="mainImage" type="hidden" value={mainImageUrl} />

                <GalleryUploader
                    defaultImages={dress?.gallery_images}
                    onImagesChange={(urls) => setGalleryImages(urls)}
                />
                <input name="galleryImages" type="hidden" value={JSON.stringify(galleryImages)} />
            </div>

            <button type="submit" className="admin-btn admin-btn-primary">
                {isEdit ? 'Save Changes' : 'Create Dress'}
            </button>
        </form>
    );
}
