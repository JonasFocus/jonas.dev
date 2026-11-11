import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.jonasinfocus.com',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://www.jonasinfocus.com/privacy',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
