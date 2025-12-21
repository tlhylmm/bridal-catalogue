export type Collection = {
    id: string;
    name: string;
    slug: string;
};

export type Dress = {
    id: string;
    name: string;
    slug: string;
    collectionId: string;
    mainImage: string;
    galleryImages: string[];
    price?: string; // Not displayed publicy, but good to have in model
    silhouette: string;
    fabric: string;
    neckline: string;
};

export const collections: Collection[] = [
    { id: '1', name: '2024 Collection', slug: '2024-collection' },
    { id: '2', name: 'Classics', slug: 'classics' },
    { id: '3', name: 'Minimalist', slug: 'minimalist' },
];

export const dresses: Dress[] = [
    {
        id: '1',
        name: 'The Aylin Gown',
        slug: 'the-aylin-gown',
        collectionId: '1',
        mainImage: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=2574&auto=format&fit=crop',
        galleryImages: [
            'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=2574&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2670&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549416867-b9380b080539?q=80&w=2669&auto=format&fit=crop'
        ],
        silhouette: 'Mermaid',
        fabric: 'French Lace & Tulle',
        neckline: 'Plunging V'
    },
    {
        id: '2',
        name: 'The Elara Dress',
        slug: 'the-elara-dress',
        collectionId: '3',
        mainImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2670&auto=format&fit=crop',
        galleryImages: [
            'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2670&auto=format&fit=crop'
        ],
        silhouette: 'A-Line',
        fabric: 'Silk Satin',
        neckline: 'V-Neck'
    },
    {
        id: '3',
        name: 'The Sofia Gown',
        slug: 'the-sofia-gown',
        collectionId: '2',
        mainImage: 'https://images.unsplash.com/photo-1549416867-b9380b080539?q=80&w=2669&auto=format&fit=crop',
        galleryImages: [
            'https://images.unsplash.com/photo-1549416867-b9380b080539?q=80&w=2669&auto=format&fit=crop'
        ],
        silhouette: 'Ballgown',
        fabric: 'Tulle & Beading',
        neckline: 'Sweetheart'
    }
];
