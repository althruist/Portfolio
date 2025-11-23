import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: 'xvksarfe',
    dataset: 'production',
    apiVersion: '2025-09-17',
    useCdn: false,
});

const builder = imageUrlBuilder(client);

export function getImage(ref) {
    if (!ref) return '';

    return builder
        .image(ref)
        .quality(70) 
        .format('webp')
        .fit('max')
        .url();
}

export function getImageSize(ref) {
    if (!ref) return '';
    const parts = ref.split('-');
    if (parts.length < 4) return '';
    return parts[2].split('x');
}