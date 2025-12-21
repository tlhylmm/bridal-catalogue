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
                <Link href="/collections" className={styles.link}>Collections</Link>
                <Link href="/the-bride" className={styles.link}>The Bride</Link>
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
                <Link href="/from-you" className={styles.link}>From You</Link>
                <Link href="/appointment" className={styles.link}>Appointment</Link>
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
                    <Link href="/collections" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
                    <Link href="/the-bride" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>The Bride</Link>
                    <Link href="/from-you" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>From You</Link>
                    <Link href="/appointment" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Appointment</Link>
                </div>
            )}
        </nav>
    );
}
