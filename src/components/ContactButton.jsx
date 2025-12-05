
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactButton = () => {
  const handleContactClick = () => {
    window.open('https://www.tchap.gouv.fr/#/welcome', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-6"
        >
          <Sparkles className="w-16 h-16 mx-auto text-yellow-500" />
        </motion.div>
        
        <h2 className="text-4xl font-black text-gray-800 mb-4">
          Rejoignez l'aventure NIRD !
        </h2>
        
        <p className="text-xl text-gray-700 mb-8 font-semibold">
          Une question ? Besoin d'aide ? Notre équipe est là pour vous accompagner !
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleContactClick}
            className="bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 hover:from-blue-600 hover:via-pink-600 hover:to-yellow-600 text-white font-black text-2xl px-12 py-8 rounded-full shadow-2xl border-4 border-white"
          >
            <MessageCircle className="w-8 h-8 mr-3" />
            Contactez-nous sur Tchap
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContactButton;
