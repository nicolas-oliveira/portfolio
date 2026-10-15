import { useEffect } from 'react';
import { SEO_CONFIG, SITE_URL } from '../config/seo.js';

/**
 * Atualiza ou cria uma tag meta no document.head
 */
function setMetaTag(selector, attrName, attrValue, content) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content || '');
}

/**
 * Hook para atualização dinâmica de SEO no navegador (SPA)
 * @param {Object} options
 * @param {string} [options.title] - Título da página
 * @param {string} [options.description] - Resumo / descrição
 * @param {string} [options.image] - URL da imagem de capa
 * @param {string} [options.url] - URL canônica relativa ou absoluta
 * @param {string} [options.type] - Tipo OG (website ou article)
 * @param {string} [options.publishedTime] - Data de publicação ISO
 * @param {Array<string>} [options.tags] - Palavras-chave / tags
 */
export function useSEO({
  title,
  description,
  image,
  url,
  type = 'article',
  publishedTime,
  tags = [],
} = {}) {
  useEffect(() => {
    const originalTitle = document.title;
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
    setMetaTag('meta[name="description"]', 'name', 'description', finalDescription);
    if (tags.length > 0) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', tags.join(', '));
    }

    // 3. Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', finalTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', finalDescription);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', fullUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', fullImage);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);

    // 4. Twitter
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullImage);

    // 5. Canonical Link
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    return () => {
      // Restaura o título padrão ao desmontar
      document.title = originalTitle;
    };
  }, [title, description, image, url, type, publishedTime, tags]);
}
