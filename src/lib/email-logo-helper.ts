import fs from 'fs';
import path from 'path';

/**
 * Convert logo image to base64 data URL for email embedding
 * This is needed because email clients don't have access to local file system
 */
export function getLogoAsDataUrl(): string {
    try {
        // Path to logo in public directory
        const logoPath = path.join(process.cwd(), 'src', 'components', 'images', 'LogoMail.png');

        // Read file as buffer
        const logoBuffer = fs.readFileSync(logoPath);

        // Convert to base64
        const logoBase64 = logoBuffer.toString('base64');

        // Return as data URL
        return `data:image/png;base64,${logoBase64}`;
    } catch (error) {
        console.error('Error loading logo for email:', error);
        return ''; // Return empty string if logo can't be loaded
    }
}

/**
 * Alternative: Get logo URL if hosted publicly
 * Use this if logo is available on a CDN or public URL
 */
export function getLogoPublicUrl(): string {
    // TODO: Replace with actual public URL when deployed
    // Example: return 'https://gardenbros.com/assets/logo-mail.png';
    return '';
}
