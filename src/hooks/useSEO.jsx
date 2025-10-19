import { Helmet } from 'react-helmet-async';

/**
 * SEO Component with comprehensive meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 * Optimized for e-commerce and programmatic SEO
 */
export const SEO = ({
  title,
  description,
  keywords = [],
  canonical,
  ogType = 'website',
  ogImage,
  ogImageAlt,
  twitterCard = 'summary_large_image',
  structuredData = null,
  noindex = false,
  nofollow = false,
  lang = 'fr',
  publishedTime,
  modifiedTime,
  author = 'AS Solutions Fournitures',
  breadcrumbs = [],
  product = null,
  priceRange = null,
  aggregateRating = null,
}) => {
  const baseUrl = 'https://assolutionsfournitures.fr';
  const defaultImage = `${baseUrl}/assets/logo-as.png`;
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const fullOgImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`) : defaultImage;

  // Generate Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AS Solutions Fournitures",
    "url": baseUrl,
    "logo": `${baseUrl}/assets/logo-as.png`,
    "description": "Premier fournisseur de matériaux de construction, bricolage et fournitures industrielles en France avec plus de 100,000 produits",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Service Client",
      "telephone": "+33-1-234-5678",
      "email": "contact@assolutionsfournitures.fr",
      "areaServed": "FR",
      "availableLanguage": ["French"]
    },
    "sameAs": [
      "https://www.facebook.com/assolutions",
      "https://www.instagram.com/assolutions",
      "https://twitter.com/assolutions"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR",
      "addressLocality": "Paris"
    }
  };

  // Generate Product Schema (if product data provided)
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map(img => `${baseUrl}${img}`) || [fullOgImage],
    "description": product.description,
    "sku": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "AS Solutions"
    },
    "offers": {
      "@type": "Offer",
      "url": fullCanonical,
      "priceCurrency": "EUR",
      "price": product.price,
      "priceValidUntil": product.priceValidUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "AS Solutions Fournitures"
      }
    },
    ...(aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregateRating.ratingValue,
        "reviewCount": aggregateRating.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    })
  } : null;

  // Generate BreadcrumbList Schema
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  } : null;

  // Generate WebSite Schema for homepage
  const websiteSchema = canonical === '/' ? {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AS Solutions Fournitures",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  } : null;

  // Combine all schemas
  const allSchemas = [
    organizationSchema,
    productSchema,
    breadcrumbSchema,
    websiteSchema,
    structuredData
  ].filter(Boolean);

  const robotsContent = `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullOgImage} />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      <meta property="og:site_name" content="AS Solutions Fournitures" />
      <meta property="og:locale" content="fr_FR" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      {ogImageAlt && <meta name="twitter:image:alt" content={ogImageAlt} />}
      <meta name="twitter:site" content="@assolutions" />

      {/* Additional SEO Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Structured Data (JSON-LD) */}
      {allSchemas.map((schema, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com" />
    </Helmet>
  );
};

/**
 * Generate SEO data for Home page
 */
export const generateHomeSEO = () => ({
  title: "AS Solutions Fournitures - 100,000+ Produits pour Maison, Bricolage & Industrie | Livraison Rapide",
  description: "Découvrez plus de 100,000 produits de qualité pour la maison, le bricolage et l'industrie. Matériaux de construction, outillage, fournitures industrielles. Livraison rapide en France. Prix compétitifs garantis.",
  keywords: [
    'fournitures industrielles',
    'matériaux construction',
    'bricolage',
    'outillage professionnel',
    'quincaillerie',
    'équipement maison',
    'fournitures bureau',
    'AS Solutions',
    'livraison rapide France'
  ],
  canonical: '/',
  ogType: 'website',
  ogImage: '/assets/logo-as.png',
  ogImageAlt: 'AS Solutions Fournitures - Votre partenaire pour tous vos projets',
  breadcrumbs: [
    { name: 'Accueil', url: '/' }
  ]
});

/**
 * Generate SEO data for Product page
 */
export const generateProductSEO = (product) => {
  if (!product) return generateHomeSEO();

  const price = product.price || product.salePrice || 0;
  const inStock = product.stock > 0 || product.inStock;
  
  return {
    title: `${product.name} - ${price.toFixed(2)}€ | AS Solutions Fournitures`,
    description: product.description?.substring(0, 155) || `Achetez ${product.name} au meilleur prix. ${inStock ? 'En stock' : 'Sur commande'}. Livraison rapide en France. Garantie qualité AS Solutions.`,
    keywords: [
      product.name,
      product.category,
      product.brand,
      'acheter en ligne',
      'livraison France',
      'prix discount'
    ].filter(Boolean),
    canonical: `/product/${product.slug || product.id}`,
    ogType: 'product',
    ogImage: product.images?.[0] || product.image || '/assets/no-image.svg',
    ogImageAlt: product.name,
    product: {
      name: product.name,
      description: product.description,
      price: price,
      sku: product.sku || product.id,
      brand: product.brand,
      images: product.images || [product.image],
      inStock: inStock,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    aggregateRating: product.rating ? {
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 1
    } : null,
    breadcrumbs: [
      { name: 'Accueil', url: '/' },
      { name: product.category || 'Produits', url: `/category/${product.categorySlug || 'all'}` },
      { name: product.name, url: `/product/${product.slug || product.id}` }
    ]
  };
};

/**
 * Generate SEO data for Category page
 */
export const generateCategorySEO = (category, products = []) => {
  const productCount = products.length;
  const categoryName = category?.name || 'Tous les produits';
  const categorySlug = category?.slug || 'all';

  return {
    title: `${categoryName} - ${productCount}+ Produits | AS Solutions Fournitures`,
    description: `Explorez notre sélection de ${productCount}+ produits dans la catégorie ${categoryName}. Prix compétitifs, qualité garantie, livraison rapide en France.`,
    keywords: [
      categoryName,
      'fournitures',
      'achat en ligne',
      'livraison France',
      'prix discount',
      'qualité professionnelle'
    ],
    canonical: `/category/${categorySlug}`,
    ogType: 'website',
    ogImage: category?.image || '/assets/logo-as.png',
    ogImageAlt: `Catégorie ${categoryName} - AS Solutions`,
    breadcrumbs: [
      { name: 'Accueil', url: '/' },
      { name: 'Catégories', url: '/categories' },
      { name: categoryName, url: `/category/${categorySlug}` }
    ]
  };
};

/**
 * Generate SEO data for Search page
 */
export const generateSearchSEO = (query, resultCount = 0) => ({
  title: `Recherche: "${query}" - ${resultCount} résultats | AS Solutions Fournitures`,
  description: `${resultCount} produits trouvés pour "${query}". Découvrez notre large sélection de fournitures industrielles, matériaux et équipements. Livraison rapide.`,
  keywords: [query, 'recherche produits', 'fournitures', 'AS Solutions'],
  canonical: `/search?q=${encodeURIComponent(query)}`,
  ogType: 'website',
  noindex: resultCount === 0, // Don't index empty search results
  breadcrumbs: [
    { name: 'Accueil', url: '/' },
    { name: 'Recherche', url: '/search' },
    { name: query, url: `/search?q=${encodeURIComponent(query)}` }
  ]
});

/**
 * Generate SEO data for Flash Deals page
 */
export const generateFlashDealsSEO = (dealsCount = 0) => ({
  title: `Flash Deals - ${dealsCount}+ Offres Exceptionnelles | AS Solutions Fournitures`,
  description: `Ne manquez pas nos offres flash ! ${dealsCount}+ produits en promotion à prix imbattables. Stock limité. Livraison rapide en France.`,
  keywords: [
    'flash deals',
    'promotions',
    'offres spéciales',
    'réductions',
    'prix discount',
    'ventes flash',
    'bonnes affaires'
  ],
  canonical: '/flash-deals',
  ogType: 'website',
  ogImage: '/assets/flash-sale.png',
  ogImageAlt: 'Flash Deals - Offres exceptionnelles AS Solutions',
  breadcrumbs: [
    { name: 'Accueil', url: '/' },
    { name: 'Flash Deals', url: '/flash-deals' }
  ]
});

// Backward compatibility - deprecated
export const useSEO = (seoData) => {
  console.warn('useSEO hook is deprecated. Use <SEO /> component instead.');
  return null;
};

export default SEO;