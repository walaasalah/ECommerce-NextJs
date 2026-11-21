"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignUpUser } from "@/services/Auth.services";
import { registerschema } from "@/lib/schemas/Auth.schema";

export function PasswordInput({
  name,
  placeholder,
  minLength = 8,
}: {
  name: string;
  placeholder: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        required
        minLength={minLength}
        name={name}
        id={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={name === "password" ? "current-password" : "new-password"}
        className="store-input pr-12"
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
export default function AuthForm({ register = false }: { register?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <div className="store-panel mx-auto w-full max-w-xl !border-0 !p-6 !shadow-xl sm:!p-12">
      <div className="mb-8 text-center">
        <p className="font-heading text-3xl font-bold">
          <span className="text-primary">Fresh</span>Cart
        </p>
        <h1 className="mt-5 font-heading text-2xl font-bold">
          {register ? "Create Your Account" : "Welcome Back!"}
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          {register
            ? "Join FreshCart and start your fresh shopping journey"
            : "Sign in to continue your fresh shopping experience"}
        </p>
      </div>
      <form
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const fields = Object.fromEntries(
            new FormData(e.currentTarget),
          ) as Record<string, string>;
          try {
            if (register) {
              const result = registerschema.safeParse(fields);
              if (!result.success)
                throw new Error(result.error.issues[0].message);
              const data = await SignUpUser(result.data);
              if (data.message !== "success")
                throw new Error(data.message ?? "Unable to create account");
              toast.success("Account created. Please sign in.");
              router.push("/login");
            } else {
              const result = await signIn("credentials", {
                email: fields.email,
                password: fields.password,
                redirect: false,
              });
              if (!result?.ok)
                throw new Error(result?.error ?? "Unable to sign in");
              toast.success("Welcome back!");
              router.push("/product");
              router.refresh();
            }
          } catch (e) {
            setError(
              e instanceof Error
                ? e.message
                : "Something went wrong. Please try again.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {register && (
          <label className="block text-sm">
            Full Name
            <input
              required
              minLength={3}
              maxLength={30}
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              className="store-input mt-2"
            />
          </label>
        )}
        <label className="block text-sm">
          Email Address
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className="store-input mt-2"
          />
        </label>
        {register && (
          <label className="block text-sm">
            Phone Number
            <input
              required
              name="phone"
              type="tel"
              autoComplete="tel"
              pattern="[0-9]{11}"
              placeholder="01xxxxxxxxx"
              className="store-input mt-2"
            />
          </label>
        )}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <label htmlFor="password">Password</label>
            {!register && (
              <Link className="text-primary" href="/forget-password">
                Forgot Password?
              </Link>
            )}
          </div>
          <PasswordInput
            name="password"
            placeholder="Enter your password"
            minLength={register ? 8 : 1}
          />
          {register && (
            <p className="mt-2 text-xs text-slate-500">
              At least 8 characters, with uppercase, lowercase, a number and a
              special character.
            </p>
          )}
        </div>
        {register && (
          <div>
            <label className="mb-2 block text-sm" htmlFor="rePassword">
              Confirm Password
            </label>
            <PasswordInput
              name="rePassword"
              placeholder="Confirm your password"
            />
          </div>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600"
          >
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="store-button w-full py-3.5"
          type="submit"
        >
          {busy ? "Please wait…" : register ? "Create Account" : "Sign In"}
        </button>
      </form>
      <p className="mt-8 border-t pt-6 text-center text-sm text-slate-500">
        {register ? "Already have an account? " : "New to FreshCart? "}
        <Link
          className="font-semibold text-primary"
          href={register ? "/login" : "/register"}
        >
          {register ? "Sign In" : "Create an account"}
        </Link>
      </p>
      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <LockKeyhole className="size-3" />
        Your details stay private
      </p>
    </div>
  );
}
