import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Building2, FileText, AlertTriangle, CheckCircle, BarChart3, FileDown, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from './lib/utils';
import { 
  exportToPowerPoint, 
  exportToPDF, 
  exportToHTML, 
  exportToText
} from './lib/exportUtils';
import IntroAnimation from './components/IntroAnimation';
import WelcomeScreen from './components/WelcomeScreen';

// Componente de navegação por pontos
const NavigationDots = ({ currentSlide, totalSlides, onSlideChange }: {
  currentSlide: number
  totalSlides: number
  onSlideChange: (slide: number) => void
}) => {
  const icons = [Home, Building2, FileText, AlertTriangle, CheckCircle, BarChart3, FileDown]
  
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
const Slide = ({ children, isActive, slideIndex }: { children: React.ReactNode, isActive: boolean, slideIndex: number }) => {
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
    type: "spring",
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
  const totalSlides = 7

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

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0))
  
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

  // Função para lidar com exportações
  const handleExport = async (type: string) => {
    try {
      switch (type) {
        case 'exportPPTX':
          await exportToPowerPoint()
          break
        case 'exportPDF':
          await exportToPDF()
          break
        case 'exportHTML':
          exportToHTML()
          break
        case 'exportText':
          exportToText()
          break
        default:
          break
      }
    } catch (error) {
      console.error('Erro na exportação:', error)
      alert('Erro ao exportar. Tente novamente.')
    }
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
        <AnimatePresence mode="wait" initial={false}>
        {currentSlide === 0 && (
          <Slide key="slide-0" isActive={currentSlide === 0} slideIndex={0}>
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

        {currentSlide === 1 && (
          <Slide key="slide-1" isActive={currentSlide === 1} slideIndex={1}>
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
                          { name: "Solicitação e Controle de LTCA, PGRSS, PGR, PCMSO", icon: "📊" },
                          { name: "Licença Ambiental", icon: "🌱" },
                          { name: "Processos Administrativos em Geral", icon: "📋" },
                          { name: "Acompanhamento de Vencimentos de Licenças", icon: "⏰" },
                          { name: "CETESB", icon: "🌿" },
                          { name: "CNES", icon: "🏥" },
                          { name: "Acompanhamento na Gestão de Contratos", icon: "📋" }
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

        {currentSlide === 2 && (
          <Slide key="slide-2" isActive={currentSlide === 2} slideIndex={2}>
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
                <div className="card p-6">
                  <h3 className="text-2xl font-semibold text-white mb-6 text-center">Status das Clínicas</h3>
                  <div className="table-container">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left p-3 text-white font-semibold">Clínicas</th>
                          <th className="text-left p-3 text-white font-semibold">TIPO</th>
                          <th className="text-left p-3 text-white font-semibold">Aprovação LTA</th>
                          <th className="text-left p-3 text-white font-semibold">Alvará Sanitário</th>
                          <th className="text-left p-3 text-white font-semibold">Validade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { clinica: "SP Indianópolis", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "03/05/2026" },
                          { clinica: "RJ Barra da Tijuca", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "30/04/2026" },
                          { clinica: "SP Alphaville 26ª", tipo: "Tipo I", lta: "Não precisa", alvara: "Sim", validade: "12/12/2025" },
                          { clinica: "MG BH", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "17/07/2025 (Aguardando visita para renovação)" },
                          { clinica: "BA Salvador", tipo: "Tipo I", lta: "Sim", alvara: "Sim", validade: "31/12/2025" },
                          { clinica: "SC Balneário", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "31/12/2025" },
                          { clinica: "DF Brasília I*", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "Aguardando clínica iniciar operações - 01/2026" },
                          { clinica: "PE Recife", tipo: "Tipo II", lta: "Protocolo", alvara: "Sim", validade: "23/10/2026 (somente para Tipo I)" },
                          { clinica: "ES Vitoria", tipo: "Tipo II", lta: "Não precisa", alvara: "Sim", validade: "28/02/2029" },
                          { clinica: "GO Jardim America", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "31/12/2025" },
                          { clinica: "SP Tatuapé", tipo: "Tipo II", lta: "Não precisa", alvara: "Sim", validade: "28/11/2027" },
                          { clinica: "DF Brasília II", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "18/01/2026" },
                          { clinica: "RJ Copacabana", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "30/4/2026" },
                          { clinica: "MG Uberlandia", tipo: "Tipo II", lta: "Protocolo", alvara: "Sim", validade: "4/7/2028" },
                          { clinica: "SP Jardins", tipo: "Tipo I", lta: "Não precisa", alvara: "Sim", validade: "11/10/2026" },
                          { clinica: "DF Brasília III", tipo: "Tipo II", lta: "Sim", alvara: "Sim", validade: "30/04/2025 - Aguardando visita" }
                        ].map((row, index) => (
                          <motion.tr
                            key={index}
                            className="border-b border-white/10 hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                          >
                            <td className="p-3 text-white font-medium">{row.clinica}</td>
                            <td className="p-3 text-gray-300">{row.tipo}</td>
                            <td className="p-3 text-gray-300">
                              {row.lta === 'Sim' ? (
                                <span className="status-badge status-approved">Sim</span>
                              ) : row.lta === 'Não precisa' ? (
                                <span className="status-badge status-not-needed">Não precisa</span>
                              ) : (
                                <span className="status-badge status-protocol">Protocolo</span>
                              )}
                            </td>
                            <td className="p-3 text-gray-300">
                              {row.alvara === 'Sim' ? (
                                <span className="status-badge status-approved">Sim</span>
                              ) : (
                                <span className="status-badge status-protocol">Protocolo</span>
                              )}
                            </td>
                            <td className="p-3 text-gray-300 text-xs">{row.validade}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>
          </Slide>
        )}

        {currentSlide === 3 && (
          <Slide key="slide-3" isActive={currentSlide === 3} slideIndex={3}>
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

        {currentSlide === 4 && (
          <Slide key="slide-4" isActive={currentSlide === 4} slideIndex={4}>
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
                <div className="card p-6">
                  <h3 className="text-2xl font-semibold text-white mb-6 text-center">Status das Unidades em Processo</h3>
                  <div className="table-container">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left p-3 text-white font-semibold">Clínicas</th>
                          <th className="text-left p-3 text-white font-semibold">TIPO</th>
                          <th className="text-left p-3 text-white font-semibold">Aprovação LTA</th>
                          <th className="text-left p-3 text-white font-semibold">Alvará Sanitário</th>
                          <th className="text-left p-3 text-white font-semibold">Validade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { clinica: "Cuiabá", tipo: "Tipo II", lta: "Protocolo", alvara: "Protocolo", validade: "Protocolo inicial em 05/2023 - refeito em 07/2024" },
                          { clinica: "Manaus", tipo: "Tipo II", lta: "Sim", alvara: "Protocolo", validade: "Protocolo desde 04/2024" },
                          { clinica: "Porto Velho", tipo: "Tipo II", lta: "Não precisa", alvara: "Protocolo", validade: "" },
                          { clinica: "Porto Alegre", tipo: "Tipo II", lta: "Protocolo", alvara: "Protocolo", validade: "Protocolo desde 11.2023. Clínica aprovada pela fiscalização sanitária aguardando liberação do projeto." },
                          { clinica: "Florianopolis", tipo: "Tipo II", lta: "Protocolo", alvara: "Protocolo", validade: "" },
                          { clinica: "Ribeirão Preto", tipo: "Tipo II", lta: "Sim", alvara: "Protocolo", validade: "Protocolo desde 11/2024" },
                          { clinica: "Campinas II", tipo: "Tipo II", lta: "Não precisa", alvara: "Protocolo", validade: "Renovação cancelada" },
                          { clinica: "Mogi das Cruzes*", tipo: "Tipo II", lta: "Não precisa", alvara: "Protocolo", validade: "Protocolo desde 04/2024" },
                          { clinica: "Aracaju*", tipo: "Tipo II", lta: "Não precisa", alvara: "Protocolo", validade: "Protocolo inicial em 01/2024 - Renovado em 06/2025" },
                          { clinica: "Montes Claros", tipo: "Tipo II", lta: "Não precisa", alvara: "Protocolo", validade: "-" }
                        ].map((row, index) => (
                          <motion.tr
                            key={index}
                            className="border-b border-white/10 hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                          >
                            <td className="p-3 text-white font-medium">{row.clinica}</td>
                            <td className="p-3 text-gray-300">{row.tipo}</td>
                            <td className="p-3 text-gray-300">
                              {row.lta === 'Sim' ? (
                                <span className="status-badge status-approved">Sim</span>
                              ) : row.lta === 'Não precisa' ? (
                                <span className="status-badge status-not-needed">Não precisa</span>
                              ) : (
                                <span className="status-badge status-protocol">Protocolo</span>
                              )}
                            </td>
                            <td className="p-3 text-gray-300">
                              {row.alvara === 'Sim' ? (
                                <span className="status-badge status-approved">Sim</span>
                              ) : (
                                <span className="status-badge status-protocol">Protocolo</span>
                              )}
                            </td>
                            <td className="p-3 text-gray-300 text-xs">{row.validade}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </div>
          </Slide>
        )}

        {currentSlide === 5 && (
          <Slide key="slide-5" isActive={currentSlide === 5} slideIndex={5}>
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

        {currentSlide === 6 && (
          <Slide key="slide-6" isActive={currentSlide === 6} slideIndex={6}>
            <div className="slide-content">
              <motion.h1 
                className="slide-title text-white text-4xl md:text-6xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Exportar Apresentação
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: "PowerPoint (.pptx)",
                      icon: "📊",
                      description: "Exportar como apresentação PowerPoint nativa",
                      action: "exportPPTX",
                      color: "from-blue-500/20 to-blue-600/20"
                    },
                    {
                      title: "PDF",
                      icon: "📄",
                      description: "Gerar documento PDF para impressão",
                      action: "exportPDF",
                      color: "from-red-500/20 to-red-600/20"
                    },
                    {
                      title: "Google Slides",
                      icon: "☁️",
                      description: "Enviar para Google Slides (requer login)",
                      action: "exportGoogle",
                      color: "from-green-500/20 to-green-600/20"
                    },
                    {
                      title: "Imagem (PNG)",
                      icon: "🖼️",
                      description: "Exportar cada slide como imagem",
                      action: "exportImages",
                      color: "from-purple-500/20 to-purple-600/20"
                    },
                    {
                      title: "HTML",
                      icon: "🌐",
                      description: "Gerar arquivo HTML standalone",
                      action: "exportHTML",
                      color: "from-orange-500/20 to-orange-600/20"
                    },
                    {
                      title: "Texto (.txt)",
                      icon: "📝",
                      description: "Extrair apenas o texto da apresentação",
                      action: "exportText",
                      color: "from-gray-500/20 to-gray-600/20"
                    }
                  ].map((option, index) => (
                    <motion.div
                      key={index}
                      className={`card p-6 bg-gradient-to-br ${option.color} cursor-pointer`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleExport(option.action)}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-4">{option.icon}</div>
                        <h3 className="text-xl font-semibold text-white mb-3">{option.title}</h3>
                        <p className="text-gray-300 text-sm mb-4">{option.description}</p>
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30">
                          Exportar
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </Slide>
        )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default App
