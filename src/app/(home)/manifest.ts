import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LLMTrust',
    short_name: 'LLMTrust',
    description: 'Discover and compare AI language models with trusted reviews, ratings, and detailed comparisons. Find the perfect LLM for your needs',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
