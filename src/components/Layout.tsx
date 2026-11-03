import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";

export function Header() {
  const { count, user, logout } = useStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const nav = (
    <>
      <Link to="/" className="nav-link" activeProps={{ className: "nav-link-active" }} activeOptions={{ exact: true }} data-testid="nav-home">Home</Link>
      <Link to="/products" className="nav-link" activeProps={{ className: "nav-link-active" }} data-testid="nav-products">Products</Link>
    </>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6">
        <Link to="/" className="font-display text-xl font-extrabold tracking-tight" data-testid="logo">
          Shop<span className="text-primary">Flow</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">{nav}</nav>
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm text-muted-foreground" data-testid="user-greeting">Hi, {user.name}</span>
              <button className="btn-ghost" data-testid="logout-button" onClick={() => { logout(); navigate({ to: "/" }); }}>Log out</button>
            </div>
          ) : (
            <Link to="/login" className="btn-ghost hidden sm:inline-flex" data-testid="nav-login">Sign in</Link>
          )}
          <Link to="/cart" className="btn-primary relative" data-testid="nav-cart" aria-label="Cart">
            Cart
            <span className="ml-2 rounded-full bg-primary-foreground px-2 text-xs font-bold text-primary" data-testid="cart-count">{count}</span>
          </Link>
          <button className="btn-ghost md:hidden" aria-label="Menu" data-testid="menu-toggle" onClick={() => setOpen(!open)}>☰</button>
        </div>
      </div>
      {open && (
        <div className="container-page flex flex-col gap-3 border-t border-border py-4 md:hidden" onClick={() => setOpen(false)}>
          {nav}
          {user ? (
            <button className="nav-link text-left" onClick={() => logout()}>Log out ({user.name})</button>
          ) : (
            <Link to="/login" className="nav-link">Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary">
      <div className="container-page flex flex-col gap-2 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p><span className="font-bold text-foreground">ShopFlow</span> — a demo store for QA automation practice.</p>
        <p>No real payments are processed.</p>
      </div>
    </footer>
  );
}

export function Page({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <main className="container-page py-10">
      {title && <h1 className="mb-8 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>}
      {children}
    </main>
  );
}
