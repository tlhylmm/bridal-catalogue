'use client';

import { useState, useEffect } from 'react';
import { compressImages } from '@/utils/imageCompression';

interface PendingImage {
    file: File;
    previewUrl: string;
}

interface GalleryUploaderProps {
    onImagesReady: (files: File[], existingUrls: string[]) => void;
    defaultImages?: string[];
}

export default function GalleryUploader({ onImagesReady, defaultImages = [] }: GalleryUploaderProps) {
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(defaultImages);
    const [compressing, setCompressing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            pendingImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
        };
    }, [pendingImages]);

    // Notify parent when images change
    useEffect(() => {
        onImagesReady(pendingImages.map(p => p.file), existingImages);
    }, [pendingImages, existingImages, onImagesReady]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setCompressing(true);
        setError(null);

        try {
            // Compress all images locally
            const compressedFiles = await compressImages(Array.from(files), {
                maxWidth: 1920,
                maxHeight: 1920,
                quality: 0.85
            });

            // Create preview URLs
            const newPendingImages: PendingImage[] = compressedFiles.map(file => ({
                file,
                previewUrl: URL.createObjectURL(file)
            }));

            setPendingImages(prev => [...prev, ...newPendingImages]);

            // Clear the input
            e.target.value = '';
        } catch (err) {
            console.error('Error compressing:', err);
            setError('Failed to compress some images');
        }

        setCompressing(false);
    };

    const removePendingImage = (index: number) => {
        setPendingImages(prev => {
            const toRemove = prev[index];
            if (toRemove) {
                URL.revokeObjectURL(toRemove.previewUrl);
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeExistingImage = (index: number) => {
        if (!confirm('Are you sure you want to remove this image? It will be permanently deleted from storage when you save.')) {
            return;
        }
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label className="admin-label">Gallery Images</label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    disabled={compressing}
                    style={{ fontSize: '0.9rem' }}
                />
                {compressing && <span style={{ fontSize: '0.8rem', color: '#666' }}>Compressing...</span>}
            </div>

            {error && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{error}</p>}

            {(pendingImages.length > 0 || existingImages.length > 0) && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Existing images (already uploaded) */}
                    {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} style={{ position: 'relative', width: '80px', height: '100px' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                            <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
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

                    {/* Pending images (not yet uploaded) */}
                    {pendingImages.map((img, index) => (
                        <div key={`pending-${index}`} style={{ position: 'relative', width: '80px', height: '100px' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.previewUrl} alt={`New ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '2px solid var(--color-gold)' }} />
                            <span style={{
                                position: 'absolute',
                                bottom: '4px',
                                left: '4px',
                                background: 'var(--color-gold)',
                                color: '#fff',
                                fontSize: '10px',
                                padding: '2px 4px',
                                borderRadius: '2px'
                            }}>NEW</span>
                            <button
                                type="button"
                                onClick={() => removePendingImage(index)}
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
