"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-sky-100 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            <Image
              src="/logo2.png"
              alt="Thravi HMS"
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">THRAVI</span>
            <span className="text-xs text-slate-500">Healthcare Intelligence</span>
          </div>
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            className="text-slate-700 hover:text-slate-900 hover:bg-sky-50"
          >
            <Link href="/login">Log In</Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:from-sky-500 hover:to-indigo-500 shadow-md"
          >
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
