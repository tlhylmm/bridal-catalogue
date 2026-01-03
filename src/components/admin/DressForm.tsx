'use client';

import { useState, useCallback } from 'react';
import { createDress, updateDress } from '@/actions/dressActions';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import GalleryUploader from './GalleryUploader';
import { useToast } from './ToastProvider';
import { generateSlug } from '@/utils/slugify';

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
    const [name, setName] = useState(dress?.name || '');
    const [slug, setSlug] = useState(dress?.slug || '');
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [existingMainImage, setExistingMainImage] = useState(dress?.main_image || '');
    const [originalMainImage] = useState(dress?.main_image || '');
    const [pendingGalleryFiles, setPendingGalleryFiles] = useState<File[]>([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(dress?.gallery_images || []);
    const [originalGalleryImages] = useState<string[]>(dress?.gallery_images || []);
    const [submitting, setSubmitting] = useState(false);

    const supabase = createClient();
    const router = useRouter();
    const { showToast } = useToast();

    // Auto-generate slug when name field loses focus
    const handleNameBlur = () => {
        if (name && !slug) {
            setSlug(generateSlug(name));
        }
    };

    const handleGalleryChange = useCallback((files: File[], existingUrls: string[]) => {
        setPendingGalleryFiles(files);
        setExistingGalleryImages(existingUrls);
    }, []);

    const handleMainImageChange = useCallback((file: File | null) => {
        setMainImageFile(file);
        if (file) {
            setExistingMainImage('');
        }
    }, []);

    const extractFilename = (url: string): string | null => {
        try {
            const urlParts = url.split('/');
            return urlParts[urlParts.length - 1];
        } catch {
            return null;
        }
    };

    const deleteImagesFromStorage = async (urls: string[]) => {
        const filenames = urls.map(extractFilename).filter(Boolean) as string[];
        if (filenames.length > 0) {
            try {
                await supabase.storage.from('images').remove(filenames);
            } catch (err) {
                console.error('Depodan fotoğrafı silerken hata oluştu:', err);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const form = e.currentTarget;
            const formData = new FormData(form);

            // Upload main image if there's a new one
            let mainImageUrl = existingMainImage;
            if (mainImageFile) {
                const fileName = `main-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(fileName, mainImageFile);

                if (uploadError) throw uploadError;

                mainImageUrl = `/api/images/${fileName}`;

                if (isEdit && originalMainImage && originalMainImage !== mainImageUrl) {
                    await deleteImagesFromStorage([originalMainImage]);
                }
            }

            // Upload pending gallery images
            const newGalleryUrls: string[] = [];
            for (let i = 0; i < pendingGalleryFiles.length; i++) {
                const file = pendingGalleryFiles[i];
                const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}-${i}.jpg`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error('Galeri yükleme hatası:', uploadError);
                    continue;
                }

                newGalleryUrls.push(`/api/images/${fileName}`);
            }

            const allGalleryImages = [...existingGalleryImages, ...newGalleryUrls];

            if (isEdit) {
                const removedImages = originalGalleryImages.filter(
                    url => !existingGalleryImages.includes(url)
                );
                if (removedImages.length > 0) {
                    await deleteImagesFromStorage(removedImages);
                }
            }

            formData.set('mainImage', mainImageUrl);
            formData.set('galleryImages', JSON.stringify(allGalleryImages));

            let result;
            if (isEdit && dress?.id) {
                result = await updateDress(dress.id, formData);
            } else {
                result = await createDress(formData);
            }

            if (result.success) {
                showToast(`'${name}' başarıyla ${isEdit ? 'güncellendi' : 'eklendi'}!`, 'success');
                router.push('/admin/dresses');
                router.refresh();
            } else {
                showToast(`Hata: ${result.error}`, 'error');
            }
        } catch (err: unknown) {
            console.error('Formu gönderirken hata:', err);
            showToast(`'${name}' kaydedilirken hata oluştu!`, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-row">
                    <div className="admin-input-group">
                        <label className="admin-label">Name</label>
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
                        <label className="admin-label">Slug (URL)</label>
                        <input
                            name="slug"
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="admin-input"
                            placeholder="e.g. the-aylin"
                        />
                    </div>
                </div>

                <div className="admin-input-group">
                    <label className="admin-label">Koleksiyon</label>
                    <select name="collectionId" defaultValue={dress?.collection_id || ''} className="admin-select">
                        <option value="">-- Koleksiyon Yok --</option>
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
                        <label className="admin-label">Silüet</label>
                        <input
                            name="silhouette"
                            type="text"
                            defaultValue={dress?.silhouette}
                            className="admin-input"
                        />
                    </div>
                    <div className="admin-input-group">
                        <label className="admin-label">Kumaş</label>
                        <input
                            name="fabric"
                            type="text"
                            defaultValue={dress?.fabric}
                            className="admin-input"
                        />
                    </div>
                    <div className="admin-input-group">
                        <label className="admin-label">Yaka</label>
                        <input
                            name="neckline"
                            type="text"
                            defaultValue={dress?.neckline}
                            className="admin-input"
                        />
                    </div>
                </div>

                <div className="admin-images-section">
                    <h3 className="admin-images-title">Fotoğraflar</h3>

                    <ImageUploader
                        label="Ana Fotoğraf"
                        defaultImage={dress?.main_image}
                        onImageReady={handleMainImageChange}
                    />

                    <GalleryUploader
                        defaultImages={dress?.gallery_images}
                        onImagesReady={handleGalleryChange}
                    />
                </div>

                <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                    {submitting ? 'Yükleniyor & Kaydediliyor...' : (isEdit ? 'Değişiklikleri Kaydet' : 'Gelinlik Oluştur')}
                </button>
            </form>
        </>
    );
}
