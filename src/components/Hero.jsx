import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Laptop, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4" aria-label="Introduction">
      {/* Utilisation de SVG en data URI optimisé (très léger) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmYzEwNyIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }} // Animation réduite pour EcoIndex (moins de CPU)
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-8">
            <motion.img 
              src="https://horizons-cdn.hostinger.com/1bfa4365-a747-472f-aefd-9482b2a1754c/25bb199d9d433e88374198d04c5d9644.png"
              alt="Logo NIRD"
              className="w-64 h-auto drop-shadow-2xl"
              width="256"
              height="256"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gray-900">
            Bienvenue au <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-pink-600 to-yellow-600">Village NIRD !</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 font-bold max-w-3xl mx-auto">
            Le programme révolutionnaire qui transforme l'éducation numérique !
          </p>
        </motion.div>

        <div className="flex justify-center gap-8 mt-12 flex-wrap">
          <div className="text-blue-700 p-4 bg-white rounded-full shadow-sm" title="Numérique">
            <Laptop className="w-12 h-12" aria-hidden="true" />
          </div>
          
          <div className="text-pink-600 p-4 bg-white rounded-full shadow-sm" title="Inclusif">
            <Sparkles className="w-12 h-12" aria-hidden="true" />
          </div>
          
          <div className="text-yellow-600 p-4 bg-white rounded-full shadow-sm" title="Responsable">
            <Users className="w-12 h-12" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;