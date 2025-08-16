import "server-only";

import { StackServerApp, StackClientApp } from "@stackframe/stack";

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

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
  signIn: "/auth/signin",
  signUp: "/auth/signup",
  afterSignIn: "/",
  afterSignUp: "/auth/complete-signup",
  },
});
