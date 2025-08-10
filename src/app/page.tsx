"use client";

import { useState, useEffect } from 'react';
import { Zap, Target, Clock } from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: "Performance Optimale", desc: "Algorithme ultra-rapide" },
    { icon: <Target className="w-6 h-6" />, title: "Précision Garantie", desc: "Résultats mathématiquement exacts" },
    { icon: <Clock className="w-6 h-6" />, title: "Temps Réel", desc: "Calculs instantanés" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-blue-600 rounded-full opacity-5 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Optimisation de
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Parcours</span>
                </h1>
                <p className="text-xl text-blue-200">
                  avec l'Algorithme de <span className="font-semibold text-white">Demoucron</span>
                </p>
              </div>

              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  Découvrez la puissance de l&apos;optimisation avec notre implémentation avancée de l&apos;algorithme de Demoucron. 
                  Spécialement conçu pour les <span className="text-blue-300 font-medium">graphes orientés acycliques (DAG)</span>, 
                  notre solution calcule instantanément le chemin optimal.
                </p>
                <p>
                  Parfait pour la <span className="text-cyan-300 font-medium">planification de projets</span>, 
                  l&apos;ordonnancement des tâches, et la navigation intelligente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border transition-all duration-500 ${
                      currentFeature === index 
                        ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-400/50 scale-105' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${currentFeature === index ? 'text-blue-300' : 'text-gray-400'} transition-colors`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                        <p className="text-gray-400 text-xs">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-3">Construit avec les meilleures technologies :</p>
                <div className="flex flex-wrap gap-3">
                  {['Next.js', 'TypeScript', 'Tailwind CSS', 'React'].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              
              <div className="relative">
                
                <div className="relative w-full max-w-lg mx-auto">
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
                  
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
                    <svg viewBox="0 0 400 300" className="w-full h-auto">
                      <defs>
                        <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{stopColor: '#8b5cf6', stopOpacity: 0.8}} />
                          <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {[
                        {x1: 80, y1: 80, x2: 150, y2: 120},
                        {x1: 80, y1: 80, x2: 200, y2: 80},
                        {x1: 150, y1: 120, x2: 250, y2: 150},
                        {x1: 200, y1: 80, x2: 250, y2: 150},
                        {x1: 250, y1: 150, x2: 320, y2: 200}
                      ].map((edge, index) => (
                        <line
                          key={index}
                          x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
                          stroke="url(#edgeGradient)"
                          strokeWidth="3"
                          filter="url(#glow)"
                          className="animate-pulse"
                          style={{animationDelay: `${index * 0.2}s`}}
                        />
                      ))}
                      
                      {[
                        {cx: 80, cy: 80, label: 'A'},
                        {cx: 150, cy: 120, label: 'B'},
                        {cx: 200, cy: 80, label: 'C'},
                        {cx: 250, cy: 150, label: 'D'},
                        {cx: 320, cy: 200, label: 'E'}
                      ].map((node, index) => (
                        <g key={index}>
                          <circle
                            cx={node.cx} cy={node.cy} r="20"
                            fill="url(#edgeGradient)"
                            filter="url(#glow)"
                            className="animate-bounce"
                            style={{animationDelay: `${index * 0.3}s`, animationDuration: '2s'}}
                          />
                          <text
                            x={node.cx} y={node.cy}
                            textAnchor="middle"
                            dy="0.35em"
                            fill="white"
                            fontSize="16"
                            fontWeight="bold"
                          >
                            {node.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce" style={{animationDelay: '0.5s'}}>
                    <div className="text-xs font-medium">Parcours</div>
                    <div className="text-lg font-bold">A→C→D→E</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}