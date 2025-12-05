
import React from 'react';
import { motion } from 'framer-motion';

const Bee = ({ delay, duration, xRange, yRange }) => (
  <motion.div
    className="absolute pointer-events-none z-20"
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      x: xRange,
      y: yRange,
      rotate: [0, 15, -15, 10, 0],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "linear"
    }}
  >
    <div className="text-2xl filter drop-shadow-md">🐝</div>
  </motion.div>
);

const Bees = () => {
  // Génération de plusieurs abeilles avec des trajectoires aléatoires
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Bee delay={0} duration={15} xRange={['10vw', '90vw']} yRange={['10vh', '40vh']} />
      <Bee delay={5} duration={20} xRange={['80vw', '20vw']} yRange={['60vh', '20vh']} />
      <Bee delay={2} duration={18} xRange={['30vw', '70vw']} yRange={['80vh', '30vh']} />
      <Bee delay={8} duration={25} xRange={['5vw', '40vw']} yRange={['30vh', '90vh']} />
      <Bee delay={12} duration={22} xRange={['90vw', '60vw']} yRange={['10vh', '80vh']} />
    </div>
  );
};

export default Bees;
