import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sudbury & Area Helping Families in Need',
    short_name: 'Sudbury Helping Families',
    description: 'A community-driven grassroots charity supporting local families in Sudbury since 2012.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a2e2e',
    theme_color: '#38b6c4',
    icons: [
      {
        src: '/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
