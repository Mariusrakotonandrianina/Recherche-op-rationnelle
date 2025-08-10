"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap, Home, TrendingDown, TrendingUp } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { href: "/", label: "Accueil", icon: <Home className="w-4 h-4" /> },
    { href: "/minimum", label: "Minimum", icon: <TrendingDown className="w-4 h-4" /> },
    { href: "/maximum", label: "Maximum", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-blue-950/90 backdrop-blur-lg border-b border-blue-800/40 shadow-xl' 
          : 'bg-gradient-to-r from-blue-950/80 via-blue-900/80 to-slate-900/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
                  Algorithme de
                </h1>
                <p className="text-sm text-blue-100 -mt-1">DEMOUCRON</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
                    isActive(item.href)
                      ? 'bg-blue-600/40 text-white border border-blue-300/40 shadow-lg'
                      : 'text-blue-100 hover:text-white hover:bg-blue-700/30'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className={`${isActive(item.href) ? 'text-blue-200' : 'group-hover:text-blue-200'} transition-colors`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full"></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <button
              className="lg:hidden p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/40 transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className={`lg:hidden transition-all duration-300 ${
          isOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-blue-800/95 backdrop-blur-lg border-t border-blue-400/30">
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-blue-600/40 text-white border border-blue-300/50 shadow-lg'
                      : 'text-blue-100 hover:text-white hover:bg-blue-700/30'
                  }`}>
                    <span className={`${isActive(item.href) ? 'text-blue-200' : ''} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.href) && (
                      <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full"></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <div className="h-20"></div>
    </>
  );
}