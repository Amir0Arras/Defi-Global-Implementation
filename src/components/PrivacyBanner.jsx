import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, X } from 'lucide-react';
import PrivacyModal from './PrivacyModal';

const PrivacyBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nird-consent');
    if (!consent) {
      // Délai pour ne pas agresser l'utilisateur immédiatement (UX Responsable)
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nird-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Sobriété : On ne stocke rien, on ferme juste.
    // NIRD n'utilise pas de traceurs tiers par défaut, donc "refuser" = continuer sans cookie de préférence.
    localStorage.setItem('nird-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t-4 border-blue-500 shadow-2xl"
            role="alertdialog"
            aria-labelledby="cookie-heading"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" aria-hidden="true" />
                <div>
                  <h3 id="cookie-heading" className="font-bold text-lg text-gray-800">Respect de votre vie privée</h3>
                  <p className="text-sm text-gray-600">
                    Le village NIRD utilise un stockage local minimal pour vos préférences (mode sombre, progression quiz). 
                    Aucun traçage publicitaire tiers (GAFAM).
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => setShowModal(true)} className="text-blue-600 underline text-sm">
                  En savoir plus
                </Button>
                <Button variant="outline" onClick={handleDecline} className="border-gray-300 text-gray-600">
                  Continuer sans
                </Button>
                <Button onClick={handleAccept} className="bg-blue-600 hover:bg-blue-700 text-white">
                  C'est tout bon !
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <PrivacyModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
};

export default PrivacyBanner;