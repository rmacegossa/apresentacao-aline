import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Building2, FileText, AlertTriangle, CheckCircle, BarChart3, FileDown, Maximize2, Minimize2, Heart, Users, Award } from 'lucide-react';
import { cn } from './lib/utils';
import { 
  exportToPowerPoint, 
  exportToPDF, 
  exportToHTML
} from './lib/exportUtils';
import IntroAnimation from './components/IntroAnimation';
import WelcomeScreen from './components/WelcomeScreen';

// Componente de navegação por pontos
const NavigationDots = ({ currentSlide, totalSlides, onSlideChange }: {
  currentSlide: number
  totalSlides: number
  onSlideChange: (slide: number) => void
}) => {
  const icons = [Home, Building2, FileText, AlertTriangle, CheckCircle, BarChart3, Heart, Users, Award, FileDown]
  
  return (
    <div className="navigation-dots">
      {Array.from({ length: totalSlides }).map((_, index) => {
        const Icon = icons[index]
        return (
          <motion.div
            key={index}
            className={cn(
              "nav-dot flex items-center justify-center",
              currentSlide === index && "active"
            )}
            onClick={() => onSlideChange(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {currentSlide === index && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-2 h-2 text-white" />
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

// Componente de slide com transições elegantes
const Slide = ({ children, slideIndex }: { children: React.ReactNode, slideIndex: number }) => {
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45
    })
  }

  const slideTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    duration: 0.8
  }

  return (
    <motion.div
      custom={slideIndex}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransition}
      className="slide-container"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showIntro, setShowIntro] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [musicVolume, setMusicVolume] = useState(0.3)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [presentationStartTime, setPresentationStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const totalSlides = 10

  // Timer da apresentação
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (presentationStartTime && !showWelcome && !showIntro) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - presentationStartTime.getTime()) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [presentationStartTime, showWelcome, showIntro])

  // Navegação por teclado
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))
      } else if (event.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(prev - 1, 0))
      } else if (event.key === 'Home') {
        setCurrentSlide(0)
      } else if (event.key === 'End') {
        setCurrentSlide(totalSlides - 1)
      } else if (event.key === 'F11' || event.key === 'f') {
        toggleFullScreen()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [totalSlides])

  // Controle de áudio
  useEffect(() => {
    const audio = document.getElementById('background-music') as HTMLAudioElement
    if (audio) {
      audio.volume = musicVolume
    }
  }, [musicVolume])

  // Função para formatar o tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calcular progresso da apresentação
  const presentationProgress = ((currentSlide + 1) / totalSlides) * 100

  // Inicializar áudio quando o componente montar
  useEffect(() => {
    const audio = document.getElementById('background-music') as HTMLAudioElement
    if (audio) {
      audio.volume = musicVolume
      console.log('Áudio inicializado com volume:', musicVolume)
    }
  }, [])
  
  // Função para finalizar animação de entrada
  const handleIntroComplete = () => {
    setShowIntro(false)
  }
  
  // Função para alternar full-screen
  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullScreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullScreen(false)
      }
    } catch (error) {
      console.error('Erro ao alternar full-screen:', error)
    }
  }

  // Funções de controle de música
  const toggleMusic = () => {
    if (!audioEnabled) return // Não permite tocar se áudio estiver desabilitado
    
    console.log('Toggle música chamado, estado atual:', isMusicPlaying)
    const newState = !isMusicPlaying
    setIsMusicPlaying(newState)
    
    // Controle direto do áudio para garantir
    const audio = document.getElementById('background-music') as HTMLAudioElement
    if (audio) {
      if (newState) {
        audio.play().catch(err => console.error('Erro ao tocar música:', err))
      } else {
        audio.pause()
      }
    }
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value)
    setMusicVolume(volume)
  }

  // Função para iniciar a apresentação
  const handleStartPresentation = async (withAudio: boolean) => {
    setAudioEnabled(withAudio)
    setPresentationStartTime(new Date()) // Inicia o timer
    
    // Entrar em modo tela cheia
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
        setIsFullScreen(true)
      }
    } catch (error) {
      console.log('Erro ao entrar em tela cheia:', error)
    }
    
    // Mostrar animação de intro
    setShowWelcome(false)
    setShowIntro(true)
    
    // Iniciar música se habilitado
    if (withAudio) {
      setIsMusicPlaying(true)
      const audio = document.getElementById('background-music') as HTMLAudioElement
      if (audio) {
        audio.play().catch(err => console.error('Erro ao tocar música:', err))
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Elemento de áudio */}
      <audio
        id="background-music"
        src="/survivor.mp3"
        loop
        preload="auto"
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
        onEnded={() => setIsMusicPlaying(false)}
      />
      
      {/* Tela de boas-vindas */}
      {showWelcome && (
        <WelcomeScreen onStartPresentation={handleStartPresentation} />
      )}
      
      {/* Animação de entrada */}
      {showIntro && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}
      
      {/* Menu inferior desktop */}
      {!showWelcome && !showIntro && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="desktop-bottom-menu"
        >
          {/* Indicador de slide e progresso */}
          <div className="slide-progress-section">
            <div className="slide-indicator">
              <span className="current-slide">{currentSlide + 1}</span>
              <span className="total-slides">/ {totalSlides}</span>
            </div>
            
            {/* Barra de progresso */}
            <div className="progress-bar-container">
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${presentationProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <span className="progress-text">{Math.round(presentationProgress)}%</span>
            </div>
          </div>

          {/* Controles de navegação */}
          <div className="navigation-controls">
            <motion.button
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className={`nav-btn ${currentSlide === 0 ? 'disabled' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))}
              disabled={currentSlide === totalSlides - 1}
              className={`nav-btn ${currentSlide === totalSlides - 1 ? 'disabled' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Próximo slide"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Controles de música */}
          <div className="music-controls">
            <button
              onClick={toggleMusic}
              disabled={!audioEnabled}
              className={`music-btn ${!audioEnabled ? 'disabled' : ''}`}
              title={audioEnabled ? (isMusicPlaying ? "Pausar música" : "Tocar música") : "Áudio desabilitado"}
            >
              {isMusicPlaying ? (
                <span className="music-icon">⏸</span>
              ) : (
                <span className="music-icon">▶</span>
              )}
            </button>
            
            {/* Controle de Volume */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={handleVolumeChange}
              disabled={!audioEnabled}
              className={`volume-slider ${!audioEnabled ? 'disabled' : ''}`}
              title={audioEnabled ? "Volume da música" : "Volume desabilitado"}
            />
          </div>

          {/* Cronômetro */}
          <div className="timer-section">
            <div className="timer-icon">⏱️</div>
            <span className="timer-text">{formatTime(elapsedTime)}</span>
          </div>

          {/* Botão fullscreen */}
          <motion.button
            onClick={toggleFullScreen}
            className="fullscreen-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Modo tela cheia"
          >
            {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </motion.button>
        </motion.div>
      )}

      {/* Navegação por pontos */}
      {!showWelcome && !showIntro && (
        <NavigationDots
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onSlideChange={setCurrentSlide}
        />
      )}

      {/* Barra inferior mobile */}
      {!showWelcome && !showIntro && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mobile-bottom-bar"
        >
          {/* Indicador de slide */}
          <div className="slide-indicator">
            <span className="current-slide">{currentSlide + 1}</span>
            <span className="total-slides">/ {totalSlides}</span>
          </div>

          {/* Controles de navegação */}
          <div className="navigation-controls">
            <motion.button
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className={`nav-btn ${currentSlide === 0 ? 'disabled' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))}
              disabled={currentSlide === totalSlides - 1}
              className={`nav-btn ${currentSlide === totalSlides - 1 ? 'disabled' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
      </div>

          {/* Controles de música */}
          <div className="music-controls">
            <button
              onClick={toggleMusic}
              disabled={!audioEnabled}
              className={`music-btn ${!audioEnabled ? 'disabled' : ''}`}
              title={audioEnabled ? (isMusicPlaying ? "Pausar música" : "Tocar música") : "Áudio desabilitado"}
            >
              {isMusicPlaying ? (
                <span className="music-icon">⏸</span>
              ) : (
                <span className="music-icon">▶</span>
              )}
        </button>
          </div>

          {/* Botão fullscreen */}
          <motion.button
            onClick={toggleFullScreen}
            className="fullscreen-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Modo tela cheia"
          >
            {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </motion.button>
        </motion.div>
      )}

      {/* Slides */}
      {!showWelcome && !showIntro && (
        <AnimatePresence initial={false}>
        {/* Slide 1: Capa */}
        {currentSlide === 0 && (
          <Slide key="slide-0" slideIndex={0}>
            <div className="slide-content">
              <div className="flex items-center justify-between gap-16">
                <div className="flex-1 text-left">
                  <motion.h1 
                    className="slide-title text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Legalização e Infraestrutura
                  </motion.h1>
                  <motion.p 
                    className="slide-subtitle"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Setor de Infraestrutura e Legalização
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex-shrink-0"
                >
                  <img 
                    src="/logo.png" 
                    alt="Logo da Empresa" 
                    className="w-64 h-64 object-contain transform rotate-90"
                  />
                </motion.div>
              </div>
            </div>
          </Slide>
        )}

        {/* Slide 2: Serviços de Responsabilidade do Setor */}
        {currentSlide === 1 && (
          <Slide key="slide-1" slideIndex={1}>
            <div className="slide-content">
              <motion.h1 
                className="slide-title text-white text-4xl md:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Serviços de Responsabilidade do Setor
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Coluna 1 */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="card p-6">
                      <ul className="space-y-3">
                        {[
                          { name: "Abertura", icon: "🚪" },
                          { name: "Alteração", icon: "✏️" },
                          { name: "Encerramento", icon: "🔒" },
                          { name: "Solicitação de Inscrição Municipal", icon: "🏛️" },
                          { name: "Alvará de Funcionamento", icon: "📋" },
                          { name: "Protocolo e Acompanhamento de Análise de LTA", icon: "🏗️" },
                          { name: "Cadastro, Acompanhamento e Renovação de COREN, CRM, CRF", icon: "👨‍⚕️" }
                        ].map((service, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-2xl flex-shrink-0 mt-1 mr-8">{service.icon}</span>
                            <span className="text-white text-sm leading-relaxed text-left flex-1">{service.name}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Coluna 2 */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  >
                    <div className="card p-6">
                      <ul className="space-y-3">
                        {[
                          { name: "Solicitação e Acompanhamento de Inscrição Secundária CRM", icon: "📝" },
                          { name: "Alvará do Corpo de Bombeiros", icon: "🚒" },
                          { name: "Elaboração de Documentação para Alvará Sanitário", icon: "📄" },
                          { name: "Solicitação e Controle de Certificados Digitais", icon: "🔐" },
                          { name: "Verificação de Débitos em Cartório", icon: "⚖️" },
                          { name: "Vivência em Órgãos Públicos", icon: "🏢" },
                          { name: "Acompanhamento e Instrução para Atendimento a Fiscais", icon: "👮‍♂️" }
                        ].map((service, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                            whileHover={{ y: -5 }}
                          >
                            <span className="text-2xl flex-shrink-0 mt-1 mr-8">{service.icon}</span>
                            <span className="text-white text-sm leading-relaxed text-left flex-1">{service.name}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Coluna 3 */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <div className="card p-6">
                      <ul className="space-y-3">
                        {[
                          { name: "Solicitação e Acompanhamento de Inscrição Secundária COREN", icon: "📋" },
                          { name: "Solicitação e Acompanhamento de Inscrição Secundária CRF", icon: "💊" },
                          { name: "Solicitação e Acompanhamento de Inscrição Secundária CRM", icon: "👨‍⚕️" },
                          { name: "Solicitação e Acompanhamento de Inscrição Secundária COREN", icon: "📋" },
                          { name: "Solicitação e Acompanhamento de Inscrição Secundária CRF", icon: "💊" },
                          { name: "Solicitação e Acompanhamento de Inscrição Secundária CRM", icon: "👨‍⚕️" },
                          { name: "Solicitação e Acompanhamento de Inscrição Secundária COREN", icon: "📋" }
                        ].map((service, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start p-3 rounded-lg hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                            whileHover={{ x: -5 }}
                          >
                            <span className="text-2xl flex-shrink-0 mt-1 mr-8">{service.icon}</span>
                            <span className="text-white text-sm leading-relaxed text-left flex-1">{service.name}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </Slide>
        )}

        {/* Slide 3: Alvará Sanitário */}
        {currentSlide === 2 && (
          <Slide key="slide-2" slideIndex={2}>
            <div className="slide-content">
              <motion.h1 
                className="slide-title text-white text-4xl md:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Alvará Sanitário
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12"
              >
                <div className="table-container">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Clínicas</th>
                        <th>TIPO I OU II</th>
                        <th>Aprovação LTA</th>
                        <th>Alvará Sanitário</th>
                        <th>Validade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { clinica: "SP Indianópolis", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "03/05/2026" },
                        { clinica: "RJ Barra da Tijuca", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "30/04/2026" },
                        { clinica: "SP Alphaville 26ª", tipo: "Tipo I", lta: "Não precisa", alvara: "Sim", validade: "12/12/2025" },
                        { clinica: "MG BH", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "17/07/2025" },
                        { clinica: "BA Salvador", tipo: "Tipo I", lta: "Sim", alvara: "Sim", validade: "31/12/2025" },
                        { clinica: "SC Balneário", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "31/12/2025" },
                        { clinica: "DF Brasília I*", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "01/2026" },
                        { clinica: "PE Recife", tipo: "Tipo II", lta: "Protocolo", alvara: "Sim", validade: "23/10/2026" },
                        { clinica: "ES Vitoria", tipo: "Tipo II", lta: "Não precisa", alvara: "Sim", validade: "28/02/2029" },
                        { clinica: "GO Jardim America", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "31/12/2025" },
                        { clinica: "SP Tatuapé", tipo: "Tipo II", lta: "Não precisa", alvara: "Sim", validade: "28/11/2027" },
                        { clinica: "DF Brasília II", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "18/01/2026" },
                        { clinica: "RJ Copacabana", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "30/4/2026" },
                        { clinica: "MG Uberlandia", tipo: "Tipo II", lta: "Protocolo", alvara: "Sim", validade: "4/7/2028" },
                        { clinica: "SP Jardins", tipo: "Tipo I", lta: "Não precisa", alvara: "Sim", validade: "11/10/2026" },
                        { clinica: "DF Brasília III", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "30/04/2025" }
                      ].map((row, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                          className="hover:bg-white/5"
                        >
                          <td className="p-3 text-center">{row.clinica}</td>
                          <td className="p-3 text-center">{row.tipo}</td>
                          <td className="p-3 text-center">
                            <span className={`status-badge ${row.lta === 'Sim' ? 'approved' : row.lta === 'Protocolo' ? 'pending' : 'not-needed'}`}>
                              {row.lta}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="status-badge approved">{row.alvara}</span>
                          </td>
                          <td className="p-3 text-center text-sm">{row.validade}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </Slide>
        )}

        {/* Slide 4: Maiores Dificuldades */}
        {currentSlide === 3 && (
          <Slide key="slide-3" slideIndex={3}>
            <div className="slide-content">
              <motion.h1 
                className="slide-title text-white text-4xl md:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Maiores Dificuldades
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Inadequação da infraestrutura física à RDC 50",
                      icon: "🏗️"
                    },
                    {
                      title: "Alto volume de denúncias e fiscalizações",
                      icon: "📋"
                    },
                    {
                      title: "Escassez de profissionais com RQE para atuar como RT",
                      icon: "👨‍⚕️"
                    },
                    {
                      title: "Vácuo legislativo para transplante capilar",
                      icon: "⚖️"
                    },
                    {
                      title: "Inconsistência técnica nas fiscalizações",
                      icon: "🔍"
                    },
                    {
                      title: "Pressões e interferências externas na operação",
                      icon: "⚠️"
                    }
                  ].map((difficulty, index) => (
                    <motion.div
                      key={index}
                      className="card p-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className="text-4xl mb-4 text-center">{difficulty.icon}</div>
                      <h3 className="text-lg font-semibold text-white text-center leading-tight">{difficulty.title}</h3>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </Slide>
        )}

        {/* Slide 5: Unidades em Processo de Liberação */}
        {currentSlide === 4 && (
          <Slide key="slide-4" slideIndex={4}>
            <div className="slide-content">
              <motion.h1 
                className="slide-title text-white text-4xl md:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Unidades em Processo de Liberação
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12"
              >
                <div className="table-container">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Clínicas</th>
                        <th>TIPO I OU II</th>
                        <th>Aprovação LTA</th>
                        <th>Alvará Sanitário</th>
                        <th>Validade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { clinica: "Cuiabá", tipo: "Tipo II", lta: "Protocolo", alvara: "Protocolo", validade: "Protocolo inicial em 05/2023 - refeito em 07/2024" },
                        { clinica: "Manaus", tipo: "Tipo II", lta: "Sim", alvara: "Protocolo", validade: "Protocolo desde 04/2024" },
                        { clinica: "Porto Velho", tipo: "Tipo II", lta: "Não precisa", alvara: "Protocolo", validade: "Protocolo desde 11.2023" },
                        { clinica: "Porto Alegre", tipo: "Tipo II", lta: "Protocolo", alvara: "Protocolo", validade: "Protocolo desde 11.2023" },
                        { clinica: "Florianópolis", tipo: "Tipo II", lta: "Protocolo", alvara: "Protocolo", validade: "Protocolo desde 11.2023" },
                        { clinica: "Ribeirão Preto", tipo: "Tipo II", lta: "Sim", alvara: "Protocolo", validade: "Protocolo desde 11/2024" },
                        { clinica: "Campinas II", tipo: "Tipo II", lta: "Não precisa", alvara: "Protocolo", validade: "Renovação cancelada" },
                        { clinica: "Mogi das Cruzes*", tipo: "Tipo II", lta: "Não precisa", alvara: "Protocolo", validade: "Protocolo desde 04/2024" },
                        { clinica: "Aracaju*", tipo: "Tipo II", lta: "Não precisa", alvara: "Protocolo", validade: "Protocolo inicial em 01/2024 - Renovado em 06/2025" },
                        { clinica: "Montes Claros", tipo: "Tipo II", lta: "Não precisa", alvara: "Protocolo", validade: "Protocolo desde 04/2024" }
                      ].map((row, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                          className="hover:bg-white/5"
                        >
                          <td className="p-3 text-center">{row.clinica}</td>
                          <td className="p-3 text-center">{row.tipo}</td>
                          <td className="p-3 text-center">
                            <span className={`status-badge ${row.lta === 'Sim' ? 'approved' : row.lta === 'Protocolo' ? 'pending' : 'not-needed'}`}>
                              {row.lta}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="status-badge pending">{row.alvara}</span>
                          </td>
                          <td className="p-3 text-center text-sm">{row.validade}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </Slide>
        )}

        {/* Slide 6: Overview de Problemas */}
        {currentSlide === 5 && (
          <Slide key="slide-5" slideIndex={5}>
            <div className="slide-content">
              <motion.h1 
                className="slide-title text-white text-4xl md:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Overview de Problemas
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[
                    {
                      clinica: "Cuiabá",
                      icon: "🏗️",
                      status: "Fase final de liberação Tipo I",
                      description: "A unidade passou por processo rigoroso de regularização junto à Vigilância Sanitária, motivado por denúncia que resultou em interdição temporária. Durante a fiscalização, foram exigidas diversas adequações, incluindo obras estruturais significativas. Todas as exigências foram devidamente atendidas, demonstrando o comprometimento da equipe com a conformidade e qualidade do serviço. Atualmente, a clínica encontra-se em fase final de liberação para operação como Tipo I, sendo que a classificação Tipo II ainda requer algumas intervenções adicionais."
                    },
                    {
                      clinica: "Manaus",
                      icon: "🔧",
                      status: "Projeto aprovado, obras em andamento",
                      description: "Em Manaus, a unidade enfrentou desafios estruturais que demandaram múltiplas obras e ajustes para atender às normas da Vigilância Sanitária. Após um período de trabalho intenso, o projeto foi recentemente aprovado, embora algumas intervenções ainda estejam em andamento. O processo evidencia o empenho da equipe em garantir a total adequação da unidade, seguindo todas as exigências legais e estruturais para operação segura e eficiente."
                    },
                    {
                      clinica: "Porto Alegre",
                      icon: "✅",
                      status: "Validada pela Vigilância Sanitária",
                      description: "A clínica de Porto Alegre já foi validada pela Vigilância Sanitária, o que confirma a conformidade da unidade com os requisitos essenciais de operação. No momento, aguarda-se apenas a conclusão da análise do projeto para que possa obter a liberação final, permitindo a continuidade das atividades dentro dos padrões exigidos."
                    },
                    {
                      clinica: "Florianópolis",
                      icon: "📋",
                      status: "Projeto aprovado, obra pendente",
                      description: "Em Florianópolis, a unidade passou por um longo processo de aprovação do projeto, que envolveu diversas idas e vindas e ajustes estruturais. Apesar de o projeto ter sido aprovado, ainda é necessária a realização de uma obra de adequação para que a clínica esteja totalmente pronta para liberação. Esse processo demonstra o cuidado da equipe em garantir que a unidade atenda integralmente às normas de segurança e qualidade."
                    },
                    {
                      clinica: "Ribeirão Preto",
                      icon: "🎯",
                      status: "Fase final, pendência RT",
                      description: "A unidade de Ribeirão Preto está em fase final de liberação. A clínica foi vistoriada e recebeu elogios da Vigilância Sanitária, com o projeto totalmente aprovado. No entanto, a liberação formal ainda depende da regularização de uma pendência do Responsável Técnico junto ao CRM. A expectativa é que, assim que essa questão seja solucionada, a clínica esteja plenamente operacional."
                    }
                  ].map((clinica, index) => (
                    <motion.div
                      key={index}
                      className="card p-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl flex-shrink-0">{clinica.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-white">{clinica.clinica}</h3>
                            <span className="status-tag">
                              {clinica.status}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{clinica.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </Slide>
        )}

        {/* Slide 7: A Jornada - O Início */}
        {currentSlide === 6 && (
        <Slide key="slide-6" slideIndex={6}>
          <div className="slide-content">
            <motion.h2 
              className="slide-title story-title"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              A Jornada dos Construtores da Confiança
            </motion.h2>
            
            <div className="story-section">
              {/* Ícone ilustrativo */}
              <motion.div
                className="story-icon-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="story-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </motion.div>
              
              {/* Primeiro parágrafo */}
              <motion.div
                className="story-paragraph"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              >
                <p>
                  Por trás de cada <span className="highlight-word">porta de vidro</span> que agora se abre para um novo paciente... 
                  por trás de cada <span className="highlight-word">sorriso</span> que se reflete no espelho após um transplante capilar... 
                  existe uma <span className="highlight-word">base</span>. Uma fundação que nós, juntos, tivemos a honra de construir.
                </p>
              </motion.div>
              
              {/* Segundo parágrafo */}
              <motion.div
                className="story-paragraph"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              >
                <p>
                  Quando a <span className="highlight-word">Stanley's Hair</span> nos confiou a missão de expandir a sua visão, 
                  o nosso desafio era claro. Não era apenas abrir novas clínicas, mas garantir que o 
                  <span className="highlight-word">sonho</span> de um farol de excelência e um santuário para a confiança perdida 
                  se sustentasse em uma base inabalável de <span className="highlight-word">legalidade</span> e conformidade.
                </p>
              </motion.div>
            </div>
          </div>
        </Slide>
        )}

        {/* Slide 8: A Jornada - A Luta */}
        {currentSlide === 7 && (
        <Slide key="slide-7" slideIndex={7}>
          <div className="slide-content">
            <motion.h2 
              className="slide-title story-title"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              A Luta pela Excelência
            </motion.h2>
            
            <div className="story-section">
              {/* Ícone ilustrativo */}
              <motion.div
                className="story-icon-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="story-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>
              </motion.div>
              
              {/* Primeiro parágrafo */}
              <motion.div
                className="story-paragraph"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              >
                <p>
                  Nós nos tornamos os <span className="highlight-word">arquitetos</span> deste sonho. A cada regulamentação analisada, 
                  a cada documento corrigido, cada <span className="highlight-word">"sim"</span> conquistado... era uma batalha vencida. 
                  Onde muitos viam um "protocolo" a ser seguido, nós víamos o mapa para a nossa excelência.
                </p>
              </motion.div>
              
              {/* Segundo parágrafo */}
              <motion.div
                className="story-paragraph"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              >
                <p>
                  Houve <span className="highlight-word">noites longas</span>. Momentos de incerteza. Aquele suspiro de frustração 
                  com um prazo que parecia impossível de cumprir. Foi a nossa equipe <span className="highlight-word">Jurídica</span>, 
                  com sua caneta afiada, traçando caminhos onde não havia.
                </p>
              </motion.div>
              
              {/* Terceiro parágrafo */}
              <motion.div
                className="story-paragraph"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
              >
                <p>
                  Cada pessoa nesta equipe, de forma única, se tornou um <span className="highlight-word">herói</span> nessa epopeia. 
                  E a maior lição que aprendemos é que a nossa força não estava em títulos ou em tabelas. 
                  Estava na <span className="highlight-word">coragem</span> de continuar quando o caminho era escuro.
                </p>
              </motion.div>
            </div>
          </div>
        </Slide>
        )}

        {/* Slide 9: A Jornada - O Agradecimento */}
        {currentSlide === 8 && (
        <Slide key="slide-8" slideIndex={8}>
          <div className="slide-content">
            <motion.h2 
              className="slide-title story-title"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              O Agradecimento
            </motion.h2>
            
            <div className="story-section">
              {/* Ícone ilustrativo */}
              <motion.div
                className="story-icon-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="story-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 9V5a3 3 0 0 0-6 0v4M7 9h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/>
                  </svg>
                </div>
              </motion.div>
              
              {/* Primeiro parágrafo */}
              <motion.div
                className="story-paragraph"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              >
                <p>
                  E então... veio o <span className="highlight-word">momento</span>. Aquela notificação. Aquela assinatura final. 
                  O brilho da placa que dizia: <span className="highlight-word">"Clínica Aprovada."</span> Não foi apenas a liberação 
                  de um espaço. Foi a prova de que, juntos, somos capazes de transformar um plano em realidade.
                </p>
              </motion.div>
              
              {/* Segundo parágrafo */}
              <motion.div
                className="story-paragraph"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              >
                <p>
                  <span className="highlight-word">Obrigado</span>. Obrigado por cada e-mail respondido na madrugada, 
                  por cada planilha preenchida com perfeição, por cada visita fiscalizada que nos deixou mais fortes.
                </p>
              </motion.div>
              
              {/* Terceiro parágrafo */}
              <motion.div
                className="story-paragraph"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
              >
                <p>
                  Vocês não legalizaram clínicas. Vocês ergueram um <span className="highlight-word">legado</span>. 
                  Construíram a fundação de um sonho que agora pode ser vivido por milhares. 
                  E por isso, por cada pedaço de orgulho que sinto ao ver nossas portas abertas, 
                  o meu mais profundo e sincero agradecimento a cada um de vocês.
                </p>
              </motion.div>
              
              {/* Mensagem final */}
              <motion.div
                className="final-message"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4, duration: 1.0, ease: "easeOut" }}
              >
                <h3>
                  Vocês são a razão do nosso sucesso. A razão da nossa história.
                </h3>
              </motion.div>
            </div>
          </div>
        </Slide>
        )}

        {/* Slide 10: Exportação (ÚLTIMO SLIDE) */}
        {currentSlide === 9 && (
        <Slide key="slide-9" slideIndex={9}>
          <div className="slide-content">
            <h2 className="slide-title">Exportar Apresentação</h2>
            <div className="export-options">
              <motion.button
                onClick={exportToPowerPoint}
                className="export-btn powerpoint"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="export-icon">📊</span>
                <span className="export-text">PowerPoint (.pptx)</span>
              </motion.button>
              
              <motion.button
                onClick={exportToPDF}
                className="export-btn pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="export-icon">📄</span>
                <span className="export-text">PDF</span>
              </motion.button>
              
              <motion.button
                onClick={exportToHTML}
                className="export-btn html"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="export-icon">🌐</span>
                <span className="export-text">HTML</span>
              </motion.button>
            </div>
          </div>
        </Slide>
        )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default App
