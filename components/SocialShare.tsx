'use client'

import { Twitter, Facebook, Linkedin, Link2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface SocialShareProps {
  title: string
  url: string
}

export function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-dark-300 mb-4">Share this article</h3>
      <div className="flex items-center gap-3">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-5 h-5 text-dark-300" />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-5 h-5 text-dark-300" />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5 text-dark-300" />
        </a>
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center w-10 h-10 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="w-5 h-5 text-primary-400" />
          ) : (
            <Copy className="w-5 h-5 text-dark-300" />
          )}
        </button>
      </div>
    </div>
  )
}
