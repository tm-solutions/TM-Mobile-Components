import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "@/components/docs/mobile-nav";
import { Sidebar } from "@/components/docs/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "TM Components UI",
  description:
    "Catalogo interno de componentes React Native reutilizables de TM Solutions",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full">
        <header className="sticky top-0 z-20 bg-tm text-tm-foreground shadow-sm">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <Link href="/" className="flex items-center gap-3">
              {/* Chip blanco: el logo es azul sobre transparente y se perderia
                  contra el fondo del header. */}
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <Image
                  src="/logo-tm.png"
                  alt="TM Solutions"
                  width={32}
                  height={32}
                  priority
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-semibold tracking-tight">
                  TM Components UI
                </span>
                <span className="text-[11px] text-tm-foreground/70">
                  TM Solutions
                </span>
              </span>
            </Link>
          </div>
        </header>

        <MobileNav />

        <div className="mx-auto flex max-w-7xl">
          <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 overflow-y-auto border-r border-border md:block">
            <Sidebar />
          </aside>
          <main className="min-w-0 flex-1 px-4 py-8 md:px-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
