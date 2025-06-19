"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gradient-to-br py-50 bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center text-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: Project Description */}
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-4xl font-bold mb-2 animate-slide-down">
            Optimisation de Parcours <br />avec l'Algorithme de Demoucron
          </h2>
          <p className="text-lg leading-relaxed opacity-90">
            Bienvenue sur notre site dédié à l'optimisation de parcours ! Nous utilisons
            l'algorithme de Demoucron pour calculer le chemin optimal et minimal dans un
            graphe orienté acyclique (DAG). Cet algorithme performant permet de déterminer
            l'ordre topologique ou le chemin critique, idéal pour la planification de
            projets, l'ordonnancement des tâches ou la navigation optimisée.
          </p>
          <p className="text-lg leading-relaxed opacity-90">
            Entrez vos données, et notre outil vous fournira une solution précise et rapide,
            construite avec Next.js, TypeScript et Tailwind CSS pour une expérience
            utilisateur fluide et moderne.
          </p>
        </div>

        {/* Right: Animated Image */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-md animate-float-slow">
            <Image
              src="/images/ProgressVectors.jpeg"
              alt="Graph illustration for Demoucron's algorithm"
              width={800}
              height={800}
              className="object-contain rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }

        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 1s ease-out;
        }
      `}</style>
    </div>
  );
}
