import {
  auth,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoutes = createRouteMatcher([
  "/",
  "/api(.*)",
  "/dashboard(.*)",
  "/forum(.*)",
]);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoutes(request)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
