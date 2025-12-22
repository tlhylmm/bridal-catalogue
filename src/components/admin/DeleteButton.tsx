'use client';

import { useFormStatus } from 'react-dom';

interface DeleteButtonProps {
    itemName?: string;
}

export default function DeleteButton({ itemName = 'this item' }: DeleteButtonProps) {
    const { pending } = useFormStatus();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!confirm(`Are you sure you want to delete ${itemName}?`)) {
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
            {pending ? 'Deleting...' : 'Delete'}
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
        if (!confirm(`Are you sure you want to delete the collection "${collectionName}"?`)) {
            e.preventDefault();
            return;
        }

        // Second warning if there are dresses
        if (dressCount > 0) {
            if (!confirm(`⚠️ WARNING: This will also permanently delete ${dressCount} dress${dressCount !== 1 ? 'es' : ''} and all their photos!\n\nThis action cannot be undone. Are you absolutely sure?`)) {
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
            {pending ? 'Deleting...' : 'Delete'}
        </button>
    );
}
