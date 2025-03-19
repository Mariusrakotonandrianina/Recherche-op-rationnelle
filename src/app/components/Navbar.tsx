"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Récupère l'URL actuelle

  const isActive = (path: string) => {
    return pathname === path ? "text-blue-600 underline" : "text-gray-600";
  };

  return (
    <nav className="w-full px-4 py-2 bg-white border shadow-md rounded-xl border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-3">
      <div className="flex flex-wrap items-center justify-between text-gray-600">
        <div>
          <Link href="/">
            <span className="text-2xl font-bold cursor-pointer">Algorithme de DEMOUCRON</span>
          </Link>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
          ☰
        </button>
        <div className={`lg:flex ${isOpen ? "block" : "hidden"}`}>
          <ul className="flex flex-col gap-2 my-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 mr-10">
            <li className={`text-lg hover:text-blue-700 ${isActive("/")}`}>
              <Link href="/" className="flex items-center transition-colors">
                Accueil
              </Link>
            </li>
            <li className={`text-lg hover:text-blue-700 ${isActive("/minimum")}`}>
              <Link href="/minimum" className="flex items-center transition-colors">
                Minimum
              </Link>
            </li>
            <li className={`text-lg hover:text-blue-700 ${isActive("/maximum")}`}>
              <Link href="/maximum" className="flex items-center transition-colors">
                Maximum
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
