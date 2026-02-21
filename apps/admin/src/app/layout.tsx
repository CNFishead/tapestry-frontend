import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tapestry Admin",
  description: "Manage content, products, and tables",
};

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/content", label: "Content" },
  { href: "/products", label: "Products" },
  { href: "/tables", label: "Tables" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground">
        <div className="grid min-h-dvh grid-cols-[260px_1fr]">
          <aside className="border-r bg-muted/30">
            <div className="px-4 py-4 font-semibold">Tapestry Admin</div>
            <nav className="px-2 space-y-1">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded px-3 py-2 text-sm hover:bg-muted">
                  {n.label}
                </Link>
              ))}
            </nav>
          </aside>

          <div className="flex flex-col">
            <header className="border-b bg-background">
              <div className="px-6 py-4 text-sm text-muted-foreground">Admin Panel (you-only for MVP)</div>
            </header>
            <main className="px-6 py-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
