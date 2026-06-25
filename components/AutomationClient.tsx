'use client'

import { useState } from 'react'
import { Zap, Loader2, Newspaper, PenLine, CheckCircle, XCircle, ExternalLink, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

type Mode = 'news' | 'topics'

interface GeneratedPost {
  title: string
  slug: string
}

interface RunResult {
  count: number
  created: GeneratedPost[]
  errors: { topic: string; error: string }[]
}

const TONES = [
  'Professional yet engaging',
  'Conversational and friendly',
  'Educational and detailed',
  'Persuasive and compelling',
  'Simple and beginner-friendly',
]

const AUDIENCES = [
  'Small business owners and professionals',
  'Entrepreneurs and startup founders',
  'Tech enthusiasts and developers',
  'Students and beginners',
  'Executives and decision-makers',
]

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese']

const SCHEDULES = [
  { label: 'Every 6 hours', cron: '0 */6 * * *' },
  { label: 'Every 12 hours', cron: '0 */12 * * *' },
  { label: 'Once daily (midnight)', cron: '0 0 * * *' },
  { label: 'Twice daily', cron: '0 0,12 * * *' },
  { label: 'Weekly (Monday)', cron: '0 9 * * 1' },
]

export function AutomationClient() {
  const [mode, setMode] = useState<Mode>('news')
  const [topics, setTopics] = useState('')
  const [count, setCount] = useState(3)
  const [tone, setTone] = useState(TONES[0])
  const [category, setCategory] = useState('')
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [wordCount, setWordCount] = useState(1200)
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<RunResult | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const run = async () => {
    setRunning(true)
    setResult(null)

    const payload: any = { count, tone, category, audience, wordCount, language, useNews: mode === 'news' }

    if (mode === 'topics') {
      const topicList = topics
        .split('\n')
        .map(t => t.trim())
        .filter(Boolean)

      if (topicList.length === 0) {
        toast.error('Please enter at least one topic')
        setRunning(false)
        return
      }
      payload.topics = topicList
      payload.useNews = false
    }

    try {
      const res = await fetch('/api/admin/generate-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Generation failed')
        return
      }

      setResult(data)
      if (data.count > 0) {
        toast.success(`Generated ${data.count} post${data.count !== 1 ? 's' : ''} successfully!`)
      } else {
        toast.error('No new posts created — topics may already exist')
      }
    } catch {
      toast.error('Failed to connect to generation service')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-dark-50">Generate Posts</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-dark-200 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            {showSettings ? 'Hide' : 'Options'}
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-dark-800 rounded-xl">
          <button
            onClick={() => setMode('news')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'news'
                ? 'bg-primary-600 text-white shadow'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            From Trending News
          </button>
          <button
            onClick={() => setMode('topics')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'topics'
                ? 'bg-primary-600 text-white shadow'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            <PenLine className="w-4 h-4" />
            Custom Topics
          </button>
        </div>

        {/* Topics input */}
        {mode === 'topics' && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Topics <span className="text-dark-500">(one per line)</span>
            </label>
            <textarea
              value={topics}
              onChange={e => setTopics(e.target.value)}
              rows={5}
              placeholder={`How AI is transforming small businesses in 2026\nTop 10 AI tools for freelancers\nUsing ChatGPT to automate customer support\nBest AI writing tools for content creators\nAI vs traditional software: cost comparison`}
              className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 text-sm placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <p className="text-xs text-dark-500 mt-1">
              {topics.split('\n').filter(t => t.trim()).length} topic{topics.split('\n').filter(t => t.trim()).length !== 1 ? 's' : ''} entered
            </p>
          </div>
        )}

        {mode === 'news' && (
          <div className="mb-5 p-4 bg-dark-800/60 border border-dark-700 rounded-xl">
            <p className="text-sm text-dark-300">
              Automatically fetches the latest trending tech & AI news from TechCrunch, The Verge, VentureBeat, and more — then generates unique blog posts about each story.
            </p>
          </div>
        )}

        {/* Count */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Posts to generate: <span className="text-primary-400 font-bold">{count}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
          <div className="flex justify-between text-xs text-dark-600 mt-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {/* Advanced options */}
        {showSettings && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 pt-4 border-t border-dark-800">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Tone</label>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Target Audience</label>
              <select
                value={audience}
                onChange={e => setAudience(e.target.value)}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Word Count: <span className="text-primary-400 font-bold">{wordCount}</span>
              </label>
              <input
                type="range"
                min={800}
                max={2500}
                step={100}
                value={wordCount}
                onChange={e => setWordCount(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-dark-600 mt-1">
                <span>800</span>
                <span>1500</span>
                <span>2500</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark-300 mb-2">Category hint <span className="text-dark-500">(optional)</span></label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. AI Tools, Productivity"
                className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-100 text-sm placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* Run button */}
        <button
          onClick={run}
          disabled={running}
          className="w-full flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-primary-900/30"
        >
          {running ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating {count} post{count !== 1 ? 's' : ''}… (this takes ~30–60s)
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate {count} Post{count !== 1 ? 's' : ''} Now
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
          <h3 className="font-semibold text-dark-50 mb-4">
            Results — {result.count} post{result.count !== 1 ? 's' : ''} created
          </h3>

          {result.created.length > 0 && (
            <div className="space-y-2 mb-4">
              {result.created.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-dark-200 text-sm truncate">{p.title}</span>
                  </div>
                  <Link
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 ml-3 flex-shrink-0"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {result.errors.length > 0 && (
            <div className="space-y-2">
              {result.errors.map((e, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-dark-300 text-sm font-medium truncate">{e.topic}</p>
                    <p className="text-dark-500 text-xs">{e.error}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Auto Schedule */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark-50 mb-1">Automatic Schedule</h2>
        <p className="text-dark-400 text-sm mb-5">
          The AI pipeline runs automatically on Vercel. Edit <code className="bg-dark-800 px-1.5 py-0.5 rounded text-primary-300 text-xs">vercel.json</code> to change the interval.
        </p>
        <div className="space-y-2">
          {SCHEDULES.map(s => (
            <div
              key={s.cron}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                s.cron === '0 0 * * *'
                  ? 'bg-primary-500/10 border-primary-500/30'
                  : 'bg-dark-800 border-dark-700'
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${s.cron === '0 0 * * *' ? 'text-primary-300' : 'text-dark-300'}`}>
                  {s.label}
                  {s.cron === '0 0 * * *' && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-primary-600 text-white rounded-full">Current</span>
                  )}
                </p>
                <p className="text-xs text-dark-600 font-mono">{s.cron}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-dark-600 mt-4">
          To change schedule: update <code className="text-primary-400">vercel.json</code> → <code className="text-primary-400">"schedule"</code> field and redeploy.
        </p>
      </div>
    </div>
  )
}
