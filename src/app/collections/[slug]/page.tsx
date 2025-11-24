import { Metadata } from 'next'
import { databaseService } from '@/lib/sqlite-database'
import { notFound, redirect } from 'next/navigation'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = databaseService.getCollectionBySlug(params.slug) as any

  if (!collection) {
    return {
      title: 'Collection Not Found - WhySoCheap',
    }
  }

  const imageUrl = collection.image || 'https://i.postimg.cc/6p8LvPh3/Chat-GPT-Image-Nov-23-2025-06-43-48-AM-(1).png'
  const description = collection.description || `Shop ${collection.name} collection at WhySoCheap. Authentic celebrity merchandise at wholesale prices.`

  return {
    title: `${collection.name} - WhySoCheap`,
    description: description,
    openGraph: {
      title: `${collection.name} - WhySoCheap`,
      description: description,
      url: `https://whysocheap.site/collections/${params.slug}`,
      siteName: 'WhySoCheap',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: collection.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${collection.name} - WhySoCheap`,
      description: description,
      images: [imageUrl],
    },
  }
}

export default function CollectionPage({ params }: Props) {
  const collection = databaseService.getCollectionBySlug(params.slug) as any

  if (!collection) {
    notFound()
  }

  // Redirect to products page with collection filter
  redirect(`/products?collection=${encodeURIComponent(params.slug)}`)
}
