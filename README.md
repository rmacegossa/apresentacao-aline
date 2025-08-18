# 🎯 Apresentação Empresarial - Legalização e Infraestrutura

Uma apresentação moderna e elegante criada com React + TypeScript, focada no setor de infraestrutura e legalização empresarial.

## ✨ Características

- **7 slides interativos** com navegação completa
- **Tabelas responsivas** com scroll personalizado
- **Status badges coloridos** para indicadores visuais
- **Sistema de exportação** para múltiplos formatos
- **Animações suaves** com Framer Motion
- **Design responsivo** para todos os dispositivos
- **Tema escuro** elegante e profissional

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Framer Motion** - Animações e transições
- **Lucide React** - Ícones modernos
- **CSS puro** - Estilos customizados

## 📊 Estrutura dos Slides

### 1. **Capa** - Legalização e Infraestrutura
- Título principal e subtítulo
- Logo da empresa (rotacionado 90°)

### 2. **Serviços de Responsabilidade do Setor**
- Grid de 21 serviços com ícones
- Layout responsivo (2-5 colunas)

### 3. **Alvará Sanitário**
- Tabela com status das clínicas
- Scroll interno com design personalizado
- Status badges coloridos

### 4. **Maiores Dificuldades**
- Grid de 6 dificuldades principais
- Ícones representativos para cada item

### 5. **Unidades em Processo de Liberação**
- Tabela com status das unidades
- Scroll interno com design personalizado
- Status badges coloridos

### 6. **Overview de Problemas**
- Cards detalhados para 5 clínicas
- Descrições completas dos processos

### 7. **Exportar Apresentação**
- 6 opções de exportação
- PowerPoint, PDF, HTML, Texto
- Interface interativa com gradientes

## 🎨 Funcionalidades Visuais

### **Tabelas com Scroll**
- Altura máxima: 400px
- Scrollbar personalizada com cores azuis/roxas
- Hover effects com gradientes
- Linhas alternadas com cores diferentes

### **Status Badges**
- **Sim** (Verde): `status-approved`
- **Protocolo** (Roxo): `status-protocol`
- **Não precisa** (Cinza): `status-not-needed`

### **Animações**
- Transições suaves entre slides
- Hover effects nos cards
- Animações de entrada com delays escalonados
- Efeitos de escala e movimento

## 🎮 Controles de Navegação

### **Teclado**
- **Setas** ← → : Navegar entre slides
- **Espaço** : Próximo slide
- **Home** : Primeiro slide
- **End** : Último slide

### **Mouse**
- Botões de navegação (setas)
- Pontos de navegação (ícones)
- Cards clicáveis na página de exportação

## 📤 Sistema de Exportação

### **PowerPoint (.pptx)**
- Exportação via `pptxgenjs`
- Mantém formatação das tabelas
- Status badges preservados
- Fundo preto em todos os slides

### **PDF**
- Exportação via `html2pdf.js`
- Layout responsivo preservado
- Tabelas formatadas
- Cores e estilos mantidos

### **HTML**
- Arquivo standalone
- Estilos CSS incorporados
- Navegação entre slides
- Responsivo para web

### **Texto (.txt)**
- Conteúdo textual puro
- Estrutura organizada
- Fácil de copiar e colar

## 🛠️ Instalação e Uso

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn

### **Instalação**
```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]
cd apresentacao

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### **Scripts Disponíveis**
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

## 📁 Estrutura do Projeto

```
apresentacao/
├── public/                 # Arquivos estáticos
│   ├── logo.png           # Logo principal
│   └── logo-preto.png     # Logo alternativo
├── src/
│   ├── assets/            # Recursos (imagens, ícones)
│   ├── lib/               # Utilitários e funções
│   │   ├── exportUtils.ts # Funções de exportação
│   │   └── utils.ts       # Utilitários gerais
│   ├── types/             # Definições de tipos
│   ├── App.tsx            # Componente principal
│   ├── index.css          # Estilos globais
│   └── main.tsx           # Ponto de entrada
├── .gitignore             # Arquivos ignorados pelo Git
├── package.json           # Dependências e scripts
└── README.md              # Este arquivo
```

## 🔧 Personalização

### **Cores e Temas**
- Cores principais definidas em `src/index.css`
- Variáveis CSS para fácil personalização
- Gradientes e transparências configuráveis

### **Conteúdo**
- Dados das tabelas em `src/App.tsx`
- Serviços e dificuldades facilmente editáveis
- Status badges customizáveis

### **Animações**
- Configurações de timing em `src/App.tsx`
- Delays escalonados para entrada dos elementos
- Efeitos de hover configuráveis

## 📱 Responsividade

- **Mobile First** design
- Grid adaptativo (1-5 colunas)
- Tabelas com scroll horizontal em telas pequenas
- Navegação otimizada para touch

## 🚀 Deploy

### **Vercel/Netlify**
```bash
npm run build
# Upload da pasta dist/
```

### **GitHub Pages**
```bash
npm run build
# Configurar branch gh-pages
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou sugestões:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para apresentações empresariais modernas e elegantes**
