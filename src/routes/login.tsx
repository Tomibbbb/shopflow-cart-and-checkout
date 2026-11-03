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

  return (
    <main className="container-page flex justify-center py-16">
      <form
        className="auth-card"
        data-testid="login-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!email || !password) return setError("Email and password are required");
          const err = login(email, password);
          if (err) return setError(err);
          navigate({ to: "/products" });
        }}
      >
        <h1 className="font-display text-2xl font-extrabold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to continue shopping.</p>
        <label className="field">Email<input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" /></label>
        <label className="field">Password<input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password" /></label>
        {error && <p className="text-sm text-destructive" role="alert" data-testid="login-error">{error}</p>}
        <button className="btn-primary btn-lg w-full" type="submit" data-testid="login-submit">Sign in</button>
        <p className="text-center text-sm text-muted-foreground">New here? <Link to="/register" className="font-semibold text-primary">Create an account</Link></p>
      </form>
    </main>
  );
}
