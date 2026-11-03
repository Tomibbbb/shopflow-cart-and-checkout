import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ShopFlow" },
      { name: "description", content: "Sign in to your ShopFlow account." },
      { property: "og:title", content: "Sign in — ShopFlow" },
      { property: "og:description", content: "Access your ShopFlow account." },
    ],
  }),
  component: Login,
});

function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <main className="container-page py-16">
      <BackButton fallback="/" />
      <div className="flex justify-center">
      <form
        className="auth-card"
        data-testid="login-form"
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          if (!email || !password) return setError("Email and password are required");
          if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address");
          setBusy(true);
          const { error: err } = await login(email, password);
          setBusy(false);
          if (err) return setError(err);
          navigate({ to: "/products" });
        }}
      >
        <h1 className="font-display text-2xl font-extrabold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to continue shopping.</p>
        <label className="field">Email<input className="input" type="email" autoComplete="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" /></label>
        <label className="field">Password<input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password" /></label>
        {error && <p className="text-sm text-destructive" role="alert" data-testid="login-error">{error}</p>}
        <button className="btn-primary btn-lg w-full" type="submit" disabled={busy} data-testid="login-submit">{busy ? "Signing in…" : "Sign in"}</button>
        <p className="text-center text-sm text-muted-foreground">New here? <Link to="/register" className="font-semibold text-primary">Create an account</Link></p>
      </form>
      </div>
    </main>
  );
}
