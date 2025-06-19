import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-0">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
          {/* Infos personnelles */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faUser} className="text-xs w-6 h-6" />
              <span>RAKOTONANDRIANINA Dimithry Marius</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faEnvelope} className="text-xs w-6 h-6" />
              <span>mariusrakotonandrianina@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faPhone} className="text-xs w-6 h-6" />
              <span>034 14 443 77</span>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faLinkedin} className="text-xs w-6 h-6" />
              <a
                href="https://www.linkedin.com/in/dimithry-marius-rakotonandrianina-b801bb293/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Dimithry Marius Rakotonandrianina
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faGithub} className="text-xs w-6 h-6" />
              <a
                href="https://github.com/Mariusrakotonandrianina"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Rakotonandrianina
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 text-xs text-center text-gray-400">
          Dimithry Marius. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
