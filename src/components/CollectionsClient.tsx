'use client';

import { useState, useMemo } from 'react';
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

export default function CollectionsClient({ collections, dresses, initialCategory }: CollectionsClientProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);

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
        { slug: null, name: 'All' },
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
                {filteredDresses.map(dress => (
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
                    No dresses found in this collection.
                </p>
            )}
        </div>
    );
}
