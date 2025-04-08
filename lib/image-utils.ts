/**
 * Utility functions for handling image URLs
 */

// Base URL for the backend API
const API_BASE_URL = "https://backend-project-pemuda.onrender.com"
const API_PATH = "/api/v1"

/**
 * Formats an image URL to ensure it's a complete URL
 * @param url The original URL from the API
 * @returns A complete URL that can be used in an img tag
 */
export function formatImageUrl(url: string | null | undefined): string {
  // If the URL is null or undefined, return a placeholder
  if (!url) {
    console.log('[formatImageUrl] URL is null or undefined, returning placeholder');
    return '/placeholder.svg';
  }

  try {
    // Log the original URL for debugging
    console.log(`[formatImageUrl] Original URL: ${url}`);

    // If it's already a complete URL, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      console.log(`[formatImageUrl] URL is already complete: ${url}`);
      return url;
    }

    // Handle Unsplash URLs (which might be used as fallbacks)
    if (url.includes('unsplash.com')) {
      console.log(`[formatImageUrl] Using Unsplash URL: ${url}`);
      return url;
    }

    // Special handling for uploads paths which might have various formats
    if (url.includes('uploads')) {
      // Handle the case where the URL might be in the format 'uploads/events/{event_id}/{filename}'
      // or '/uploads/events/{event_id}/{filename}'
      let cleanUrl = url;

      // Remove any leading slashes
      if (cleanUrl.startsWith('/')) {
        cleanUrl = cleanUrl.substring(1);
        console.log(`[formatImageUrl] Removed leading slash: ${cleanUrl}`);
      }

      // Ensure we have the correct path structure
      if (!cleanUrl.startsWith('uploads/')) {
        const uploadsPart = cleanUrl.split('uploads/');
        if (uploadsPart.length > 1) {
          cleanUrl = `uploads/${uploadsPart[1]}`;
        } else {
          cleanUrl = `uploads/${cleanUrl}`;
        }
        console.log(`[formatImageUrl] Fixed uploads path: ${cleanUrl}`);
      }

      // Check if the URL contains a timestamp (common in uploaded files)
      // If it does, it might be a dynamically generated filename that doesn't exist
      // In this case, we'll use a fallback image from Unsplash
      if (cleanUrl.includes('_0.png') || /\d{13,}/.test(cleanUrl)) {
        console.log(`[formatImageUrl] Detected potentially problematic URL pattern: ${cleanUrl}`);
        // We'll still try to use the original URL, but we've flagged it as potentially problematic
      }

      const fullUrl = `${API_BASE_URL}/${cleanUrl}`;
      console.log(`[formatImageUrl] Formatted uploads URL: ${fullUrl}`);
      return fullUrl;
    }

    // If it's a relative URL starting with /, add the base URL
    if (url.startsWith('/')) {
      const fullUrl = `${API_BASE_URL}${url}`;
      console.log(`[formatImageUrl] Formatted relative URL: ${fullUrl}`);
      return fullUrl;
    }

    // Check if it might be a filename only (no path)
    if (!url.includes('/')) {
      // Assume it's a filename that should be in the uploads directory
      const fullUrl = `${API_BASE_URL}/uploads/${url}`;
      console.log(`[formatImageUrl] Formatted filename-only URL: ${fullUrl}`);
      return fullUrl;
    }

    // Otherwise, assume it's a relative path and add the API base URL
    const fullUrl = `${API_BASE_URL}${API_PATH}/${url}`;
    console.log(`[formatImageUrl] Formatted API path URL: ${fullUrl}`);
    return fullUrl;
  } catch (error) {
    console.error('[formatImageUrl] Error formatting URL:', error);
    return '/placeholder.svg';
  }
}

/**
 * Formats a date string for display
 * @param dateString The date string to format
 * @returns A formatted date string
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''

  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}
