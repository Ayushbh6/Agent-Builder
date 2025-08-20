import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="w-full">
        <SignUp
          redirectUrl="/onboarding"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  )
}