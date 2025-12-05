import React, { useState } from 'react';
import { Heart, Leaf } from 'lucide-react';
import PrivacyModal from './PrivacyModal';

const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="bg-gradient-to-r from-blue-700 via-pink-600 to-yellow-600 py-12 px-4 mt-16 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-lg font-bold">Fait avec</span>
          <Heart className="w-6 h-6 fill-current text-red-200" aria-label="amour" />
          <span className="text-lg font-bold">pour l'éducation française</span>
        </div>
        
        <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4 text-sm font-medium text-blue-50">
          <p>NIRD - Numérique Inclusif Responsable Durable</p>
          <span className="hidden md:inline">•</span>
          <button onClick={() => setShowPrivacy(true)} className="hover:text-white hover:underline underline-offset-4">
            Mentions Légales & RGPD
          </button>
          <span className="hidden md:inline">•</span>
          <div className="flex items-center gap-1 text-green-100" title="Site éco-conçu">
            <Leaf className="w-4 h-4" /> EcoIndex A
          </div>
        </div>
        
        <p className="text-white/80 text-xs">
          © 2025 Programme NIRD - Tous droits réservés. Hébergement vert recommandé.
        </p>
      </div>
      
      <PrivacyModal open={showPrivacy} onOpenChange={setShowPrivacy} />
    </footer>
  );
};

export default Footer;