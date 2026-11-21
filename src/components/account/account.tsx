"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  MapPin,
  Settings,
  Plus,
  Trash2,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import {
  getAddresses,
  removeAddress,
  saveAddress,
  updatePassword,
  updateProfile,
} from "@/actions/store.actions";
import { PasswordInput } from "@/components/auth/auth-form";
import { toast } from "sonner";

type Address = {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
};
export default function Account() {
  const { data: session } = useSession();
  const [tab, setTab] = useState("addresses");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(false);
  const [busy, setBusy] = useState(false);
  async function load() {
    setLoading(true);
    try {
      setAddresses(await getAddresses());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load addresses");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function submit(action: () => Promise<unknown>, message: string) {
    setBusy(true);
    try {
      await action();
      toast.success(message);
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to save changes.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="store-container grid items-start gap-8 py-9 lg:grid-cols-[280px_1fr]">
      <aside className="store-panel !p-2">
        <h2 className="border-b p-3 font-semibold">My Account</h2>
        {[
          { id: "addresses", title: "My Addresses", Icon: MapPin },
          { id: "settings", title: "Settings", Icon: Settings },
        ].map(({ id, title, Icon }) => (
          <button
            key={id}
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left text-sm ${tab === id ? "bg-green-50 text-primary" : "text-slate-500"}`}
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
          >
            <Icon className="size-5" />
            {title}
          </button>
        ))}
      </aside>
      <div>
        {tab === "addresses" ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">My Addresses</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Manage your saved delivery addresses
                </p>
              </div>
              <button className="store-button" onClick={() => setForm(!form)}>
                <Plus className="size-4" />
                {form ? "Cancel" : "Add Address"}
              </button>
            </div>
            {form && (
              <form
                className="store-panel mb-6 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const data = Object.fromEntries(
                    new FormData(e.currentTarget),
                  ) as Omit<Address, "_id">;
                  if (await submit(() => saveAddress(data), "Address saved")) {
                    setForm(false);
                    await load();
                  }
                }}
              >
                <h3 className="font-semibold">New Address</h3>
                {[
                  {
                    name: "name",
                    label: "Address Name",
                    placeholder: "Home or Office",
                  },
                  { name: "city", label: "City", placeholder: "Cairo" },
                  {
                    name: "details",
                    label: "Street Address",
                    placeholder: "Street, building, floor, apartment",
                  },
                  {
                    name: "phone",
                    label: "Phone Number",
                    placeholder: "01xxxxxxxxx",
                  },
                ].map((f) => (
                  <label key={f.name} className="block text-sm">
                    {f.label}
                    <input
                      required
                      name={f.name}
                      type={f.name === "phone" ? "tel" : "text"}
                      minLength={f.name === "details" ? 10 : 2}
                      pattern={
                        f.name === "phone" ? "01[0125][0-9]{8}" : undefined
                      }
                      className="store-input mt-2"
                      placeholder={f.placeholder}
                    />
                  </label>
                ))}
                <button disabled={busy} className="store-button" type="submit">
                  {busy ? "Saving…" : "Save Address"}
                </button>
              </form>
            )}
            {loading ? (
              <p role="status">Loading addresses…</p>
            ) : error ? (
              <div role="alert">
                <p className="text-rose-500">{error}</p>
                <button className="store-button mt-4" onClick={load}>
                  Try again
                </button>
              </div>
            ) : addresses.length ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {addresses.map((a) => (
                  <article
                    key={a._id}
                    className="store-panel flex items-start gap-4"
                  >
                    <span className="rounded-xl bg-green-50 p-3 text-primary">
                      <MapPin className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{a.name}</h3>
                      <p className="mt-2 text-sm text-slate-500">{a.details}</p>
                      <p className="mt-3 text-sm text-slate-500">
                        {a.phone} · {a.city}
                      </p>
                    </div>
                    <button
                      disabled={busy}
                      aria-label={`Delete ${a.name} address`}
                      className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:text-rose-500"
                      onClick={async () => {
                        if (
                          await submit(
                            () => removeAddress(a._id),
                            "Address removed",
                          )
                        )
                          await load();
                      }}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="store-panel text-center">
                <MapPin className="mx-auto mb-4 size-10 text-green-300" />
                <h3 className="font-semibold">No saved addresses yet</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Add an address for your next delivery.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">Account Settings</h2>
            <p className="mt-2 mb-6 text-sm text-slate-500">
              Update your profile information and change your password
            </p>
            <form
              className="store-panel space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(
                  new FormData(e.currentTarget),
                ) as { name: string; email: string; phone: string };
                if (
                  await submit(
                    () => updateProfile(data),
                    "Profile updated. Sign in again to refresh your details.",
                  )
                )
                  await signOut({ callbackUrl: "/login" });
              }}
            >
              <div className="flex items-center gap-4">
                <span className="rounded-2xl bg-green-100 p-4 text-primary">
                  <UserRound />
                </span>
                <div>
                  <h3 className="font-semibold">Profile Information</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Update your personal details
                  </p>
                </div>
              </div>
              <label className="block text-sm">
                Full Name
                <input
                  required
                  minLength={3}
                  name="name"
                  defaultValue={session?.user?.name ?? ""}
                  className="store-input mt-2"
                  autoComplete="name"
                />
              </label>
              <label className="block text-sm">
                Email Address
                <input
                  required
                  name="email"
                  type="email"
                  defaultValue={session?.user?.email ?? ""}
                  className="store-input mt-2"
                  autoComplete="email"
                />
              </label>
              <label className="block text-sm">
                Phone Number
                <input
                  required
                  name="phone"
                  type="tel"
                  pattern="01[0125][0-9]{8}"
                  className="store-input mt-2"
                  placeholder="01xxxxxxxxx"
                  autoComplete="tel"
                />
              </label>
              <button disabled={busy} className="store-button" type="submit">
                Save Changes
              </button>
            </form>
            <form
              className="store-panel mt-6 space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                const data = Object.fromEntries(
                  new FormData(e.currentTarget),
                ) as {
                  currentPassword: string;
                  password: string;
                  rePassword: string;
                };
                if (
                  await submit(
                    () => updatePassword(data),
                    "Password changed. Please sign in again.",
                  )
                )
                  await signOut({ callbackUrl: "/login" });
              }}
            >
              <div className="flex items-center gap-4">
                <span className="rounded-2xl bg-amber-100 p-4 text-amber-600">
                  <LockKeyhole />
                </span>
                <div>
                  <h3 className="font-semibold">Change Password</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Update your account password
                  </p>
                </div>
              </div>
              {[
                { name: "currentPassword", label: "Current Password" },
                { name: "password", label: "New Password" },
                { name: "rePassword", label: "Confirm New Password" },
              ].map((f) => (
                <div key={f.name}>
                  <label htmlFor={f.name} className="mb-2 block text-sm">
                    {f.label}
                  </label>
                  <PasswordInput name={f.name} placeholder={f.label} />
                </div>
              ))}
              <button
                disabled={busy}
                type="submit"
                className="store-button !bg-amber-600"
              >
                Change Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
