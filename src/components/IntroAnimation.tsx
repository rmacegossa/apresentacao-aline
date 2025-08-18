import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(true);
  const [showParticles, setShowParticles] = useState(false);
  const [showCapa, setShowCapa] = useState(false);

  useEffect(() => {
    // Sequência de animação
    const timer1 = setTimeout(() => {
      setShowLogo(false);
      setShowParticles(true);
    }, 2000); // Logo fica visível por 2 segundos

    const timer2 = setTimeout(() => {
      setShowParticles(false);
      setShowCapa(true);
    }, 3500); // Partículas ficam visíveis por 1.5 segundos

    const timer3 = setTimeout(() => {
      onComplete(); // Finaliza a animação
    }, 5000); // Total de 5 segundos

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Componente de partículas
  const Particle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
    <motion.div
      className="absolute w-2 h-2 bg-white rounded-full"
      initial={{ 
        x: 0, 
        y: 0, 
        opacity: 1, 
        scale: 1 
      }}
      animate={{ 
        x: x, 
        y: y, 
        opacity: 0, 
        scale: 0 
      }}
      transition={{ 
        duration: 1.5, 
        delay: delay,
        ease: "easeOut"
      }}
    />
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <AnimatePresence mode="wait">
        {/* Logo Central */}
        {showLogo && (
          <motion.div
            key="logo"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                src="/logo.png" 
                alt="Logo da Empresa" 
                className="w-96 h-96 object-contain"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Explosão de Partículas */}
        {showParticles && (
          <motion.div
            key="particles"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Partículas que se espalham em todas as direções */}
            {Array.from({ length: 50 }).map((_, i) => {
              const angle = (i / 50) * 2 * Math.PI;
              const distance = 200 + Math.random() * 300;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              const delay = Math.random() * 0.5;
              
              return (
                <Particle 
                  key={i} 
                  delay={delay} 
                  x={x} 
                  y={y} 
                />
              );
            })}
          </motion.div>
        )}

        {/* Transição para a Capa */}
        {showCapa && (
          <motion.div
            key="capa-transition"
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroAnimation;
