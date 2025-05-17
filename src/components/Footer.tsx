import React from 'react';
import { Link } from 'react-router-dom';
import NixoLogo from './NixoLogo';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 py-8 glass-panel bg-space-black/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <NixoLogo className="h-8 w-8" />
              <span className="ml-2 text-white font-display text-lg font-medium tracking-wider">
                Nixo<span className="text-nixo-green">.Network</span>
              </span>
            </Link>
            <p className="mt-4 text-xl text-gray-400">
              The next generation decentralized network for digital assets and applications.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-xl font-semibold text-white uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/nixotag" className="text-gray-400 hover:text-nixo-green text-xl">Nixo Tag</Link>
              </li>
              <li>
                <Link to="/nixonode" className="text-gray-400 hover:text-nixo-green text-xl">Nixo Node</Link>
              </li>
              <li>
                <Link to="/nixocluster" className="text-gray-400 hover:text-nixo-green text-xl">Nixo Cluster</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/docs" className="text-gray-400 hover:text-nixo-green text-xl">Documentation</Link>
              </li>
              <li>
                <Link to="/lightpaper" className="text-gray-400 hover:text-nixo-green text-xl">Light Paper</Link>
              </li>
              <li>
                <Link to="/deckpage" className="text-gray-400 hover:text-nixo-green text-xl">Deckpage</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white uppercase tracking-wider">Connect</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-nixo-green">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://x.com/nixo_sol?s=11&t=Z5dUGqapsmG6hua4H3r7UQ" className="text-gray-400 hover:text-nixo-green">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-4">
              <Link to="/login" className="text-gray-400 hover:text-nixo-green text-xl">
              <button className="glass-button text-xl">
                Subscribe to Updates
              </button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center md:flex md:items-center md:justify-between">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Nixo Network. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
            <Link to="/privacy" className="text-xs text-gray-400 hover:text-nixo-green">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-400 hover:text-nixo-green">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;