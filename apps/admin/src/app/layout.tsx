import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Sidebar, SidebarGroup } from "@tapestry/ui";
import { BiCog, BiHome, BiLibrary, BiShoppingBag, BiTable } from "react-icons/bi";

export const metadata: Metadata = {
  title: "Tapestry Admin",
  description: "Manage content, products, and tables",
};
const sidebarGroups: SidebarGroup[] = [
  {
    title: "Main",
    links: [{ href: "/", label: "Dashboard", icon: <BiHome /> }],
  },
  {
    title: "Gameplay",
    links: [
      { href: "/content", label: "Content", icon: <BiLibrary /> },
      { href: "/products", label: "Products", icon: <BiShoppingBag /> },
      { href: "/tables", label: "Tables", icon: <BiTable /> },
    ],
  },
  {
    title: "Account",
    links: [{ href: "/settings", label: "Settings", icon: <BiCog /> }],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground">
        <div className="grid min-h-dvh grid-cols-[260px_1fr]">
          <aside className="border-r bg-muted/30">
            <Sidebar title="Tapestry Admin" groups={sidebarGroups} />
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
