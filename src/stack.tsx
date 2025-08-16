import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
  signIn: "/auth/signin",
  signUp: "/auth/signup",
  afterSignIn: "/",
  // land on a custom page to finish profile and persist names
  afterSignUp: "/auth/complete-signup",
  },
});
