/**
 * Converts a name string into a URL-safe slug
 * - Converts to lowercase
 * - Removes accents (ü -> u, ğ -> g, etc.)
 * - Removes special characters
 * - Replaces spaces with dashes
 */
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        // Normalize to decomposed form and remove combining diacritical marks
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Handle Turkish characters specifically
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        // Remove any remaining non-alphanumeric characters except spaces and dashes
        .replace(/[^a-z0-9\s-]/g, '')
        // Trim whitespace
        .trim()
        // Replace spaces with dashes
        .replace(/\s+/g, '-')
        // Replace consecutive dashes with single dash
        .replace(/-+/g, '-');
}
