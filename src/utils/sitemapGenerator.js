// Dynamic sitemap generator for As Solutions Fournitures
// This generates sitemaps programmatically for better SEO

export const generateSitemap = async () => {
  const baseUrl = 'https://assolutionsfournitures.fr';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages with high priority
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/search', priority: '0.8', changefreq: 'weekly' },
    { loc: '/flash-deals', priority: '0.9', changefreq: 'daily' },
    { loc: '/terms-and-conditions', priority: '0.3', changefreq: 'monthly' },
    { loc: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
    { loc: '/account/register', priority: '0.2', changefreq: 'monthly' },
    { loc: '/account/signin', priority: '0.2', changefreq: 'monthly' },
  ];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;
  
  return sitemap;
};

// Generate product-specific sitemap
export const generateProductSitemap = async (products) => {
  const baseUrl = 'https://assolutionsfournitures.fr';
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  products.forEach(product => {
    sitemap += `  <url>
    <loc>${baseUrl}/product/${product.slug}</loc>
    <lastmod>${product.updated_at ? product.updated_at.split('T')[0] : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;
    
    if (product.main_image_url) {
      sitemap += `
    <image:image>
      <image:loc>${product.main_image_url}</image:loc>
      <image:title>${product.title}</image:title>
      <image:caption>${product.description ? product.description.substring(0, 100) : product.title}</image:caption>
    </image:image>`;
    }
    
    sitemap += `
  </url>
`;
  });

  sitemap += `</urlset>`;
  
  return sitemap;
};

// Generate category-specific sitemap
export const generateCategorySitemap = async (categories) => {
  const baseUrl = 'https://assolutionsfournitures.fr';
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  categories.forEach(category => {
    sitemap += `  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>`;
    
    if (category.image_url) {
      sitemap += `
    <image:image>
      <image:loc>${category.image_url}</image:loc>
      <image:title>${category.name}</image:title>
      <image:caption>${category.description || category.name}</image:caption>
    </image:image>`;
    }
    
    sitemap += `
  </url>
`;
  });

  sitemap += `</urlset>`;
  
  return sitemap;
};

// Generate programmatic SEO pages (for long-tail keywords)
export const generateProgrammaticSEOPages = async () => {
  const baseUrl = 'https://assolutionsfournitures.fr';
  
  // Example: Generate landing pages for specific search terms
  const longTailKeywords = [
    'fenetre-pvc-sur-mesure',
    'porte-entree-aluminium',
    'outillage-professionnel-bricolage',
    'materiel-auto-garage',
    'equipement-jardin-exterieur',
    'sanitaire-salle-de-bain',
    'fournitures-industrielles-professionnelles'
  ];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  longTailKeywords.forEach(keyword => {
    sitemap += `  <url>
    <loc>${baseUrl}/search?q=${encodeURIComponent(keyword.replace(/-/g, ' '))}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;
  
  return sitemap;
};

// SEO Landing Page Generator (Programmatic SEO)
export const generateSEOLandingPages = () => {
  const cities = [
    'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'montpellier',
    'strasbourg', 'bordeaux', 'lille', 'rennes', 'reims', 'saint-etienne',
    'toulon', 'le-havre', 'grenoble', 'dijon', 'angers', 'nimes', 'villeurbanne'
  ];
  
  const categories = [
    'fenetres-sur-mesure',
    'portes-personnalisees', 
    'outillage-professionnel',
    'materiel-bricolage',
    'equipement-automobile',
    'accessoires-jardin'
  ];
  
  const landingPages = [];
  
  // Generate city + category combinations
  categories.forEach(category => {
    cities.forEach(city => {
      landingPages.push({
        url: `/search?q=${category}-${city}`,
        title: `${category.replace(/-/g, ' ')} à ${city.charAt(0).toUpperCase() + city.slice(1)}`,
        description: `Trouvez les meilleurs ${category.replace(/-/g, ' ')} à ${city.charAt(0).toUpperCase() + city.slice(1)}. Livraison rapide et prix compétitifs.`,
        keywords: `${category.replace(/-/g, ' ')}, ${city}, fournitures, équipement`,
        priority: 0.6
      });
    });
  });
  
  return landingPages;
};