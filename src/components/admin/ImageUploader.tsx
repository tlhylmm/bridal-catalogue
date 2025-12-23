'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/utils/imageCompression';

interface PendingImage {
    file: File;
    previewUrl: string;
}

interface ImageUploaderProps {
    onImageReady: (file: File | null) => void;
    label?: string;
    defaultImage?: string;
}

export default function ImageUploader({ onImageReady, label = "Fotoğraf Yükle", defaultImage }: ImageUploaderProps) {
    const [compressing, setCompressing] = useState(false);
    const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
    const [existingImage, setExistingImage] = useState<string | undefined>(defaultImage);
    const [error, setError] = useState<string | null>(null);

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (pendingImage?.previewUrl) {
                URL.revokeObjectURL(pendingImage.previewUrl);
            }
        };
    }, [pendingImage]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setCompressing(true);
            setError(null);

            const file = e.target.files?.[0];
            if (!file) return;

            // Compress the image locally
            const compressedFile = await compressImage(file, {
                maxWidth: 1920,
                maxHeight: 1920,
                quality: 0.85
            });

            // Revoke old preview URL if exists
            if (pendingImage?.previewUrl) {
                URL.revokeObjectURL(pendingImage.previewUrl);
            }

            // Create preview URL for compressed file
            const previewUrl = URL.createObjectURL(compressedFile);

            setPendingImage({ file: compressedFile, previewUrl });
            setExistingImage(undefined);
            onImageReady(compressedFile);

            // Clear the input
            e.target.value = '';

        } catch (err: unknown) {
            console.error('Fotoğrafı Sıkıştırırken hata oluştu:', err);
            const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
            setError('Sıkıştırma hatası: ' + errorMessage);
        } finally {
            setCompressing(false);
        }
    };

    const handleRemove = () => {
        if (pendingImage?.previewUrl) {
            URL.revokeObjectURL(pendingImage.previewUrl);
        }
        setPendingImage(null);
        setExistingImage(undefined);
        onImageReady(null);
    };

    const previewUrl = pendingImage?.previewUrl || existingImage;

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label className="admin-label">{label}</label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={compressing}
                    style={{ fontSize: '0.9rem' }}
                />
                {compressing && <span style={{ fontSize: '0.8rem', color: '#666' }}>Compressing...</span>}
            </div>

            {error && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}

            {previewUrl && (
                <div style={{ marginTop: '1rem', position: 'relative', width: '120px', height: '160px' }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: '#dc2626',
                            color: '#fff',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}
