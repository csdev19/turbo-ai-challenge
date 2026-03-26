export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF1E3] px-4">
      <div className="w-full max-w-[384px]">{children}</div>
    </div>
  )
}
