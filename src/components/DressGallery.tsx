'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../app/(public)/dresses/[slug]/page.module.css';

interface DressGalleryProps {
    mainImage: string;
    galleryImages: string[];
    dressName: string;
}

export default function DressGallery({ mainImage, galleryImages, dressName }: DressGalleryProps) {
    // All images: main first, then gallery
    const allImages = [mainImage, ...galleryImages].filter(Boolean);
    const [currentMain, setCurrentMain] = useState(allImages[0] || '');
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const handleThumbnailClick = (img: string) => {
        if (img === currentMain) {
            // Same image clicked - open lightbox
            setLightboxOpen(true);
        } else {
            // Different image - swap to main
            setCurrentMain(img);
        }
    };

    const handleMainClick = () => {
        setLightboxOpen(true);
    };

    return (
        <>
            <div className={styles.gallery}>
                {/* Main Image */}
                {currentMain && (
                    <div
                        className={styles.mainImageWrapper}
                        onClick={handleMainClick}
                    >
                        <Image
                            src={currentMain}
                            alt={dressName}
                            fill
                            className={styles.mainImage}
                            priority
                            sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                    </div>
                )}

                {/* Horizontal Scrollable Thumbnails */}
                {allImages.length > 1 && (
                    <div className={styles.thumbnails}>
                        {allImages.map((img, index) => (
                            <div
                                key={index}
                                className={`${styles.thumbnailWrapper} ${img === currentMain ? styles.thumbnailActive : ''}`}
                                onClick={() => handleThumbnailClick(img)}
                            >
                                <Image
                                    src={img}
                                    alt={`${dressName} view ${index + 1}`}
                                    fill
                                    className={styles.mainImage}
                                    sizes="100px"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className={styles.lightbox}
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        className={styles.lightboxClose}
                        onClick={() => setLightboxOpen(false)}
                    >
                        ×
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={currentMain}
                        alt={dressName}
                        className={styles.lightboxImage}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
