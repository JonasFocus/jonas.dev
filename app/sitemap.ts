import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://jonasinfocus.com', changeFrequency: 'monthly', priority: 1 },
    {
      url: 'https://jonasinfocus.com/privacy',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
