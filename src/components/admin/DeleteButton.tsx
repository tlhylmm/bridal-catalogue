'use client';

import { useFormStatus } from 'react-dom';

interface DeleteButtonProps {
    itemName?: string;
}

export default function DeleteButton({ itemName = 'this item' }: DeleteButtonProps) {
    const { pending } = useFormStatus();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!confirm(`Bunu silmek istediğinize emin misiniz: ${itemName}?`)) {
            e.preventDefault();
        }
    };

    return (
        <button
            type="submit"
            disabled={pending}
            onClick={handleClick}
            className="admin-btn admin-btn-danger"
        >
            {pending ? 'Siliniyor...' : 'Sil'}
        </button>
    );
}

interface DeleteCollectionButtonProps {
    collectionName: string;
    dressCount: number;
}

export function DeleteCollectionButton({ collectionName, dressCount }: DeleteCollectionButtonProps) {
    const { pending } = useFormStatus();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // First warning
        if (!confirm(`Bu koleksiyonu silmek istediğinize emin misiniz: "${collectionName}"?`)) {
            e.preventDefault();
            return;
        }

        // Second warning if there are dresses
        if (dressCount > 0) {
            if (!confirm(`⚠️ UYARI: Bu koleksiyonu silmek aynı zamanda ${dressCount} gelinliği ve tüm fotoğraflarını silecek\n\nBu işlem geri alınamaz. Emin misiniz?`)) {
                e.preventDefault();
                return;
            }
        }
    };

    return (
        <button
            type="submit"
            disabled={pending}
            onClick={handleClick}
            className="admin-btn admin-btn-danger"
        >
            {pending ? 'Siliniyor...' : 'Sil'}
        </button>
    );
}
