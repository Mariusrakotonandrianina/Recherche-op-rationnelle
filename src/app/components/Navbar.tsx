"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "text-blue-400 underline" : "text-gray-300";
  };

  return (
    <nav className="w-full px-10 py-10 bg-gray-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between">
        <div>
          <Link href="/">
            <span className="text-2xl font-bold text-white cursor-pointer">
              Algorithme de DEMOUCRON
            </span>
          </Link>
        </div>
        <div
          className={`w-full lg:flex lg:items-center lg:w-auto ${
            isOpen ? "block mt-4" : "hidden"
          } lg:mt-0`}
        >
          <ul className="flex flex-col gap-3 lg:flex-row lg:gap-8 text-lg font-medium">
            <li className={`hover:text-blue-400 ${isActive("/")}`}>
              <Link href="/" className="transition-colors duration-200">
                Accueil
              </Link>
            </li>
            <li className={`hover:text-blue-400 ${isActive("/minimum")}`}>
              <Link href="/minimum" className="transition-colors duration-200">
                Minimum
              </Link>
            </li>
            <li className={`hover:text-blue-400 ${isActive("/maximum")}`}>
              <Link href="/maximum" className="transition-colors duration-200">
                Maximum
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
