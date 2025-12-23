"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            >
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--color-cream)',
                    padding: '2rem',
                    borderTop: '1px solid #ddd',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'center',
                    zIndex: 100
                }}>
                    <Link href="/collections" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Koleksiyonlar</Link>
                    <Link href="/sales-points" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Satış Noktaları</Link>
                    <Link href="/from-you" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Sizden Gelenler</Link>
                    <Link href="/contact" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Bize Ulaşın</Link>
                </div>
            )}
        </nav>
    );
}
