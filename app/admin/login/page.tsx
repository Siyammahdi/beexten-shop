import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center text-xl font-semibold tracking-tight">
          beexten<span className="text-muted">.</span>
        </p>
        <div className="mt-8 rounded-3xl border border-line bg-white p-8">
          <h1 className="text-xl font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Enter the admin password to continue.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
