'use client';

import { useState, useRef } from 'react';
import { createFromYouImage } from '@/actions/fromYouActions';
import { createClient } from '@/utils/supabase/client';
import { compressImages } from '@/utils/imageCompression';

export default function FromYouForm() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError(null);

        try {
            // Compress all images
            const compressedFiles = await compressImages(Array.from(files), {
                maxWidth: 1920,
                maxHeight: 1920,
                quality: 0.85
            });

            const newUrls: string[] = [];

            for (let i = 0; i < compressedFiles.length; i++) {
                const file = compressedFiles[i];
                const fileName = `fromyou-${Date.now()}-${i}.jpg`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    continue;
                }

                const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                newUrls.push(data.publicUrl);
            }

            setImageUrls(prev => [...prev, ...newUrls]);

            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error('Error uploading:', err);
            setError('Failed to upload some images');
        }

        setUploading(false);
    };

    const removeImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (formData: FormData) => {
        if (imageUrls.length === 0) {
            setError('Please upload at least one image');
            return;
        }

        setSubmitting(true);
        const caption = formData.get('caption') as string;

        try {
            // Create an entry for each image with the same caption
            for (const url of imageUrls) {
                const data = new FormData();
                data.append('imageUrl', url);
                data.append('caption', caption || '');
                await createFromYouImage(data);
            }

            // Clear form
            setImageUrls([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error('Error saving:', err);
            setError('Failed to save images');
        }

        setSubmitting(false);
    };

    return (
        <form action={handleSubmit} className="admin-form">
            <div className="admin-images-section">
                <label className="admin-label">Customer Photos (multiple allowed)</label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        disabled={uploading}
                        style={{ fontSize: '0.9rem' }}
                    />
                    {uploading && <span style={{ fontSize: '0.8rem', color: '#666' }}>Compressing & Uploading...</span>}
                </div>

                {error && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{error}</p>}

                {imageUrls.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {imageUrls.map((url, index) => (
                            <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Upload ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        backgroundColor: '#dc2626',
                                        color: '#fff',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="admin-input-group">
                <label className="admin-label">Caption for all photos (optional)</label>
                <input
                    name="caption"
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Sarah's big day in Istanbul"
                />
            </div>

            <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={submitting || imageUrls.length === 0}
            >
                {submitting ? 'Saving...' : `Add ${imageUrls.length} Photo${imageUrls.length !== 1 ? 's' : ''}`}
            </button>
        </form>
    );
}
