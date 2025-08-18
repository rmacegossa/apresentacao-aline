import PptxGenJS from 'pptxgenjs'
import html2pdf from 'html2pdf.js'

// Função para exportar para PowerPoint
export const exportToPowerPoint = async () => {
  try {
    const pptx = new PptxGenJS()
    
    // Configurações da apresentação
    pptx.layout = 'LAYOUT_16x9'
    pptx.author = 'Setor de Infraestrutura e Legalização'
    pptx.company = 'Empresa'
    pptx.title = 'Legalização e Infraestrutura'
    pptx.subject = 'Apresentação Empresarial'
    
    // Slide 1 - Capa
    const slide1 = pptx.addSlide()
    
    // Fundo preto
    slide1.background = { color: '000000' }
    
    // Título principal
    slide1.addText('Legalização e Infraestrutura', {
      x: 1, y: 2, w: 8, h: 1.5,
      fontSize: 48,
      bold: true,
      color: 'FFFFFF',
      align: 'left'
    })
    
    // Subtítulo
    slide1.addText('Setor de Infraestrutura e Legalização', {
      x: 1, y: 3.5, w: 8, h: 0.8,
      fontSize: 28,
      color: 'CCCCCC',
      align: 'left'
    })
    
    // Logo (posicionado à direita)
    try {
      slide1.addImage({
        path: '/logo.png',
        x: 10, y: 1, w: 2, h: 2,
        sizing: { type: 'contain', w: 2, h: 2 }
      })
    } catch (e) {
      // Se não conseguir carregar o logo, adiciona um placeholder
      slide1.addText('LOGO', {
        x: 10, y: 1, w: 2, h: 2,
        fontSize: 16,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle'
      })
    }
    
    // Slide 2 - Serviços
    const slide2 = pptx.addSlide()
    
    // Fundo preto
    slide2.background = { color: '000000' }
    
    // Título
    slide2.addText('Serviços de Responsabilidade', {
      x: 0.5, y: 0.3, w: 9, h: 1,
      fontSize: 36,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    })
    
    // Grid de cards de serviços (4x5)
    const services = [
      { name: 'Abertura', icon: '📋' },
      { name: 'Alteração', icon: '✏️' },
      { name: 'Encerramento', icon: '🚪' },
      { name: 'Solicitação de Inscrição Municipal', icon: '🏛️' },
      { name: 'Alvará de Funcionamento', icon: '📜' },
      { name: 'Protocolo e Acompanhamento LTA', icon: '📋' },
      { name: 'COREN, CRM, CRF', icon: '👨‍⚕️' },
      { name: 'Inscrição Secundária CRM', icon: '🏥' },
      { name: 'Alvará dos Bombeiros', icon: '🚒' },
      { name: 'Alvará Sanitário', icon: '🧪' },
      { name: 'Certificados Digitais', icon: '💻' },
      { name: 'Verificação de Débitos', icon: '💰' },
      { name: 'Vivência em Órgãos Públicos', icon: '🏢' },
      { name: 'Atendimento a Fiscais', icon: '👮' },
      { name: 'LTCA, PGRSS, PGR, PCMSO', icon: '📊' },
      { name: 'Licença Ambiental', icon: '🌱' },
      { name: 'Processos Administrativos', icon: '📝' },
      { name: 'Controle de Vencimentos', icon: '📅' },
      { name: 'CETESB', icon: '🌿' },
      { name: 'CNES', icon: '🏥' },
      { name: 'Gestão de Contratos', icon: '📋' }
    ]
    
    // Criar grid de cards
    let servicesRow = 0
    let servicesCol = 0
    const servicesCardWidth = 2.2
    const servicesCardHeight = 1.2
    const servicesStartX = 0.3
    const servicesStartY = 1.5
    
    services.forEach((service, _) => {
      const x = servicesStartX + (servicesCol * servicesCardWidth)
      const y = servicesStartY + (servicesRow * servicesCardHeight)
      
      // Card com fundo semi-transparente
      slide2.addShape('rect', {
        x: x, y: y, w: servicesCardWidth - 0.1, h: servicesCardHeight - 0.1,
        fill: { color: 'FFFFFF', transparency: 95 },
        line: { color: 'FFFFFF', width: 1 }
      })
      
      // Ícone
      slide2.addText(service.icon, {
        x: x + 0.1, y: y + 0.1, w: 0.5, h: 0.5,
        fontSize: 20,
        color: 'FFFFFF',
        align: 'center'
      })
      
      // Nome do serviço
      slide2.addText(service.name, {
        x: x + 0.1, y: y + 0.6, w: servicesCardWidth - 0.2, h: 0.5,
        fontSize: 10,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle'
      })
      
      servicesCol++
      if (servicesCol >= 4) {
        servicesCol = 0
        servicesRow++
      }
    })
    
    // Slide 3 - Alvará Sanitário
    const slide3 = pptx.addSlide()
    
    // Fundo preto
    slide3.background = { color: '000000' }
    
    // Título
    slide3.addText('Alvará Sanitário', {
      x: 0.5, y: 0.3, w: 9, h: 1,
      fontSize: 36,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    })
    
    // Tabela de clínicas com estilo melhorado
    const clinicData = [
      ['Clínicas', 'TIPO I OU II', 'Aprovação LTA', 'Alvará Sanitário', 'Validade'],
      ['SP Indianópolis', 'Tipo II', 'Sim', 'Sim', '03/05/2026'],
      ['RJ Barra da Tijuca', 'Tipo II', 'Sim', 'Sim', '30/04/2026'],
      ['SP Alphaville 26ª', 'Tipo I', 'Não precisa', 'Sim', '12/12/2025'],
      ['MG BH', 'Tipo II', 'Sim', 'Sim', '17/07/2025'],
      ['BA Salvador', 'Tipo I', 'Sim', 'Sim', '31/12/2025'],
      ['SC Balneário', 'Tipo II', 'Sim', 'Sim', '31/12/2025'],
      ['DF Brasília I*', 'Tipo II', 'Sim', 'Sim', 'Aguardando clínica iniciar operações - 01/2026'],
      ['PE Recife', 'Tipo II', 'Protocolo', 'Sim', '23/10/2026 (somente para Tipo I)'],
      ['ES Vitoria', 'Tipo II', 'Não precisa', 'Sim', '28/02/2029'],
      ['GO Jardim America', 'Tipo II', 'Sim', 'Sim', '31/12/2025'],
      ['SP Tatuapé', 'Tipo II', 'Não precisa', 'Sim', '28/11/2027'],
      ['DF Brasília II', 'Tipo II', 'Sim', 'Sim', '18/01/2026'],
      ['RJ Copacabana', 'Tipo II', 'Sim', 'Sim', '30/4/2026'],
      ['MG Uberlandia', 'Tipo II', 'Protocolo', 'Sim', '4/7/2028'],
      ['SP Jardins', 'Tipo I', 'Não precisa', 'Sim', '11/10/2026'],
      ['DF Brasília III', 'Tipo II', 'Sim', 'Sim', '30/04/2025 - Aguardando visita']
    ]
    
    // Criar tabela com estilo personalizado
    const tableOptions = {
      x: 0.3, y: 1.5, w: 9.4, h: 5,
      fontSize: 10,
      color: 'FFFFFF',
      border: { type: 'solid' as const, color: '3B82F6', pt: 2 },
      align: 'left' as const,
      valign: 'middle' as const,
      headerRow: true,
      headerFill: { color: '3B82F6' },
      headerColor: 'FFFFFF',
      headerFontSize: 11,
      headerBold: true,
      rowFill: { color: '1E293B' },
      alternateRowFill: { color: '334155' }
    }
    
    slide3.addTable(clinicData.map(row => row.map(cell => ({ text: cell }))), tableOptions)
    
    // Slide 4 - Dificuldades
    const slide4 = pptx.addSlide()
    
    // Fundo preto
    slide4.background = { color: '000000' }
    
    // Título
    slide4.addText('Maiores Dificuldades', {
      x: 0.5, y: 0.3, w: 9, h: 1,
      fontSize: 36,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    })
    
    const difficulties = [
      { text: 'Inadequação da infraestrutura física à RDC 50', icon: '🏗️' },
      { text: 'Alto volume de denúncias e fiscalizações', icon: '📢' },
      { text: 'Escassez de profissionais com RQE para atuar como RT', icon: '👨‍⚕️' },
      { text: 'Vácuo legislativo para transplante capilar', icon: '📜' },
      { text: 'Inconsistência técnica nas fiscalizações', icon: '🔍' },
      { text: 'Pressões e interferências externas na operação', icon: '⚖️' }
    ]
    
    // Layout em grid 2x3 para as dificuldades
    let difficultiesRow = 0
    let difficultiesCol = 0
    const difficultiesCardWidth = 4.5
    const difficultiesCardHeight = 1.8
    const difficultiesStartX = 0.3
    const difficultiesStartY = 1.5
    
    difficulties.forEach((difficulty, _) => {
      const x = difficultiesStartX + (difficultiesCol * difficultiesCardWidth)
      const y = difficultiesStartY + (difficultiesRow * difficultiesCardHeight)
      
      // Card com fundo semi-transparente
      slide4.addShape('rect', {
        x: x, y: y, w: difficultiesCardWidth - 0.1, h: difficultiesCardHeight - 0.1,
        fill: { color: 'FFFFFF', transparency: 95 },
        line: { color: 'FFFFFF', width: 1 }
      })
      
      // Ícone
      slide4.addText(difficulty.icon, {
        x: x + 0.2, y: y + 0.3, w: 1, h: 1,
        fontSize: 24,
        color: 'FFFFFF',
        align: 'center'
      })
      
      // Texto da dificuldade
      slide4.addText(difficulty.text, {
        x: x + 1.5, y: y + 0.3, w: difficultiesCardWidth - 1.7, h: 1,
        fontSize: 12,
        color: 'FFFFFF',
        align: 'left',
        valign: 'middle'
      })
      
      difficultiesCol++
      if (difficultiesCol >= 2) {
        difficultiesCol = 0
        difficultiesRow++
      }
    })
    
    // Slide 5 - Unidades em Processo
    const slide5 = pptx.addSlide()
    
    // Fundo preto
    slide5.background = { color: '000000' }
    
    // Título
    slide5.addText('Unidades em Processo de Liberação', {
      x: 0.5, y: 0.3, w: 9, h: 1,
      fontSize: 36,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    })
    
    // Tabela de unidades em processo
    const processData = [
      ['Clínicas', 'TIPO I OU II', 'Aprovação LTA', 'Alvará Sanitário', 'Validade'],
      ['Cuiabá', 'Tipo II', 'Protocolo', 'Protocolo', 'Protocolo inicial em 05/2023 - refeito em 07/2024'],
      ['Manaus', 'Tipo II', 'Sim', 'Protocolo', 'Protocolo desde 04/2024'],
      ['Porto Velho', 'Tipo II', 'Não precisa', 'Protocolo', ''],
      ['Porto Alegre', 'Tipo II', 'Protocolo', 'Protocolo', 'Protocolo desde 11.2023. Clínica aprovada pela fiscalização sanitária aguardando liberação do projeto.'],
      ['Florianópolis', 'Tipo II', 'Protocolo', 'Protocolo', ''],
      ['Ribeirão Preto', 'Tipo II', 'Sim', 'Protocolo', 'Protocolo desde 11/2024'],
      ['Campinas II', 'Tipo II', 'Não precisa', 'Protocolo', 'Renovação cancelada'],
      ['Mogi das Cruzes*', 'Tipo II', 'Não precisa', 'Protocolo', 'Protocolo desde 04/2024'],
      ['Aracaju*', 'Tipo II', 'Não precisa', 'Protocolo', 'Protocolo inicial em 01/2024 - Renovado em 06/2025'],
      ['Montes Claros', 'Tipo II', 'Não precisa', 'Protocolo', '']
    ]
    
    // Criar tabela com estilo personalizado
    const processTableOptions = {
      x: 0.3, y: 1.5, w: 9.4, h: 5,
      fontSize: 9,
      color: 'FFFFFF',
      border: { type: 'solid' as const, color: '3B82F6', pt: 2 },
      align: 'left' as const,
      valign: 'middle' as const,
      headerRow: true,
      headerFill: { color: '3B82F6' },
      headerColor: 'FFFFFF',
      headerFontSize: 10,
      headerBold: true,
      rowFill: { color: '1E293B' },
      alternateRowFill: { color: '334155' }
    }
    
    slide5.addTable(processData.map(row => row.map(cell => ({ text: cell }))), processTableOptions)
    
    // Slide 6 - Overview de Problemas
    const slide6 = pptx.addSlide()
    
    // Fundo preto
    slide6.background = { color: '000000' }
    
    // Título
    slide6.addText('Overview de Problemas', {
      x: 0.5, y: 0.3, w: 9, h: 1,
      fontSize: 36,
      bold: true,
      color: 'FFFFFF',
      align: 'center'
    })
    
    // Conteúdo do overview de problemas
    const problems = [
      { 
        clinica: 'Cuiabá', 
        icon: '🏗️',
        status: 'Fase final de liberação Tipo I',
        description: 'Unidade passou por processo rigoroso de regularização junto à Vigilância Sanitária, motivado por denúncia que resultou em interdição temporária. Todas as exigências foram atendidas.'
      },
      { 
        clinica: 'Manaus', 
        icon: '🔧',
        status: 'Projeto aprovado, obras em andamento',
        description: 'Unidade enfrentou desafios estruturais que demandaram múltiplas obras e ajustes para atender às normas da Vigilância Sanitária.'
      },
      { 
        clinica: 'Porto Alegre', 
        icon: '✅',
        status: 'Validada pela Vigilância Sanitária',
        description: 'Clínica já foi validada, aguarda apenas conclusão da análise do projeto para liberação final.'
      },
      { 
        clinica: 'Florianópolis', 
        icon: '📋',
        status: 'Projeto aprovado, obra pendente',
        description: 'Unidade passou por longo processo de aprovação do projeto, ainda necessária obra de adequação.'
      },
      { 
        clinica: 'Ribeirão Preto', 
        icon: '🎯',
        status: 'Fase final, pendência RT/CRM',
        description: 'Clínica foi vistoriada e recebeu elogios da Vigilância Sanitária, projeto totalmente aprovado.'
      }
    ]
    
    // Layout em grid 2x3 para os problemas (última linha com apenas 1 card)
    let problemsRow = 0
    let problemsCol = 0
    const problemsCardWidth = 4.5
    const problemsCardHeight = 2.2
    const problemsStartX = 0.3
    const problemsStartY = 1.5
    
    problems.forEach((problem, _) => {
      const x = problemsStartX + (problemsCol * problemsCardWidth)
      const y = problemsStartY + (problemsRow * problemsCardHeight)
      
      // Card com fundo semi-transparente
      slide6.addShape('rect', {
        x: x, y: y, w: problemsCardWidth - 0.1, h: problemsCardHeight - 0.1,
        fill: { color: 'FFFFFF', transparency: 95 },
        line: { color: 'FFFFFF', width: 1 }
      })
      
      // Ícone
      slide6.addText(problem.icon, {
        x: x + 0.2, y: y + 0.2, w: 1, h: 1,
        fontSize: 20,
        color: 'FFFFFF',
        align: 'center'
      })
      
      // Nome da clínica
      slide6.addText(problem.clinica, {
        x: x + 1.5, y: y + 0.2, w: problemsCardWidth - 1.7, h: 0.5,
        fontSize: 14,
        color: 'FFFFFF',
        align: 'left',
        bold: true
      })
      
      // Status
      slide6.addText(problem.status, {
        x: x + 1.5, y: y + 0.7, w: problemsCardWidth - 1.7, h: 0.4,
        fontSize: 10,
        color: 'CCCCCC',
        align: 'left'
      })
      
      // Descrição
      slide6.addText(problem.description, {
        x: x + 0.2, y: y + 1.2, w: problemsCardWidth - 0.4, h: 0.8,
        fontSize: 9,
        color: 'FFFFFF',
        align: 'left',
        valign: 'top'
      })
      
      problemsCol++
      if (problemsCol >= 2) {
        problemsCol = 0
        problemsRow++
      }
    })
    
    // Gerar e baixar o arquivo
    await pptx.writeFile({ fileName: 'Legalizacao_Infraestrutura.pptx' })
    
    return true
  } catch (error) {
    console.error('Erro ao exportar para PowerPoint:', error)
    return false
  }
}

// Função para exportar para PDF
export const exportToPDF = async () => {
  try {
    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 1000px; margin: 0 auto; background-color: #000000; color: #FFFFFF; min-height: 100vh;">
        <h1 style="color: #FFFFFF; text-align: center; font-size: 36px; margin-bottom: 20px;">
          Legalização e Infraestrutura
        </h1>
        <h2 style="color: #CCCCCC; text-align: center; font-size: 24px; margin-bottom: 40px;">
          Setor de Infraestrutura e Legalização
        </h2>
        
        <h3 style="color: #333; font-size: 28px; margin-top: 40px;">Serviços de Responsabilidade</h3>
        <ul style="color: #666; font-size: 16px; line-height: 1.6;">
          <li>Abertura</li>
          <li>Alteração</li>
          <li>Encerramento</li>
          <li>Solicitação de Inscrição Municipal</li>
          <li>Alvará de Funcionamento</li>
          <li>Protocolo e Acompanhamento LTA</li>
          <li>COREN, CRM, CRF</li>
          <li>Inscrição Secundária CRM</li>
          <li>Alvará dos Bombeiros</li>
          <li>Alvará Sanitário</li>
          <li>Certificados Digitais</li>
          <li>Verificação de Débitos</li>
          <li>Vivência em Órgãos Públicos</li>
          <li>Atendimento a Fiscais</li>
          <li>LTCA, PGRSS, PGR, PCMSO</li>
          <li>Licença Ambiental</li>
          <li>Processos Administrativos</li>
          <li>Controle de Vencimentos</li>
          <li>CETESB</li>
          <li>CNES</li>
          <li>Gestão de Contratos</li>
        </ul>
        
        <h3 style="color: #FFFFFF; font-size: 28px; margin-top: 40px;">Alvará Sanitário</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Clínicas</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">TIPO I OU II</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Aprovação LTA</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Alvará Sanitário</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Validade</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">SP Indianópolis</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">03/05/2026</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">RJ Barra da Tijuca</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">30/04/2026</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">SP Alphaville 26ª</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo I</td><td style="border: 1px solid #ddd; padding: 12px;">Não precisa</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">12/12/2025</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">MG BH</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">17/07/2025</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">BA Salvador</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo I</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">31/12/2025</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">SC Balneário</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">31/12/2025</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">DF Brasília I*</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Aguardando clínica iniciar operações - 01/2026</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">PE Recife</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">23/10/2026 (somente para Tipo I)</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">ES Vitoria</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Não precisa</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">28/02/2029</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">GO Jardim America</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">31/12/2025</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">SP Tatuapé</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Não precisa</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">28/11/2027</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">DF Brasília II</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">18/01/2026</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">RJ Copacabana</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">30/4/2026</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">MG Uberlandia</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">4/7/2028</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">SP Jardins</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo I</td><td style="border: 1px solid #ddd; padding: 12px;">Não precisa</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">11/10/2026</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">DF Brasília III</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">30/04/2025 - Aguardando visita</td></tr>
          </tbody>
        </table>
        
        <h3 style="color: #333; font-size: 28px; margin-top: 40px;">Maiores Dificuldades</h3>
        <ul style="color: #666; font-size: 16px; line-height: 1.6;">
          <li>Inadequação da infraestrutura física à RDC 50</li>
          <li>Alto volume de denúncias e fiscalizações</li>
          <li>Escassez de profissionais com RQE para atuar como RT</li>
          <li>Vácuo legislativo para transplante capilar</li>
          <li>Inconsistência técnica nas fiscalizações</li>
          <li>Pressões e interferências externas na operação</li>
        </ul>
        
        <h3 style="color: #333; font-size: 28px; margin-top: 40px;">Unidades em Processo de Liberação</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Clínicas</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">TIPO I OU II</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Aprovação LTA</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Alvará Sanitário</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Validade</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">Cuiabá</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo inicial em 05/2023 - refeito em 07/2024</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">Manaus</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo desde 04/2024</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">Porto Velho</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Não precisa</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;"></td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">Porto Alegre</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo desde 11.2023. Clínica aprovada pela fiscalização sanitária aguardando liberação do projeto.</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">Florianópolis</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;"></td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">Ribeirão Preto</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo desde 11/2024</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">Campinas II</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Não precisa</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Renovação cancelada</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">Mogi das Cruzes*</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Não precisa</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo desde 04/2024</td></tr>
            <tr><td style="border: 1px solid #ddd; padding: 12px;">Aracaju*</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Não precisa</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo inicial em 01/2024 - Renovado em 06/2025</td></tr>
            <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">Montes Claros</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Não precisa</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;"></td></tr>
          </tbody>
        </table>
        
        <h3 style="color: #333; font-size: 28px; margin-top: 40px;">Overview de Problemas</h3>
        <div style="color: #666; font-size: 16px; line-height: 1.6;">
          <p><strong>Cuiabá:</strong> Fase final de liberação Tipo I. Unidade passou por processo rigoroso de regularização junto à Vigilância Sanitária, motivado por denúncia que resultou em interdição temporária. Durante a fiscalização, foram exigidas diversas adequações, incluindo obras estruturais significativas. Todas as exigências foram devidamente atendidas, demonstrando o comprometimento da equipe com a conformidade e qualidade do serviço.</p>
          <p><strong>Manaus:</strong> Em Manaus, a unidade enfrentou desafios estruturais que demandaram múltiplas obras e ajustes para atender às normas da Vigilância Sanitária. Após um período de trabalho intenso, o projeto foi recentemente aprovado, embora algumas intervenções ainda estejam em andamento.</p>
          <p><strong>Porto Alegre:</strong> A clínica de Porto Alegre já foi validada pela Vigilância Sanitária, o que confirma a conformidade da unidade com os requisitos essenciais de operação. No momento, aguarda-se apenas a conclusão da análise do projeto para que possa obter a liberação final.</p>
          <p><strong>Florianópolis:</strong> Em Florianópolis, a unidade passou por um longo processo de aprovação do projeto, que envolveu diversas idas e vindas e ajustes estruturais. Apesar de o projeto ter sido aprovado, ainda é necessária a realização de uma obra de adequação.</p>
          <p><strong>Ribeirão Preto:</strong> A unidade de Ribeirão Preto está em fase final de liberação. A clínica foi vistoriada e recebeu elogios da Vigilância Sanitária, com o projeto totalmente aprovado. No entanto, a liberação formal ainda depende da regularização de uma pendência do Responsável Técnico junto ao CRM.</p>
        </div>
      </div>
    `
    
    const opt = {
      margin: 1,
      filename: 'Legalizacao_Infraestrutura.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }
    
    await html2pdf().set(opt).from(element).save()
    return true
  } catch (error) {
    console.error('Erro ao exportar para PDF:', error)
    return false
  }
}

// Função para exportar para HTML
export const exportToHTML = () => {
  try {
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legalização e Infraestrutura</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; font-size: 36px; margin-bottom: 20px; }
        h2 { color: #666; text-align: center; font-size: 24px; margin-bottom: 40px; }
        h3 { color: #333; font-size: 28px; margin-top: 40px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        ul { color: #666; font-size: 16px; line-height: 1.6; }
        li { margin-bottom: 8px; }
        .slide { page-break-after: always; margin-bottom: 40px; }
        .slide:last-child { page-break-after: avoid; }
    </style>
</head>
<body>
    <div class="container">
        <div class="slide">
            <h1>Legalização e Infraestrutura</h1>
            <h2>Setor de Infraestrutura e Legalização</h2>
        </div>
        
        <div class="slide">
            <h3>Serviços de Responsabilidade</h3>
            <ul>
                <li>Abertura</li>
                <li>Alteração</li>
                <li>Encerramento</li>
                <li>Solicitação de Inscrição Municipal</li>
                <li>Alvará de Funcionamento</li>
                <li>Protocolo e Acompanhamento LTA</li>
                <li>COREN, CRM, CRF</li>
                <li>Inscrição Secundária CRM</li>
                <li>Alvará dos Bombeiros</li>
                <li>Alvará Sanitário</li>
                <li>Certificados Digitais</li>
                <li>Verificação de Débitos</li>
                <li>Vivência em Órgãos Públicos</li>
                <li>Atendimento a Fiscais</li>
                <li>LTCA, PGRSS, PGR, PCMSO</li>
                <li>Licença Ambiental</li>
                <li>Processos Administrativos</li>
                <li>Controle de Vencimentos</li>
                <li>CETESB</li>
                <li>CNES</li>
                <li>Gestão de Contratos</li>
            </ul>
        </div>
        
        <div class="slide">
            <h3>Alvará Sanitário</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                <thead>
                    <tr style="background-color: #f5f5f5;">
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Clínicas</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">TIPO I OU II</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Aprovação LTA</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Alvará Sanitário</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Validade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style="border: 1px solid #ddd; padding: 12px;">SP Indianópolis</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">03/05/2026</td></tr>
                    <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">RJ Barra da Tijuca</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">30/04/2026</td></tr>
                    <tr><td style="border: 1px solid #ddd; padding: 12px;">SP Alphaville 26ª</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo I</td><td style="border: 1px solid #ddd; padding: 12px;">Não precisa</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">12/12/2025</td></tr>
                    <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">MG BH</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">17/07/2025</td></tr>
                    <tr><td style="border: 1px solid #ddd; padding: 12px;">BA Salvador</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo I</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">31/12/2025</td></tr>
                </tbody>
            </table>
        </div>
        
        <div class="slide">
            <h3>Maiores Dificuldades</h3>
            <ul>
                <li>Inadequação da infraestrutura física à RDC 50</li>
                <li>Alto volume de denúncias e fiscalizações</li>
                <li>Escassez de profissionais com RQE para atuar como RT</li>
                <li>Vácuo legislativo para transplante capilar</li>
                <li>Inconsistência técnica nas fiscalizações</li>
                <li>Pressões e interferências externas na operação</li>
            </ul>
        </div>
        
        <div class="slide">
            <h3>Unidades em Processo de Liberação</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                <thead>
                    <tr style="background-color: #f5f5f5;">
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Clínicas</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">TIPO I OU II</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Aprovação LTA</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Alvará Sanitário</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Validade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style="border: 1px solid #ddd; padding: 12px;">Cuiabá</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo inicial em 05/2023 - refeito em 07/2024</td></tr>
                    <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">Manaus</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo desde 04/2024</td></tr>
                    <tr><td style="border: 1px solid #ddd; padding: 12px;">Porto Alegre</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo desde 11.2023. Clínica aprovada pela fiscalização sanitária aguardando liberação do projeto.</td></tr>
                    <tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px;">Ribeirão Preto</td><td style="border: 1px solid #ddd; padding: 12px;">Tipo II</td><td style="border: 1px solid #ddd; padding: 12px;">Sim</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo</td><td style="border: 1px solid #ddd; padding: 12px;">Protocolo desde 11/2024</td></tr>
                </tbody>
            </table>
        </div>
        
        <div class="slide">
            <h3>Overview de Problemas</h3>
            <div style="color: #666; font-size: 16px; line-height: 1.6;">
                <p><strong>Cuiabá:</strong> Fase final de liberação Tipo I. Unidade passou por processo rigoroso de regularização junto à Vigilância Sanitária, motivado por denúncia que resultou em interdição temporária. Todas as exigências foram atendidas.</p>
                <p><strong>Manaus:</strong> Em Manaus, a unidade enfrentou desafios estruturais que demandaram múltiplas obras e ajustes para atender às normas da Vigilância Sanitária. Projeto foi recentemente aprovado.</p>
                <p><strong>Porto Alegre:</strong> A clínica já foi validada pela Vigilância Sanitária, aguarda apenas conclusão da análise do projeto para liberação final.</p>
                <p><strong>Florianópolis:</strong> Projeto aprovado, ainda necessária obra de adequação para que a clínica esteja totalmente pronta para liberação.</p>
                <p><strong>Ribeirão Preto:</strong> Fase final de liberação. Clínica foi vistoriada e recebeu elogios da Vigilância Sanitária, projeto totalmente aprovado.</p>
            </div>
        </div>
    </div>
</body>
</html>`
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Legalizacao_Infraestrutura.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Erro ao exportar para HTML:', error)
    return false
  }
}

// Função para exportar para texto
export const exportToText = () => {
  try {
    const textContent = `LEGALIZAÇÃO E INFRAESTRUTURA
Setor de Infraestrutura e Legalização

SERVIÇOS DE RESPONSABILIDADE:
- Abertura
- Alteração
- Encerramento
- Solicitação de Inscrição Municipal
- Alvará de Funcionamento
- Protocolo e Acompanhamento LTA
- COREN, CRM, CRF
- Inscrição Secundária CRM
- Alvará dos Bombeiros
- Alvará Sanitário
- Certificados Digitais
- Verificação de Débitos
- Vivência em Órgãos Públicos
- Atendimento a Fiscais
- LTCA, PGRSS, PGR, PCMSO
- Licença Ambiental
- Processos Administrativos
- Controle de Vencimentos
- CETESB
- CNES
- Gestão de Contratos

MAIORES DIFICULDADES:
- Inadequação da infraestrutura física à RDC 50
- Alto volume de denúncias e fiscalizações
- Escassez de profissionais com RQE para atuar como RT
- Vácuo legislativo para transplante capilar
- Inconsistência técnica nas fiscalizações
- Pressões e interferências externas na operação

ALVARÁ SANITÁRIO - STATUS DAS CLÍNICAS:
SP Indianópolis - Tipo II - Aprovação LTA: Sim - Alvará: Sim - Validade: 03/05/2026
RJ Barra da Tijuca - Tipo II - Aprovação LTA: Sim - Alvará: Sim - Validade: 30/04/2026
SP Alphaville 26ª - Tipo I - Aprovação LTA: Não precisa - Alvará: Sim - Validade: 12/12/2025
MG BH - Tipo II - Aprovação LTA: Sim - Alvará: Sim - Validade: 17/07/2025
BA Salvador - Tipo I - Aprovação LTA: Sim - Alvará: Sim - Validade: 31/12/2025
SC Balneário - Tipo II - Aprovação LTA: Sim - Alvará: Sim - Validade: 31/12/2025
DF Brasília I* - Tipo II - Aprovação LTA: Sim - Alvará: Sim - Validade: Aguardando clínica iniciar operações - 01/2026
PE Recife - Tipo II - Aprovação LTA: Protocolo - Alvará: Sim - Validade: 23/10/2026 (somente para Tipo I)
ES Vitoria - Tipo II - Aprovação LTA: Não precisa - Alvará: Sim - Validade: 28/02/2029
GO Jardim America - Tipo II - Aprovação LTA: Sim - Alvará: Sim - Validade: 31/12/2025
SP Tatuapé - Tipo II - Aprovação LTA: Não precisa - Alvará: Sim - Validade: 28/11/2027
DF Brasília II - Tipo II - Aprovação LTA: Sim - Alvará: Sim - Validade: 18/01/2026
RJ Copacabana - Tipo II - Aprovação LTA: Sim - Alvará: Sim - Validade: 30/4/2026
MG Uberlandia - Tipo II - Aprovação LTA: Protocolo - Alvará: Sim - Validade: 4/7/2028
SP Jardins - Tipo I - Aprovação LTA: Não precisa - Alvará: Sim - Validade: 11/10/2026
DF Brasília III - Tipo II - Aprovação LTA: Sim - Alvará: Sim - Validade: 30/04/2025 - Aguardando visita

UNIDADES EM PROCESSO DE LIBERAÇÃO:
Cuiabá - Tipo II - Aprovação LTA: Protocolo - Alvará: Protocolo - Validade: Protocolo inicial em 05/2023 - refeito em 07/2024
Manaus - Tipo II - Aprovação LTA: Sim - Alvará: Protocolo - Validade: Protocolo desde 04/2024
Porto Velho - Tipo II - Aprovação LTA: Não precisa - Alvará: Protocolo
Porto Alegre - Tipo II - Aprovação LTA: Protocolo - Alvará: Protocolo - Validade: Protocolo desde 11.2023. Clínica aprovada pela fiscalização sanitária aguardando liberação do projeto.
Florianópolis - Tipo II - Aprovação LTA: Protocolo - Alvará: Protocolo
Ribeirão Preto - Tipo II - Aprovação LTA: Sim - Alvará: Protocolo - Validade: Protocolo desde 11/2024
Campinas II - Tipo II - Aprovação LTA: Não precisa - Alvará: Protocolo - Validade: Renovação cancelada
Mogi das Cruzes* - Tipo II - Aprovação LTA: Não precisa - Alvará: Protocolo - Validade: Protocolo desde 04/2024
Aracaju* - Tipo II - Aprovação LTA: Não precisa - Alvará: Protocolo - Validade: Protocolo inicial em 01/2024 - Renovado em 06/2025
Montes Claros - Tipo II - Aprovação LTA: Não precisa - Alvará: Protocolo

OVERVIEW DE PROBLEMAS:
Cuiabá: Fase final de liberação Tipo I. Unidade passou por processo rigoroso de regularização junto à Vigilância Sanitária, motivado por denúncia que resultou em interdição temporária. Durante a fiscalização, foram exigidas diversas adequações, incluindo obras estruturais significativas. Todas as exigências foram devidamente atendidas, demonstrando o comprometimento da equipe com a conformidade e qualidade do serviço.

Manaus: Em Manaus, a unidade enfrentou desafios estruturais que demandaram múltiplas obras e ajustes para atender às normas da Vigilância Sanitária. Após um período de trabalho intenso, o projeto foi recentemente aprovado, embora algumas intervenções ainda estejam em andamento. O processo evidencia o empenho da equipe em garantir a total adequação da unidade, seguindo todas as exigências legais e estruturais para operação segura e eficiente.

Porto Alegre: A clínica de Porto Alegre já foi validada pela Vigilância Sanitária, o que confirma a conformidade da unidade com os requisitos essenciais de operação. No momento, aguarda-se apenas a conclusão da análise do projeto para que possa obter a liberação final, permitindo a continuidade das atividades dentro dos padrões exigidos.

Florianópolis: Em Florianópolis, a unidade passou por um longo processo de aprovação do projeto, que envolveu diversas idas e vindas e ajustes estruturais. Apesar de o projeto ter sido aprovado, ainda é necessária a realização de uma obra de adequação para que a clínica esteja totalmente pronta para liberação. Esse processo demonstra o cuidado da equipe em garantir que a unidade atenda integralmente às normas de segurança e qualidade.

Ribeirão Preto: A unidade de Ribeirão Preto está em fase final de liberação. A clínica foi vistoriada e recebeu elogios da Vigilância Sanitária, com o projeto totalmente aprovado. No entanto, a liberação formal ainda depende da regularização de uma pendência do Responsável Técnico junto ao CRM. A expectativa é que, assim que essa questão seja solucionada, a clínica esteja plenamente operacional.`
    
    const blob = new Blob([textContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Legalizacao_Infraestrutura.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Erro ao exportar para texto:', error)
    return false
  }
}

// Função para exportar imagens dos slides
export const exportToImages = async () => {
  try {
    // Esta função seria implementada para capturar screenshots dos slides
    // Por enquanto, retorna um alerta informativo
    alert('Funcionalidade de exportação para imagens será implementada em breve!')
    return true
  } catch (error) {
    console.error('Erro ao exportar para imagens:', error)
    return false
  }
}

// Função para exportar para Google Slides
export const exportToGoogleSlides = () => {
  try {
    // Esta função seria implementada com a API do Google
    // Por enquanto, retorna um alerta informativo
    alert('Funcionalidade de exportação para Google Slides será implementada em breve!')
    return true
  } catch (error) {
    console.error('Erro ao exportar para Google Slides:', error)
    return false
  }
}
