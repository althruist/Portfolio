import { createClient } from '@sanity/client';

export const client = createClient({
    projectId: 'xvksarfe',
    dataset: 'production',
    apiVersion: '2025-09-17',
    useCdn: false,
});

export function getImage(ref) {
    if (!ref) return '';
    const parts = ref.split('-');
    if (parts.length < 4) return '';
    const [, id, dimensions, format] = parts;
    return `https://cdn.sanity.io/images/xvksarfe/production/${id}-${dimensions}.${format}`;
}

export function getImageSize(ref) {
    if (!ref) return '';
    const parts = ref.split('-');
    if (parts.length < 4) return '';
    return parts[2].split('x');
}