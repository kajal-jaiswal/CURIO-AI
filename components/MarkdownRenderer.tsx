import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github-dark.css'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-4xl font-bold text-dark-50 mt-8 mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-3xl font-semibold text-dark-50 mt-8 mb-4" id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-2xl font-semibold text-dark-100 mt-6 mb-3" id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')} {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-4 leading-7 text-dark-200" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a className="text-primary-400 hover:text-primary-300 underline" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-dark-200" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-dark-200" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-dark-300 my-4" {...props} />
        ),
        code: ({ node, inline, ...props }: any) => {
          if (inline) {
            return (
              <code className="bg-dark-800 text-primary-300 px-1.5 py-0.5 rounded text-sm" {...props} />
            )
          }
          return (
            <code className="block bg-dark-900 border border-dark-700 rounded-lg p-4 mb-4 overflow-x-auto" {...props} />
          )
        },
        img: ({ node, ...props }) => (
          <img className="rounded-lg my-6 w-full" {...props} alt={props.alt || ''} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
