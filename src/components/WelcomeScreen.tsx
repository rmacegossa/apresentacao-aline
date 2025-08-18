import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onStartPresentation: (withAudio: boolean) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartPresentation }) => {
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <div className="welcome-screen">
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        className="welcome-background"
      >
        <img 
          src="/background.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="welcome-content"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="welcome-logo"
        >
          <img 
            src="/logo.png" 
            alt="Logo da Empresa" 
            className="w-80 h-80 object-contain"
          />
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="welcome-title"
        >
          Legalização e Infraestrutura
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          className="welcome-subtitle"
        >
          Setor de Infraestrutura e Legalização
        </motion.p>

        {/* Opção de Áudio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="audio-option"
        >
          <label className="audio-toggle">
            <input
              type="checkbox"
              checked={audioEnabled}
              onChange={(e) => setAudioEnabled(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">
              {audioEnabled ? '🎵 Áudio Ativado' : '🔇 Áudio Desativado'}
            </span>
          </label>
        </motion.div>

        {/* Botão Iniciar */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStartPresentation(audioEnabled)}
          className="start-button"
        >
          🚀 Iniciar Apresentação
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
