'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { compressImages } from '@/utils/imageCompression';

interface GalleryUploaderProps {
    onImagesChange: (urls: string[]) => void;
    defaultImages?: string[];
}

export default function GalleryUploader({ onImagesChange, defaultImages = [] }: GalleryUploaderProps) {
    const [images, setImages] = useState<string[]>(defaultImages);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
                const fileName = `gallery-${Date.now()}-${i}.jpg`;

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

            const updatedImages = [...images, ...newUrls];
            setImages(updatedImages);
            onImagesChange(updatedImages);

            // Clear the input
            e.target.value = '';
        } catch (err) {
            console.error('Error uploading:', err);
            setError('Failed to upload some images');
        }

        setUploading(false);
    };

    const removeImage = (index: number) => {
        const updated = images.filter((_, i) => i !== index);
        setImages(updated);
        onImagesChange(updated);
    };

    return (
        <div>
            <label className="admin-label">Gallery Images</label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                <input
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

            {images.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {images.map((url, index) => (
                        <div key={index} style={{ position: 'relative', width: '80px', height: '100px' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
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
    );
}
