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
