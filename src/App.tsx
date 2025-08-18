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

// Componente de slide
const Slide = ({ children, isActive }: { children: React.ReactNode, isActive: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 50 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className="slide-container"
  >
    {children}
  </motion.div>
)

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const totalSlides = 7

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

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animação de entrada */}
      {showIntro && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}
      
      {/* Barra de ferramentas no canto superior direito */}
      <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
        {/* Indicador de slide atual */}
        <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-white font-medium">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>
        
        {/* Botões de navegação */}
        <motion.button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={cn(
            "p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all",
            currentSlide === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/20 hover:scale-110"
          )}
          whileHover={currentSlide !== 0 ? { scale: 1.1 } : {}}
          whileTap={{ scale: 0.95 }}
          title="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className={cn(
            "p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all",
            currentSlide !== totalSlides - 1 ? "hover:bg-white/20 hover:scale-110" : "opacity-50 cursor-not-allowed"
          )}
          whileHover={currentSlide !== totalSlides - 1 ? { scale: 1.1 } : {}}
          whileTap={{ scale: 0.95 }}
          title="Próximo slide"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
        
        {/* Botão Full-Screen */}
        <motion.button
          onClick={toggleFullScreen}
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isFullScreen ? "Sair do modo tela cheia" : "Modo tela cheia"}
        >
          {isFullScreen ? (
            <Minimize2 className="w-6 h-6" />
          ) : (
            <Maximize2 className="w-6 h-6" />
          )}
        </motion.button>
      </div>

      {/* Navegação por pontos */}
      {!showIntro && (
        <NavigationDots
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onSlideChange={setCurrentSlide}
        />
      )}

      {/* Slides */}
      {!showIntro && (
        <AnimatePresence mode="wait">
        {currentSlide === 0 && (
          <Slide key="slide-0" isActive={currentSlide === 0}>
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
          <Slide key="slide-1" isActive={currentSlide === 1}>
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
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[
                    { name: "Transplante Capilar", icon: "💇‍♂️" },
                    { name: "Cirurgia Plástica", icon: "👨‍⚕️" },
                    { name: "Dermatologia", icon: "🔬" },
                    { name: "Anestesiologia", icon: "💉" },
                    { name: "Enfermagem", icon: "👩‍⚕️" },
                    { name: "Fisioterapia", icon: "🏃‍♂️" },
                    { name: "Nutrição", icon: "🥗" },
                    { name: "Psicologia", icon: "🧠" },
                    { name: "Farmacologia", icon: "💊" },
                    { name: "Radiologia", icon: "📷" },
                    { name: "Laboratório", icon: "🧪" },
                    { name: "UTI", icon: "🏥" },
                    { name: "Centro Cirúrgico", icon: "⚕️" },
                    { name: "Ambulatório", icon: "🚑" },
                    { name: "Pronto Socorro", icon: "🚨" },
                    { name: "Hemodinâmica", icon: "❤️" },
                    { name: "Endoscopia", icon: "🔍" },
                    { name: "Tomografia", icon: "🔄" },
                    { name: "Ressonância", icon: "🧲" },
                    { name: "Ultrassom", icon: "📡" },
                    { name: "Eletrocardiograma", icon: "📈" }
                  ].map((service, index) => (
                    <motion.div
                      key={index}
                      className="card p-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className="text-3xl mb-3 text-center">{service.icon}</div>
                      <h3 className="text-sm font-semibold text-white text-center leading-tight">{service.name}</h3>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </Slide>
        )}

        {currentSlide === 2 && (
          <Slide key="slide-2" isActive={currentSlide === 2}>
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
          <Slide key="slide-3" isActive={currentSlide === 3}>
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
          <Slide key="slide-4" isActive={currentSlide === 4}>
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
          <Slide key="slide-5" isActive={currentSlide === 5}>
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
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-white/20 to-gray-600/20 text-white border border-white/20">
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
          <Slide key="slide-6" isActive={currentSlide === 6}>
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
