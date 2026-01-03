'use client';

import { useState, useRef, useEffect } from 'react';
import { createFromYouImage } from '@/actions/fromYouActions';
import { createClient } from '@/utils/supabase/client';
import { compressImages } from '@/utils/imageCompression';
import { useToast } from './ToastProvider';

interface PendingImage {
    file: File;
    previewUrl: string;
}

export default function FromYouForm() {
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
    const [compressing, setCompressing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();
    const { showToast } = useToast();

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            pendingImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
        };
    }, [pendingImages]);

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

            // Create preview URLs for compressed files
            const newPendingImages: PendingImage[] = compressedFiles.map(file => ({
                file,
                previewUrl: URL.createObjectURL(file)
            }));

            setPendingImages(prev => [...prev, ...newPendingImages]);

            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error('Sıkıştırma hatası:', err);
            setError('Bazı fotoğrafları sıkıştırırken hata yaşandı');
        }

        setCompressing(false);
    };

    const removeImage = (index: number) => {
        setPendingImages(prev => {
            const toRemove = prev[index];
            if (toRemove) {
                URL.revokeObjectURL(toRemove.previewUrl);
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (pendingImages.length === 0) {
            setError('Lütfen en az bir fotoğraf seçin.');
            return;
        }

        setSubmitting(true);
        setError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const caption = formData.get('caption') as string;
        const imageCount = pendingImages.length;

        try {
            // Upload all images and create entries
            for (let i = 0; i < pendingImages.length; i++) {
                const { file } = pendingImages[i];
                const randomStr = Math.random().toString(36).substring(2, 10);
                const fileName = `fromyou-${Date.now()}-${randomStr}-${i}.jpg`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error('Yükleme hatası:', uploadError);
                    continue;
                }

                // Use proxy URL for 1-year browser caching
                const proxyUrl = `/api/images/${fileName}`;

                const data = new FormData();
                data.append('imageUrl', proxyUrl);
                data.append('caption', caption || '');
                await createFromYouImage(data);
            }

            // Clear form
            setPendingImages([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            form.reset();

            showToast(`${imageCount} fotoğraf başarıyla eklendi!`, 'success');
        } catch (err) {
            console.error('Kaydederken Hata:', err);
            setError('Fotoğrafları kaydederken bir hata yaşandı.');
            showToast('Fotoğraflar kaydedilirken hata oluştu!', 'error');
        }

        setSubmitting(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-images-section">
                    <label className="admin-label">Customer Photos (multiple allowed)</label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            disabled={compressing || submitting}
                            style={{ fontSize: '0.9rem' }}
                        />
                        {compressing && <span style={{ fontSize: '0.8rem', color: '#666' }}>Compressing...</span>}
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{error}</p>}

                    {pendingImages.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            {pendingImages.map((img, index) => (
                                <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={img.previewUrl}
                                        alt={`Upload ${index}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            border: '2px solid var(--color-gold)'
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '4px',
                                        left: '4px',
                                        background: 'var(--color-gold)',
                                        color: '#fff',
                                        fontSize: '8px',
                                        padding: '2px 4px',
                                        borderRadius: '2px'
                                    }}>NEW</span>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        disabled={submitting}
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
                    <label className="admin-label">Yüklenen fotoğraflar için açıklama (isteğe bağlı)</label>
                    <input
                        name="caption"
                        type="text"
                        className="admin-input"
                        placeholder="Ör: Ayşe hanımın düğününden."
                    />
                </div>

                <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={submitting || pendingImages.length === 0}
                >
                    {submitting ? 'Yükleniyor & Kaydediliyor...' : `${pendingImages.length} fotoğraf ekle`}
                </button>
            </form>
        </>
    );
}
