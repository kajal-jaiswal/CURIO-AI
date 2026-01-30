import { getPostBySlug } from '@/lib/queries'
import { generateExcerpt } from '@/lib/utils'

interface BlogPostSchemaProps {
  params: {
    slug: string
  }
}

export async function BlogPostSchema({ params }: BlogPostSchemaProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return null
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  const image = post.cover_image_url || `${baseUrl}/og-image.jpg`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || generateExcerpt(post.content_md),
    image: image,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author || post.author_name || 'Curio AI Bot',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Curio AI Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      ...(post.category
        ? [
          {
            '@type': 'ListItem',
            position: 3,
            name: post.category.name,
            item: `${baseUrl}/category/${post.category.slug}`,
          },
        ]
        : []),
      {
        '@type': 'ListItem',
        position: post.category ? 4 : 3,
        name: post.title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
