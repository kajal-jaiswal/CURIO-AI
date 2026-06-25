import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function generateExcerpt(content: string, length: number = 160): string {
  const text = content.replace(/[#*`]/g, '').replace(/\n/g, ' ').trim()
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

const TECH_IMAGES = [
  'photo-1677442135703-1787eea5ce01',
  'photo-1518770660439-4636190af475',
  'photo-1526374965328-7f61d4dc18c5',
  'photo-1555949963-ff9fe0c870eb',
  'photo-1488229297570-58520851e868',
  'photo-1504711434969-e33886168f5c',
  'photo-1551288049-bebda4e38f71',
  'photo-1460925895917-afdab827c52f',
  'photo-1620712943543-bcc4688e7485',
  'photo-1485827404703-89b55fcc595e',
]

function simpleHash(str: string): number {
  return str.split('').reduce((acc, char) => (acc + char.charCodeAt(0)) % 1000, 0)
}

export function getPostCoverImage(slug: string, coverImageUrl?: string | null): string {
  if (coverImageUrl) return coverImageUrl
  const index = simpleHash(slug) % TECH_IMAGES.length
  return `https://images.unsplash.com/${TECH_IMAGES[index]}?w=800&h=450&fit=crop&auto=format`
}
