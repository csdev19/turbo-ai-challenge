'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { signup } from '@/app/actions/auth'
import { FONT_TITLE, FONT_BODY } from '@/lib/constants'

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={`flex flex-col items-center ${FONT_BODY}`}>
      <Image src="/signup-image.png" alt="Welcome" width={160} height={160} className="mb-6" priority />

      {/* Inria Serif, Bold, 48px, #88642A */}
      <h1 className={`mb-10 text-5xl font-bold text-[#88642A] ${FONT_TITLE}`}>
        Yay, New Friend!
      </h1>

      <form action={action} className="w-full space-y-4">
        {state?.message && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {state.message}
          </p>
        )}

        <div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email address"
            required
            className="w-full rounded-full border border-[#957139] bg-transparent px-5 py-3.5 text-sm text-black placeholder-[#957139]/60 outline-none focus:border-[#88642A]"
          />
          {state?.errors?.email && (
            <p className="mt-1 px-5 text-xs text-red-600">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            className="w-full rounded-full border border-[#957139] bg-transparent px-5 py-3.5 pr-12 text-sm text-black placeholder-[#957139]/60 outline-none focus:border-[#88642A]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#957139]/60 hover:text-[#957139]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {state?.errors?.password && (
            <div className="mt-1 px-5 text-xs text-red-600">
              {state.errors.password.map((e) => <p key={e}>{e}</p>)}
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full border border-[#957139] bg-transparent py-3.5 text-base font-semibold text-[#957139] transition-colors hover:bg-[#957139]/10 disabled:opacity-50"
          >
            {pending ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>
      </form>

      <Link
        href="/login"
        className="mt-5 text-sm text-[#957139]/70 hover:text-[#957139] hover:underline"
      >
        We&apos;re already friends!
      </Link>
    </div>
  )
}
