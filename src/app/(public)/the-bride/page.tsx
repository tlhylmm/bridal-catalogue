import Link from 'next/link';

export default function TheBride() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '2rem' }}>The Bride</h1>
            <p style={{ lineHeight: '1.8', marginBottom: '2rem', color: '#555' }}>
                The Gültekin Ataseven bride is sophisticated, modern, and timeless.
                Detailed with French lace, hand-beaded crystals, and the finest silk, our gowns
                are designed to make you feel like the most beautiful version of yourself.
            </p>
            <div style={{ height: '400px', background: '#eee', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Placeholder for Atelier/Bride Image */}
                <span style={{ color: '#999' }}>Bride / Atelier Image</span>
            </div>
            <Link href="/collections" style={{ borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                View the Collection
            </Link>
        </div>
    );
}
