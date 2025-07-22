# Nutrimatic - Plataforma de IA para Nutricionistas

![Nutrimatic Logo](public/Nutrimatic%20Logo%20PNG.png)

## 🚀 Sobre o Projeto

A **Nutrimatic** é uma plataforma inovadora que utiliza inteligência artificial para automatizar prescrições nutricionais, atendimento ao cliente e prospecção de novos pacientes. Nossa missão é otimizar o tempo dos nutricionistas, permitindo que eles se concentrem no que realmente importa: a saúde dos seus pacientes.

## ✨ Funcionalidades Principais

- 🤖 **Prescrições Automáticas**: IA avançada que cria dietas personalizadas
- 💬 **Chatbot 24/7**: Atendimento automático via WhatsApp e Instagram
- 📈 **Prospecção Automática**: Encontre e atraia novos pacientes automaticamente
- 📊 **Relatórios Detalhados**: Dashboards completos para gestão do consultório
- 🔄 **Integração Fácil**: Conecte com suas ferramentas favoritas em minutos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Animações**: Framer Motion
- **Ícones**: Lucide React
- **Deploy**: Vercel

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Kmzf777/nutrimatic.git
   cd nutrimatic
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Execute o projeto em desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse o projeto**
   ```
   http://localhost:3000
   ```

## 🚀 Deploy na Vercel

### Deploy Automático

1. Conecte seu repositório GitHub à Vercel
2. A Vercel detectará automaticamente que é um projeto Next.js
3. Configure as variáveis de ambiente se necessário
4. Deploy automático a cada push para a branch `main`

### Deploy Manual

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login na Vercel
vercel login

# Deploy
vercel
```

## 📁 Estrutura do Projeto

```
nutrimatic/
├── public/                 # Arquivos estáticos
│   ├── Nutrimatic Logo PNG.png
│   └── Nutrimatic Icon Vetor.png
├── src/
│   ├── app/               # App Router (Next.js 13+)
│   │   ├── globals.css    # Estilos globais
│   │   ├── layout.tsx     # Layout principal
│   │   └── page.tsx       # Página inicial
│   └── components/        # Componentes React
│       ├── sections/      # Seções da landing page
│       └── ui/            # Componentes de UI
├── tailwind.config.ts     # Configuração do Tailwind
├── next.config.ts         # Configuração do Next.js
└── package.json           # Dependências e scripts
```

## 🎨 Design System

### Cores Principais
- **Nutrimatic Green**: `#10b981` (Primary)
- **Dark Green**: `#065f46` (Secondary)
- **Blue**: `#3b82f6` (Accent)
- **Gray Scale**: `#111827` to `#f9fafb`

### Tipografia
- **Fonte Principal**: Inter (Google Fonts)
- **Tamanhos**: Responsivos com clamp()

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
npm run type-check   # Verificação de tipos TypeScript
```

## 🌟 Características Técnicas

- **Performance**: Otimizado com Next.js 15
- **SEO**: Meta tags e Open Graph configurados
- **Acessibilidade**: ARIA labels e navegação por teclado
- **Animações**: Transições suaves com Framer Motion
- **Loading**: Estados de carregamento otimizados

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

- **Website**: [nutrimatic.com](https://nutrimatic.com)
- **Email**: contato@nutrimatic.com
- **GitHub**: [@Kmzf777](https://github.com/Kmzf777)

---

Desenvolvido com ❤️ pela equipe Nutrimatic
