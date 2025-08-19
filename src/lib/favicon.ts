/**
 * Utility functions for handling website favicons and logos
 */

export function getFaviconUrl(url: string, size: number = 256): string {
  try {
    const domain = new URL(url).hostname;
    
    // Primary favicon service - Google's high quality service
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    return 'https://placehold.co/600x400.png';
  }
}

export function getAlternativeFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    
    // Alternative favicon service - but avoid for problematic domains
    if (domain.includes('anime') || domain.includes('.to') || domain.includes('.ru') || domain.includes('.hu')) {
      return 'https://placehold.co/600x400.png';
    }
    
    return `https://favicon.im/${domain}?larger=true`;
  } catch {
    return 'https://placehold.co/600x400.png';
  }
}

export function getDuckDuckGoFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    
    // DuckDuckGo favicon service - skip for problematic domains
    if (domain.includes('192.168.') || domain.includes('localhost') || domain.includes('.local')) {
      return 'https://placehold.co/600x400.png';
    }
    
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  } catch {
    return 'https://placehold.co/600x400.png';
  }
}

export function getDirectFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Skip direct favicon for local addresses and problematic domains
    if (urlObj.hostname.includes('192.168.') || urlObj.hostname.includes('localhost') || 
        urlObj.hostname.includes('.local') || urlObj.protocol === 'http:') {
      return 'https://placehold.co/600x400.png';
    }
    
    // Try to get favicon directly from the site
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch {
    return 'https://placehold.co/600x400.png';
  }
}

/**
 * Get the best image source for a bookmark
 * Priority: Real image > Google favicon > Placeholder
 */
export function getBestImageSrc(bookmarkImage: string, bookmarkUrl: string): string {
  // If bookmark has a real image (not placeholder), use it
  if (bookmarkImage && !bookmarkImage.includes('placehold.co')) {
    return bookmarkImage;
  }
  
  try {
    const domain = new URL(bookmarkUrl).hostname;
    
    // For well-known domains, use Google's favicon service
    const wellKnownDomains = [
      'google.com', 'youtube.com', 'facebook.com', 'instagram.com', 
      'twitter.com', 'linkedin.com', 'github.com', 'chatgpt.com',
      'claude.ai', 'microsoft.com', 'netflix.com', 'amazon.com',
      'apple.com', 'reddit.com', 'wikipedia.org', 'stackoverflow.com'
    ];
    
    const isWellKnown = wellKnownDomains.some(known => domain.includes(known));
    
    if (isWellKnown) {
      return getFaviconUrl(bookmarkUrl);
    }
  } catch {
    // If URL parsing fails, continue to placeholder
  }
  
  // For other domains, use placeholder to avoid loading issues
  return 'https://placehold.co/600x400.png';
}

/**
 * Get fallback image sources in order of preference (simplified)
 */
export function getFallbackImageSources(url: string): string[] {
  try {
    const domain = new URL(url).hostname;
    
    // For well-known domains, provide more fallback options
    const wellKnownDomains = [
      'google.com', 'youtube.com', 'facebook.com', 'instagram.com', 
      'twitter.com', 'linkedin.com', 'github.com', 'chatgpt.com',
      'claude.ai', 'microsoft.com', 'netflix.com', 'amazon.com'
    ];
    
    const isWellKnown = wellKnownDomains.some(known => domain.includes(known));
    
    if (isWellKnown) {
      return [
        getFaviconUrl(url, 256),
        getFaviconUrl(url, 128),
        getFaviconUrl(url, 64),
        'https://placehold.co/600x400.png'
      ];
    }
  } catch {
    // If URL parsing fails, fall through
  }
  
  // For other domains, just use placeholder
  return ['https://placehold.co/600x400.png'];
}
