'use client';

import { useState, useMemo } from 'react';
import styles from '../app/(public)/sales-points/page.module.css';

interface Location {
    city: string;
    address: string;
    mapLink?: string;
}

interface SalesPoint {
    id: string;
    name: string;
    locations: Location[];
}

interface SalesPointsClientProps {
    salesPoints: SalesPoint[];
}

export default function SalesPointsClient({ salesPoints }: SalesPointsClientProps) {
    const [activeCity, setActiveCity] = useState<string | null>(null);

    // Extract all unique cities
    const allCities = useMemo(() => {
        const cities = new Set<string>();
        salesPoints.forEach(point => {
            point.locations.forEach(loc => {
                if (loc.city) cities.add(loc.city);
            });
        });
        return Array.from(cities).sort();
    }, [salesPoints]);

    // Filter sales points by city
    const filteredData = useMemo(() => {
        if (!activeCity) {
            return salesPoints;
        }
        return salesPoints
            .map(point => ({
                ...point,
                locations: point.locations.filter(loc => loc.city === activeCity)
            }))
            .filter(point => point.locations.length > 0);
    }, [activeCity, salesPoints]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Satış Noktaları</h1>
            <p className={styles.subtitle}>
                Koleksiyonlarımızı bu noktalarda bulabilirsiniz.
            </p>

            {/* City Filter */}
            {allCities.length > 1 && (
                <div className={styles.filterBar}>
                    <button
                        onClick={() => setActiveCity(null)}
                        className={`${styles.filterLink} ${!activeCity ? styles.active : ''}`}
                    >
                        Tüm Şehirler
                    </button>
                    {allCities.map((city) => (
                        <span key={city} className={styles.filterItem}>
                            <span className={styles.separator}>|</span>
                            <button
                                onClick={() => setActiveCity(city)}
                                className={`${styles.filterLink} ${activeCity === city ? styles.active : ''}`}
                            >
                                {city}
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Sales Points List */}
            <div className={styles.grid}>
                {filteredData.map((point) => (
                    <div key={point.id} className={styles.card}>
                        <h2 className={styles.storeName}>{point.name}</h2>

                        <div className={styles.locationsList}>
                            {point.locations.map((loc, index) => (
                                <div key={index} className={styles.location}>
                                    <div className={styles.cityBadge}>{loc.city}</div>
                                    <p className={styles.address}>{loc.address}</p>
                                    {loc.mapLink && (
                                        <a
                                            href={loc.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.mapLink}
                                        >
                                            View on Map →
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {filteredData.length === 0 && (
                <p className={styles.empty}>
                    Satış Noktası Bulunamadı{activeCity ? ` in ${activeCity}` : ''}.
                </p>
            )}
        </div>
    );
}
