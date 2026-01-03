'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './DressCard.module.css';

interface DressCardProps {
    dress: {
        id: string;
        name: string;
        slug: string;
        mainImage: string;
    };
}

export default function DressCard({ dress }: DressCardProps) {
    const [isImageLoading, setIsImageLoading] = useState(true);

    return (
        <Link href={`/dresses/${dress.slug}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                {dress.mainImage ? (
                    <>
                        <Image
                            src={dress.mainImage}
                            alt={dress.name}
                            fill
                            className={`${styles.image} ${isImageLoading ? styles.imageLoading : ''}`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onLoad={() => setIsImageLoading(false)}
                        />
                        {isImageLoading && (
                            <div className={styles.spinnerOverlay}>
                                <div className={styles.imageSpinner}></div>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#e5e5e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#888'
                    }}>
                        Fotoğraf Yok
                    </div>
                )}
            </div>
            <h3 className={styles.name}>
                {dress.name}
            </h3>
        </Link>
    );
}
