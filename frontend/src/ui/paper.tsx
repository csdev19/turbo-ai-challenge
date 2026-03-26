import { getCategoryCardStyle } from '@/lib/constants'

interface PaperProps {
  color?: string | null
  className?: string
  children: React.ReactNode
}

export default function Paper({ color, className = '', children }: PaperProps) {
  const style = getCategoryCardStyle(color ?? null)

  return (
    <div
      className={`rounded-[11px] ${className}`}
      style={{
        backgroundColor: style.bg,
        border: `3px solid ${style.border}`,
      }}
    >
      {children}
    </div>
  )
}
