"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className={styles.nav}>
            {/* Left Links - Desktop */}
            <div className={`${styles.links} ${styles.desktop}`}>
                <Link href="/collections" className={styles.link}>Koleksiyonlar</Link>
                <Link href="/sales-points" className={styles.link}>Satış Noktaları</Link>
            </div>

            {/* Center Logo */}
            <Link href="/" className={styles.logo}>
                <Image
                    src="/logo.png"
                    alt="Gültekin Ataseven"
                    width={180}
                    height={80}
                    priority
                    style={{ objectFit: 'contain' }}
                />
            </Link>

            {/* Right Links - Desktop */}
            <div className={`${styles.links} ${styles.desktop}`}>
                <Link href="/from-you" className={styles.link}>Sizden Gelenler</Link>
                <Link href="/contact" className={styles.link}>Bize Ulaşın</Link>
            </div>

            {/* Mobile Menu Button */}
            <button
                className={styles.mobileMenuBtn}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                style={{ zIndex: 1002 }} // Ensure button is above overlay
            >
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile Menu Overlay - Always rendered for CSS transition */}
            <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`}>
                <Link href="/collections" className={`${styles.link} ${styles.mobileMenuLink}`} onClick={() => setIsMobileMenuOpen(false)}>Koleksiyonlar</Link>
                <Link href="/sales-points" className={`${styles.link} ${styles.mobileMenuLink}`} onClick={() => setIsMobileMenuOpen(false)}>Satış Noktaları</Link>
                <Link href="/from-you" className={`${styles.link} ${styles.mobileMenuLink}`} onClick={() => setIsMobileMenuOpen(false)}>Sizden Gelenler</Link>
                <Link href="/contact" className={`${styles.link} ${styles.mobileMenuLink}`} onClick={() => setIsMobileMenuOpen(false)}>Bize Ulaşın</Link>
            </div>
        </nav>
    );
}
