"use client";
import { Suspense } from "react";
import LoginContainer from "./LoginContainer";

export default function LoginContent() {
  return (
    <Suspense fallback={null}>
      <LoginContainer />
    </Suspense>
  );
}
