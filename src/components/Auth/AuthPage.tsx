import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'
import { OAuthButtons } from './OAuthButtons'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [signupSuccess, setSignupSuccess] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="APEX" className="w-32 h-32 mx-auto mb-3" />
          <p className="text-[var(--text-muted)] text-xs tracking-widest uppercase">Your unfair advantage in the job market</p>
        </div>

        {signupSuccess && (
          <div
            className="mb-4 p-3 rounded-lg text-sm text-center"
            style={{ background: '#0d3d2e', border: '1px solid #0d9e7a', color: '#22c55e' }}
          >
            Account created. Please check your email to confirm, then sign in.
          </div>
        )}

        <OAuthButtons />

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--text-muted)]">or continue with email</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {mode === 'login' ? (
          <LoginForm />
        ) : (
          <SignupForm onSuccess={() => { setSignupSuccess(true); setMode('login') }} />
        )}

        <p className="text-center text-sm text-[var(--text-muted)] mt-4">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => { setMode('signup'); setSignupSuccess(false) }}
                className="text-[var(--teal)] hover:underline"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-[var(--teal)] hover:underline"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                Sign in
              </button>
            </>
          )}
        </p>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          By signing in, you agree to our{' '}
          <a href="/privacy.html" target="_blank" rel="noopener" className="text-[var(--teal)] hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
