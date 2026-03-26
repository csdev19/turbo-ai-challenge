interface FabProps {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export default function Fab({ onClick, disabled, children, className = '' }: FabProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#3D2B1F] text-white shadow-lg transition-colors hover:bg-[#5C4033] disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}
