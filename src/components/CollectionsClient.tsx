'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import DressCard from '@/components/DressCard';
import styles from '../app/(public)/collections/page.module.css';

interface Collection {
    id: string;
    name: string;
    slug: string;
}

interface Dress {
    id: string;
    name: string;
    slug: string;
    main_image: string;
    collection_id: string | null;
}

interface CollectionsClientProps {
    collections: Collection[];
    dresses: Dress[];
    initialCategory?: string;
}

const ITEMS_PER_LOAD = 12;

export default function CollectionsClient({ collections, dresses, initialCategory }: CollectionsClientProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Client-side filtering
    const filteredDresses = useMemo(() => {
        if (!activeCategory) {
            return dresses;
        }
        const collection = collections.find(c => c.slug === activeCategory);
        if (!collection) {
            return dresses;
        }
        return dresses.filter(d => d.collection_id === collection.id);
    }, [activeCategory, dresses, collections]);

    // Reset visible count when filter changes
    useEffect(() => {
        setVisibleCount(ITEMS_PER_LOAD);
    }, [activeCategory]);

    // Get only the visible dresses
    const displayedDresses = useMemo(() => {
        return filteredDresses.slice(0, visibleCount);
    }, [filteredDresses, visibleCount]);

    const hasMore = visibleCount < filteredDresses.length;

    const loadMore = useCallback(() => {
        if (hasMore) {
            setVisibleCount(prev => prev + ITEMS_PER_LOAD);
        }
    }, [hasMore]);

    // Infinite scroll with IntersectionObserver
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            },
            {
                threshold: 1.0,
                rootMargin: '0px'
            }
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, loadMore]);

    const handleCategoryClick = (slug: string | null) => {
        setActiveCategory(slug);
        // Update URL without page reload
        if (slug) {
            window.history.pushState({}, '', `/collections?category=${slug}`);
        } else {
            window.history.pushState({}, '', '/collections');
        }
    };

    // Build filter items with separators
    const allCategories = [
        { slug: null, name: 'Tümü' },
        ...collections.map(c => ({ slug: c.slug, name: c.name }))
    ];

    return (
        <div className={styles.container}>
            {/* Filter */}
            <div className={styles.filterBar}>
                {allCategories.map((cat, index) => (
                    <span key={cat.slug || 'all'} className={styles.filterItem}>
                        {index > 0 && <span className={styles.separator}>|</span>}
                        <button
                            onClick={() => handleCategoryClick(cat.slug)}
                            className={`${styles.filterLink} ${activeCategory === cat.slug ? styles.active : ''}`}
                        >
                            {cat.name}
                        </button>
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div className={styles.grid}>
                {displayedDresses.map(dress => (
                    <DressCard key={dress.id} dress={{
                        id: dress.id,
                        name: dress.name,
                        slug: dress.slug,
                        mainImage: dress.main_image || '/placeholder.jpg'
                    }} />
                ))}
            </div>

            {filteredDresses.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '4rem', color: '#888' }}>
                    Bu koleksiyonda ürün bulunamadı.
                </p>
            )}

            {/* Load More Button */}
            {hasMore && (
                <div className={styles.loadMoreContainer}>
                    <button onClick={loadMore} className={styles.loadMoreButton}>
                        <span>Daha Fazla Yükle</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </button>
                </div>
            )}

            {/* Sentinel for infinite scroll - placed at the very end */}
            <div ref={sentinelRef} className={styles.scrollSentinel} />
        </div>
    );
}
