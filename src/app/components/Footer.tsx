import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white py-8 mt-0 border-t border-blue-800/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm group hover:text-blue-200 transition-colors duration-300">
              <div className="w-8 h-8 bg-blue-800/30 rounded-lg flex items-center justify-center group-hover:bg-blue-700/40 transition-colors">
                <FontAwesomeIcon icon={faUser} className="text-xs w-4 h-4 text-blue-300" />
              </div>
              <span className="text-blue-100">RAKOTONANDRIANINA Dimithry Marius</span>
            </div>
            <div className="flex items-center gap-3 text-sm group hover:text-blue-200 transition-colors duration-300">
              <div className="w-8 h-8 bg-blue-800/30 rounded-lg flex items-center justify-center group-hover:bg-blue-700/40 transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="text-xs w-4 h-4 text-blue-300" />
              </div>
              <span className="text-blue-100">mariusrakotonandrianina@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm group hover:text-blue-200 transition-colors duration-300">
              <div className="w-8 h-8 bg-blue-800/30 rounded-lg flex items-center justify-center group-hover:bg-blue-700/40 transition-colors">
                <FontAwesomeIcon icon={faPhone} className="text-xs w-4 h-4 text-blue-300" />
              </div>
              <span className="text-blue-100">034 14 443 77</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm group">
              <div className="w-8 h-8 bg-blue-800/30 rounded-lg flex items-center justify-center group-hover:bg-blue-700/40 transition-colors">
                <FontAwesomeIcon icon={faLinkedin} className="text-xs w-4 h-4 text-blue-300" />
              </div>
              <a
                href="https://www.linkedin.com/in/dimithry-marius-rakotonandrianina-b801bb293/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-100 hover:text-blue-300 hover:underline transition-colors duration-300"
              >
                Dimithry Marius Rakotonandrianina
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm group">
              <div className="w-8 h-8 bg-blue-800/30 rounded-lg flex items-center justify-center group-hover:bg-blue-700/40 transition-colors">
                <FontAwesomeIcon icon={faGithub} className="text-xs w-4 h-4 text-blue-300" />
              </div>
              <a
                href="https://github.com/Mariusrakotonandrianina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-100 hover:text-blue-300 hover:underline transition-colors duration-300"
              >
                Rakotonandrianina
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800/40 pt-6 text-sm text-center">
          <div className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent font-medium">
            © 2025 Dimithry Marius. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}