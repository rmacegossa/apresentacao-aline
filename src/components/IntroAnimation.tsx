import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(true);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // Sequência de animação
    const timer1 = setTimeout(() => {
      setShowLogo(false);
      setShowParticles(true);
    }, 2500); // Logo fica visível por 2.5 segundos

    const timer2 = setTimeout(() => {
      onComplete(); // Finaliza a animação
    }, 4000); // Total de 4 segundos

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  // Componente de partículas com efeito de explosão
  const Particle = ({ delay, x, y, size, color }: { 
    delay: number; 
    x: number; 
    y: number; 
    size: number;
    color: string;
  }) => (
    <motion.div
      className="absolute rounded-full shadow-lg"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ 
        x: 0, 
        y: 0, 
        opacity: 1, 
        scale: 1,
        rotate: 0
      }}
      animate={{ 
        x: x, 
        y: y, 
        opacity: 0, 
        scale: 0,
        rotate: 360
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
                scale: [1, 1.1, 1]
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
            transition={{ duration: 0.2 }}
          >
            {/* Partículas principais - explosão em todas as direções */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * 2 * Math.PI;
              const distance = 200 + Math.random() * 300;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              const delay = Math.random() * 0.2;
              const size = 3 + Math.random() * 4; // 3-7px
              const colors = ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <Particle 
                  key={`main-${i}`} 
                  delay={delay} 
                  x={x} 
                  y={y} 
                  size={size}
                  color={color}
                />
              );
            })}
            
            {/* Partículas secundárias - explosão em espiral */}
            {Array.from({ length: 40 }).map((_, i) => {
              const angle = (i / 40) * 2 * Math.PI;
              const distance = 100 + Math.random() * 200;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              const delay = 0.1 + Math.random() * 0.3;
              const size = 2 + Math.random() * 3; // 2-5px
              const colors = ['#ffffff', '#f8f8f8', '#f0f0f0'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <Particle 
                  key={`spiral-${i}`} 
                  delay={delay} 
                  x={x} 
                  y={y} 
                  size={size}
                  color={color}
                />
              );
            })}
            
            {/* Efeito de brilho central */}
            <motion.div
              className="absolute w-20 h-20 bg-white rounded-full opacity-80"
              initial={{ 
                scale: 0, 
                opacity: 0 
              }}
              animate={{ 
                scale: [0, 2, 0], 
                opacity: [0, 0.8, 0] 
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeOut"
              }}
            />
          </motion.div>
        )}


      </AnimatePresence>
    </div>
  );
};

export default IntroAnimation;
