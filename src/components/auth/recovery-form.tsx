"use client";
import { useState } from "react";
import { KeyRound, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { passwordRecovery } from "@/actions/store.actions";
import { PasswordInput } from "./auth-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RecoveryForm() {
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const titles = {
    email: "Forgot Password?",
    verify: "Verify Reset Code",
    reset: "Reset Password",
  };
  return (
    <div className="store-panel mx-auto max-w-xl !border-0 !p-7 !shadow-xl sm:!p-12">
      <p className="text-center font-heading text-3xl font-bold">
        <span className="text-primary">Fresh</span>Cart
      </p>
      <h1 className="mt-5 text-center font-heading text-2xl font-bold">
        {titles[step]}
      </h1>
      <p className="mt-3 text-center text-sm text-slate-500">
        {step === "email"
          ? "No worries, we’ll send you a reset code"
          : step === "verify"
            ? `Enter the code sent to ${email}`
            : "Choose a new password for your account"}
      </p>
      <div
        aria-label="Password reset progress"
        className="my-9 flex items-center justify-center gap-4"
      >
        {[Mail, KeyRound, LockKeyhole].map((Icon, i) => (
          <span
            key={i}
            className={`grid size-11 place-items-center rounded-full ${i <= ["email", "verify", "reset"].indexOf(step) ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}
          >
            <Icon className="size-4" />
          </span>
        ))}
      </div>
      <form
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const data = new FormData(e.currentTarget);
          try {
            if (step === "email") {
              await passwordRecovery("email", { email });
              setStep("verify");
            } else if (step === "verify") {
              await passwordRecovery("verify", {
                resetCode: String(data.get("resetCode")),
              });
              setStep("reset");
            } else {
              const password = String(data.get("newPassword"));
              if (password !== data.get("confirmPassword"))
                throw new Error("Passwords do not match.");
              await passwordRecovery("reset", { email, newPassword: password });
              toast.success("Password reset. Please sign in.");
              router.push("/login");
            }
          } catch (e) {
            setError(
              e instanceof Error ? e.message : "Unable to reset your password.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {step === "email" ? (
          <label className="block text-sm">
            Email Address
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="store-input mt-2"
              placeholder="Enter your email address"
            />
          </label>
        ) : step === "verify" ? (
          <label className="block text-sm">
            Reset Code
            <input
              name="resetCode"
              required
              pattern="[0-9]{6}"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="store-input mt-2 text-center tracking-[.5em]"
              placeholder="000000"
            />
          </label>
        ) : (
          <>
            <div>
              <label htmlFor="newPassword" className="mb-2 block text-sm">
                New Password
              </label>
              <PasswordInput
                name="newPassword"
                placeholder="Enter your new password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm">
                Confirm Password
              </label>
              <PasswordInput
                name="confirmPassword"
                placeholder="Confirm your new password"
              />
            </div>
          </>
        )}
        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="store-button w-full">
          {busy
            ? "Please wait…"
            : step === "email"
              ? "Send Reset Code"
              : step === "verify"
                ? "Verify Code"
                : "Reset Password"}
        </button>
        {step === "verify" && (
          <button
            type="button"
            className="w-full text-sm text-primary"
            onClick={() => {
              setStep("email");
              setError("");
            }}
          >
            Change email or resend code
          </button>
        )}
      </form>
      <p className="mt-8 border-t pt-6 text-center text-sm">
        <Link href="/login" className="text-primary">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
