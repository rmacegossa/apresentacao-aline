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
    }, 3000); // Logo fica visível por 3 segundos

    const timer2 = setTimeout(() => {
      onComplete(); // Finaliza a animação
    }, 6000); // Total de 6 segundos

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  // Componente de partículas com efeito de explosão dramático
  const Particle = ({ delay, x, y, size, color, rotation }: { 
    delay: number; 
    x: number; 
    y: number; 
    size: number;
    color: string;
    rotation: number;
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
        opacity: [1, 1, 0], 
        scale: [1, 1.2, 0],
        rotate: rotation
      }}
      transition={{ 
        duration: 3, 
        delay: delay,
        ease: "easeOut",
        times: [0, 0.7, 1]
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
            transition={{ duration: 1, ease: "easeOut" }}
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

        {/* Explosão de Partículas Dramática */}
        {showParticles && (
          <motion.div
            key="particles"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Partículas principais - explosão em todas as direções (mais distantes) */}
            {Array.from({ length: 80 }).map((_, i) => {
              const angle = (i / 80) * 2 * Math.PI;
              const distance = 400 + Math.random() * 600; // Aumentado para cobrir mais área
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              const delay = Math.random() * 0.5; // Delay mais variado
              const size = 4 + Math.random() * 6; // 4-10px (partículas maiores)
              const colors = ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              const rotation = Math.random() * 720 - 360; // Rotação mais dramática
              
              return (
                <Particle 
                  key={`main-${i}`} 
                  delay={delay} 
                  x={x} 
                  y={y} 
                  size={size}
                  color={color}
                  rotation={rotation}
                />
              );
            })}
            
            {/* Partículas secundárias - explosão em espiral (mais próximas) */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * 2 * Math.PI;
              const distance = 200 + Math.random() * 400;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              const delay = 0.2 + Math.random() * 0.6;
              const size = 3 + Math.random() * 5; // 3-8px
              const colors = ['#ffffff', '#f8f8f8', '#f0f0f0', '#e8e8e8'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              const rotation = Math.random() * 540 - 270;
              
              return (
                <Particle 
                  key={`spiral-${i}`} 
                  delay={delay} 
                  x={x} 
                  y={y} 
                  size={size}
                  color={color}
                  rotation={rotation}
                />
              );
            })}
            
            {/* Partículas de destaque - explosão mais lenta */}
            {Array.from({ length: 30 }).map((_, i) => {
              const angle = (i / 30) * 2 * Math.PI;
              const distance = 300 + Math.random() * 500;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              const delay = 0.5 + Math.random() * 1; // Delay maior para efeito escalonado
              const size = 6 + Math.random() * 8; // 6-14px (partículas grandes)
              const colors = ['#ffffff', '#f5f5f5'];
              const color = colors[Math.floor(Math.random() * colors.length)];
              const rotation = Math.random() * 1080 - 540;
              
              return (
                <Particle 
                  key={`highlight-${i}`} 
                  delay={delay} 
                  x={x} 
                  y={y} 
                  size={size}
                  color={color}
                  rotation={rotation}
                />
              );
            })}
            
            {/* Efeito de brilho central expandido */}
            <motion.div
              className="absolute w-32 h-32 bg-white rounded-full opacity-90"
              initial={{ 
                scale: 0, 
                opacity: 0 
              }}
              animate={{ 
                scale: [0, 3, 0], 
                opacity: [0, 0.9, 0] 
              }}
              transition={{ 
                duration: 2.5,
                ease: "easeOut"
              }}
            />
            
            {/* Ondas de choque concêntricas */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="absolute border-2 border-white rounded-full opacity-0"
                style={{
                  width: `${(i + 1) * 100}px`,
                  height: `${(i + 1) * 100}px`
                }}
                initial={{ 
                  scale: 0, 
                  opacity: 0 
                }}
                animate={{ 
                  scale: 1, 
                  opacity: [0, 0.3, 0] 
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default IntroAnimation;
