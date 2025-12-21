'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { compressImage } from '@/utils/imageCompression';

interface ImageUploaderProps {
    onUploadComplete: (url: string) => void;
    label?: string;
    defaultImage?: string;
}

export default function ImageUploader({ onUploadComplete, label = "Upload Image", defaultImage }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(defaultImage);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            const file = e.target.files?.[0];
            if (!file) return;

            // Compress the image before upload
            const compressedFile = await compressImage(file, {
                maxWidth: 1920,
                maxHeight: 1920,
                quality: 0.85
            });

            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, compressedFile);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('images').getPublicUrl(fileName);

            setPreview(data.publicUrl);
            onUploadComplete(data.publicUrl);

            // Clear the input
            e.target.value = '';

        } catch (err: unknown) {
            console.error('Error uploading image:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError('Upload failed: ' + errorMessage);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label className="admin-label">{label}</label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    style={{ fontSize: '0.9rem' }}
                />
                {uploading && <span style={{ fontSize: '0.8rem', color: '#666' }}>Compressing & Uploading...</span>}
            </div>

            {error && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</p>}

            {preview && (
                <div style={{ marginTop: '1rem', width: '120px', height: '160px', backgroundColor: '#eee', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}
        </div>
    );
}
