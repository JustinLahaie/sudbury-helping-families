import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Sudbury & Area Helping Families in Need. Contact Mike Bellerose at 705-207-4170 or reach out through our contact form.',
  openGraph: {
    title: 'Contact Us | Sudbury Helping Families',
    description: 'Have questions or want to get involved? Contact us to learn how you can help support families in the Sudbury area.',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
