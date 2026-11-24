import { useEffect } from 'react';
import { SEO_CONFIG, SITE_URL } from '../config/seo.js';

/**
 * Atualiza ou cria uma tag meta no document.head e devolve função de restauração
 */
function upsertMetaTag(selector, attrName, attrValue, content) {
  const existing = document.head.querySelector(selector);
  if (existing) {
    const prevContent = existing.getAttribute('content');
    existing.setAttribute('content', content || '');
    return () => {
      if (prevContent === null) {
        existing.removeAttribute('content');
      } else {
        existing.setAttribute('content', prevContent);
      }
    };
  }

  const created = document.createElement('meta');
  created.setAttribute(attrName, attrValue);
  created.setAttribute('content', content || '');
  document.head.appendChild(created);
  return () => created.remove();
}

/**
 * Hook para atualização dinâmica de SEO no navegador (SPA) com restauração completa ao desmontar
 */
export function useSEO({
  title,
  description,
  image,
  url,
  type = 'article',
  publishedTime,
  tags,
} = {}) {
  const tagsKey = Array.isArray(tags) ? tags.join(', ') : '';

  useEffect(() => {
    const originalTitle = document.title;
    const restorers = [];

    const finalTitle = title
      ? SEO_CONFIG.titleTemplate.replace('%s', title)
      : SEO_CONFIG.defaultTitle;
    const finalDescription = description || SEO_CONFIG.defaultDescription;

    const fullUrl = url
      ? (url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`)
      : SITE_URL;

    const fullImage = image
      ? (image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`)
      : SEO_CONFIG.defaultImage;

    // 1. Title
    document.title = finalTitle;

    // 2. Standard Meta
    restorers.push(upsertMetaTag('meta[name="description"]', 'name', 'description', finalDescription));
    if (tagsKey) {
      restorers.push(upsertMetaTag('meta[name="keywords"]', 'name', 'keywords', tagsKey));
    }

    // 3. Open Graph
    restorers.push(upsertMetaTag('meta[property="og:title"]', 'property', 'og:title', finalTitle));
    restorers.push(upsertMetaTag('meta[property="og:description"]', 'property', 'og:description', finalDescription));
    restorers.push(upsertMetaTag('meta[property="og:url"]', 'property', 'og:url', fullUrl));
    restorers.push(upsertMetaTag('meta[property="og:image"]', 'property', 'og:image', fullImage));
    restorers.push(upsertMetaTag('meta[property="og:type"]', 'property', 'og:type', type));

    // 4. Twitter
    restorers.push(upsertMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle));
    restorers.push(upsertMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalDescription));
    restorers.push(upsertMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullImage));

    // 5. Canonical Link
    const existingCanonical = document.head.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      const prevHref = existingCanonical.getAttribute('href');
      existingCanonical.setAttribute('href', fullUrl);
      restorers.push(() => {
        if (prevHref === null) {
          existingCanonical.removeAttribute('href');
        } else {
          existingCanonical.setAttribute('href', prevHref);
        }
      });
    } else {
      const createdCanonical = document.createElement('link');
      createdCanonical.setAttribute('rel', 'canonical');
      createdCanonical.setAttribute('href', fullUrl);
      document.head.appendChild(createdCanonical);
      restorers.push(() => createdCanonical.remove());
    }

    return () => {
      document.title = originalTitle || SEO_CONFIG.defaultTitle;
      for (const restore of restorers) {
        restore();
      }
    };
  }, [title, description, image, url, type, publishedTime, tagsKey]);
}
