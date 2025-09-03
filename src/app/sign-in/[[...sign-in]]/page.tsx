import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-white text-black hover:bg-gray-200",
              card: "bg-gray-900 border border-gray-800",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "border border-gray-700 text-white hover:bg-gray-800",
              socialButtonsBlockButtonText: "text-white",
              formFieldLabel: "text-white",
              formFieldInput: "bg-gray-800 border-gray-700 text-white",
              footerActionLink: "text-orange-500 hover:text-orange-400",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-orange-500",
            }
          }}
        />
      </div>
    </div>
  );
}