import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="w-full">
        <SignIn
          redirectUrl="/onboarding"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  )
}