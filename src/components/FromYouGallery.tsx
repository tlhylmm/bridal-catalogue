'use client';

import { useState } from 'react';
import styles from '../app/(public)/from-you/page.module.css';

interface FromYouGalleryProps {
    images: {
        id: string;
        image_url: string;
        caption?: string;
    }[];
}

export default function FromYouGallery({ images }: FromYouGalleryProps) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    return (
        <>
            <div className={styles.gallery}>
                {images.map((img) => (
                    <div
                        key={img.id}
                        className={styles.imageCard}
                        onClick={() => setLightboxImage(img.image_url)}
                    >
                        <div className={styles.imageWrapper}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img.image_url}
                                alt={img.caption || 'Müşteri fotoğrafı'}
                                className={styles.image}
                                loading="lazy"
                            />
                        </div>
                        {img.caption && (
                            <p className={styles.caption}>{img.caption}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <div
                    className={styles.lightbox}
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        className={styles.lightboxClose}
                        onClick={() => setLightboxImage(null)}
                    >
                        ×
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={lightboxImage}
                        alt="Enlarged view"
                        className={styles.lightboxImage}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
