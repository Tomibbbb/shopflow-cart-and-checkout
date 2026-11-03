import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — ShopFlow" },
      { name: "description", content: "Register a new ShopFlow account." },
      { property: "og:title", content: "Create account — ShopFlow" },
      { property: "og:description", content: "Join ShopFlow in seconds." },
    ],
  }),
  component: Register,
});

function Register() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const upd = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  if (sentTo)
    return (
      <main className="container-page flex justify-center py-16">
        <div className="auth-card text-center" data-testid="register-success">
          <h1 className="font-display text-2xl font-extrabold">Check your email</h1>
          <p className="text-sm text-muted-foreground">We sent a confirmation link to <strong>{sentTo}</strong>. Click it to activate your account, then sign in.</p>
          <Link to="/login" className="btn-primary btn-lg w-full">Go to sign in</Link>
        </div>
      </main>
    );

  return (
    <main className="container-page py-16">
      <BackButton fallback="/" />
      <div className="flex justify-center">
      <form
        className="auth-card"
        data-testid="register-form"
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          if (!f.name.trim() || !f.email || !f.password) return setError("All fields are required");
          if (f.name.trim().length > 100) return setError("Name must be under 100 characters");
          if (!/^\S+@\S+\.\S+$/.test(f.email)) return setError("Enter a valid email address");
          if (f.password.length < 6) return setError("Password must be at least 6 characters");
          if (f.password !== f.confirm) return setError("Passwords do not match");
          setBusy(true);
          const res = await register(f.name.trim(), f.email, f.password);
          setBusy(false);
          if (res.error) return setError(res.error);
          if (res.needsConfirmation) return setSentTo(f.email.trim());
          navigate({ to: "/products" });
        }}
      >
        <h1 className="font-display text-2xl font-extrabold">Create your account</h1>
        <label className="field">Full name<input className="input" maxLength={100} value={f.name} onChange={upd("name")} data-testid="register-name" /></label>
        <label className="field">Email<input className="input" type="email" maxLength={255} value={f.email} onChange={upd("email")} data-testid="register-email" /></label>
        <label className="field">Password<input className="input" type="password" autoComplete="new-password" value={f.password} onChange={upd("password")} data-testid="register-password" /></label>
        <label className="field">Confirm password<input className="input" type="password" autoComplete="new-password" value={f.confirm} onChange={upd("confirm")} data-testid="register-confirm" /></label>
        {error && <p className="text-sm text-destructive" role="alert" data-testid="register-error">{error}</p>}
        <button className="btn-primary btn-lg w-full" type="submit" disabled={busy} data-testid="register-submit">{busy ? "Creating account…" : "Create account"}</button>
        <p className="text-center text-sm text-muted-foreground">Already registered? <Link to="/login" className="font-semibold text-primary">Sign in</Link></p>
      </form>
      </div>
    </main>
  );
}
