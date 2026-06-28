"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/overview",     label: "Overview",     icon: "⬡" },
  { href: "/treasury",     label: "Treasury",     icon: "💰" },
  { href: "/vitality",     label: "Vitality",     icon: "🏃" },
  { href: "/presence",     label: "Presence",     icon: "👔" },
  { href: "/environment",  label: "Environment",  icon: "🖥️" },
  { href: "/trajectory",   label: "Trajectory",   icon: "🎯" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 h-12">
        <span className="font-bold text-slate-100 mr-4 text-sm tracking-widest uppercase">
          Nevex
        </span>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-slate-800 text-slate-100"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
