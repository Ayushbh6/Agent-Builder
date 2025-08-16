import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";

export default function Handler(props: unknown) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20"></div>
      
      {/* Floating orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      
      {/* Main container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl shadow-2xl shadow-blue-500/10 p-8">
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Agent Builder
            </h1>
            <p className="text-slate-600 text-sm mt-2">Create powerful AI agents in minutes</p>
          </div>
          
          {/* Stack Auth Component */}
          <div className="[&_.stack-scope]:!font-sans [&_button]:!transition-all [&_button]:!duration-200 [&_button:hover]:!scale-[1.02] [&_input]:!transition-all [&_input]:!duration-200 [&_input:focus]:!ring-blue-500/50 [&_input:focus]:!border-blue-500">
            <StackHandler fullPage={false} app={stackServerApp} routeProps={props} />
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-slate-500 text-sm">
          <p>Secure authentication powered by Neon Auth</p>
        </div>
      </div>
    </div>
  );
}