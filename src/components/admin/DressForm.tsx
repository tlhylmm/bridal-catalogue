'use client';

import { useState, useCallback } from 'react';
import { createDress, updateDress } from '@/actions/dressActions';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
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
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [existingMainImage, setExistingMainImage] = useState(dress?.main_image || '');
    const [originalMainImage] = useState(dress?.main_image || ''); // Track original for deletion
    const [pendingGalleryFiles, setPendingGalleryFiles] = useState<File[]>([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(dress?.gallery_images || []);
    const [originalGalleryImages] = useState<string[]>(dress?.gallery_images || []); // Track original for deletion
    const [submitting, setSubmitting] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    const handleGalleryChange = useCallback((files: File[], existingUrls: string[]) => {
        setPendingGalleryFiles(files);
        setExistingGalleryImages(existingUrls);
    }, []);

    const handleMainImageChange = useCallback((file: File | null) => {
        setMainImageFile(file);
        if (file) {
            setExistingMainImage(''); // Clear existing if new one is selected
        }
    }, []);

    // Helper to extract filename from URL
    const extractFilename = (url: string): string | null => {
        try {
            const urlParts = url.split('/');
            return urlParts[urlParts.length - 1];
        } catch {
            return null;
        }
    };

    // Delete images from storage
    const deleteImagesFromStorage = async (urls: string[]) => {
        const filenames = urls.map(extractFilename).filter(Boolean) as string[];
        if (filenames.length > 0) {
            try {
                await supabase.storage.from('images').remove(filenames);
            } catch (err) {
                console.error('Error deleting images from storage:', err);
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

                // Use proxy URL for browser caching
                mainImageUrl = `/api/images/${fileName}`;

                // Delete old main image if it was replaced
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
                    console.error('Gallery upload error:', uploadError);
                    continue;
                }

                // Use proxy URL for browser caching
                newGalleryUrls.push(`/api/images/${fileName}`);
            }

            // Combine existing and new gallery images
            const allGalleryImages = [...existingGalleryImages, ...newGalleryUrls];

            // Find removed gallery images and delete them from storage
            if (isEdit) {
                const removedImages = originalGalleryImages.filter(
                    url => !existingGalleryImages.includes(url)
                );
                if (removedImages.length > 0) {
                    await deleteImagesFromStorage(removedImages);
                }
            }

            // Set the uploaded URLs in formData
            formData.set('mainImage', mainImageUrl);
            formData.set('galleryImages', JSON.stringify(allGalleryImages));

            // Call the server action
            if (isEdit && dress?.id) {
                await updateDress(dress.id, formData);
            } else {
                await createDress(formData);
            }

            // Redirect manually (server action redirect throws in client context)
            router.push('/admin/dresses');
            router.refresh();
        } catch (err: unknown) {
            // Check if it's a Next.js redirect (NEXT_REDIRECT)
            if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
                // This is expected, redirect is happening
                router.push('/admin/dresses');
                router.refresh();
                return;
            }
            console.error('Error submitting form:', err);
            alert('Failed to save dress. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
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
                    onImageReady={handleMainImageChange}
                />

                <GalleryUploader
                    defaultImages={dress?.gallery_images}
                    onImagesReady={handleGalleryChange}
                />
            </div>

            <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                {submitting ? 'Uploading & Saving...' : (isEdit ? 'Save Changes' : 'Create Dress')}
            </button>
        </form>
    );
}
