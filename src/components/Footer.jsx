
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-500 py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-white mb-4">
          <span className="text-lg font-bold">Fait avec</span>
          <Heart className="w-6 h-6 fill-current" />
          <span className="text-lg font-bold">pour l'éducation française</span>
        </div>
        
        <p className="text-white font-semibold mb-2">
          NIRD - Numérique Inclusif Responsable Durable
        </p>
        
        <p className="text-white/90 text-sm">
          © 2025 Programme NIRD - Tous droits réservés
        </p>
      </div>
    </footer>
  );
};

export default Footer;
