
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Laptop, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmYzEwNyIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-8">
            <motion.img 
              src="https://horizons-cdn.hostinger.com/1bfa4365-a747-472f-aefd-9482b2a1754c/25bb199d9d433e88374198d04c5d9644.png"
              alt="Logo NIRD"
              className="w-64 h-auto drop-shadow-2xl"
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-500"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Bienvenue au Village NIRD !
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-700 font-bold max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Le programme révolutionnaire qui transforme l'éducation numérique !
          </motion.p>
        </motion.div>

        <div className="flex justify-center gap-8 mt-12 flex-wrap">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-blue-600"
          >
            <Laptop className="w-16 h-16" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 2,
              delay: 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-pink-500"
          >
            <Sparkles className="w-16 h-16" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 2,
              delay: 0.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-yellow-500"
          >
            <Users className="w-16 h-16" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
