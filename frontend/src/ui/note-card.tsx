import type { Note } from '@/lib/definitions'
import { FONT_TITLE, FONT_BODY } from '@/lib/constants'
import Paper from './paper'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'

  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

export default function NoteCard({ note }: { note: Note }) {
  return (
    <Paper
      color={note.category_color}
      className="h-[246px] overflow-hidden p-4 transition-shadow hover:shadow-md"
    >
      <div className={`mb-3 flex items-center gap-2 ${FONT_BODY}`}>
        <span className="text-xs font-bold leading-none text-black">
          {formatDate(note.updated_at)}
        </span>
        {note.category_name && (
          <span className="text-xs font-normal leading-none text-black">
            {note.category_name}
          </span>
        )}
      </div>

      <h3 className={`mb-3 ${FONT_TITLE} text-2xl font-bold leading-none text-black line-clamp-3`}>
        {note.title || 'Untitled'}
      </h3>

      {note.content && (
        <p className={`${FONT_BODY} text-xs font-normal leading-none text-black line-clamp-8 whitespace-pre-wrap`}>
          {note.content}
        </p>
      )}
    </Paper>
  )
}
