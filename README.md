# Apresentação Empresarial - Legalização e Infraestrutura

Uma apresentação moderna e elegante criada com React + TypeScript + Tailwind CSS + Framer Motion.

## 🚀 Características

- **Design Moderno**: Interface elegante com tema escuro
- **Animações Suaves**: Transições e efeitos visuais com Framer Motion
- **Responsivo**: Adaptável a diferentes tamanhos de tela
- **Navegação Intuitiva**: Múltiplas formas de navegar entre slides
- **Tema Corporativo**: Cores e estilos profissionais

## 📱 Navegação

### Controles Visuais
- **Botões de Navegação**: Setas esquerda/direita no canto superior esquerdo
- **Indicador de Slide**: Mostra o slide atual no topo central
- **Pontos de Navegação**: Clique nos pontos à direita para ir direto ao slide

### Controles de Teclado
- **Seta Direita** ou **Espaço**: Próximo slide
- **Seta Esquerda**: Slide anterior
- **Home**: Primeiro slide
- **End**: Último slide

## 🎯 Estrutura da Apresentação

1. **Capa** - Legalização e Infraestrutura
2. **Serviços** - Responsabilidades do setor
3. **Alvará Sanitário** - Processos e requisitos
4. **Dificuldades** - Principais desafios enfrentados
5. **Unidades** - Status dos processos de liberação
6. **Overview** - Visão geral dos problemas

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS utilitário
- **Framer Motion** - Biblioteca de animações
- **Lucide React** - Ícones modernos
- **Vite** - Build tool e dev server

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Abrir no navegador**:
   Acesse `http://localhost:5173`

## 📦 Build para Produção

```bash
npm run build
```

## 🎨 Personalização

### Cores
- O tema escuro é aplicado por padrão
- As cores principais podem ser ajustadas no arquivo `tailwind.config.js`
- Gradientes e acentos podem ser modificados no `src/index.css`

### Conteúdo
- Edite o arquivo `src/App.tsx` para modificar o conteúdo dos slides
- Ajuste as animações alterando os parâmetros do Framer Motion
- Modifique os ícones importando outros do Lucide React

### Estilos
- Personalize os estilos editando as classes Tailwind
- Adicione novas animações no arquivo de configuração
- Modifique o layout responsivo ajustando as classes de grid

## 📱 Responsividade

A apresentação é totalmente responsiva e funciona em:
- **Desktop**: Layout completo com todos os elementos
- **Tablet**: Ajustes automáticos para telas médias
- **Mobile**: Layout otimizado para dispositivos móveis

## 🔧 Estrutura de Arquivos

```
src/
├── App.tsx          # Componente principal da apresentação
├── main.tsx         # Ponto de entrada da aplicação
├── index.css        # Estilos globais e variáveis CSS
└── lib/
    └── utils.ts     # Utilitários e funções auxiliares
```

## 🎭 Animações

- **Entrada de Slides**: Fade in com movimento vertical
- **Transições**: Animações suaves entre slides
- **Hover Effects**: Interações visuais nos elementos
- **Progress Bars**: Animações de carregamento
- **Ícones**: Animações de escala e rotação

## 📊 Performance

- **Lazy Loading**: Slides carregados sob demanda
- **Otimizações**: Animações otimizadas para performance
- **Bundle Size**: Código otimizado e minificado
- **Smooth Scrolling**: Navegação fluida entre slides

## 🤝 Contribuição

Para contribuir com melhorias:
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
