# Nutrimatic - Plataforma de IA para Nutricionistas

![Nutrimatic Logo](public/Nutrimatic%20Logo%20PNG.png)

## 🚀 Sobre o Projeto

A **Nutrimatic** é uma plataforma inovadora que utiliza inteligência artificial para automatizar prescrições nutricionais, atendimento ao cliente e prospecção de novos pacientes. Nossa missão é otimizar o tempo dos nutricionistas, permitindo que eles se concentrem no que realmente importa: a saúde dos seus pacientes.

## ✨ Funcionalidades Principais

- 🤖 **Prescrições Automáticas**: IA avançada que cria dietas personalizadas
- 🤖 **Atendimento Automatizado**: Sistema inteligente para gestão de clientes
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

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```



6. **Execute o projeto em desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

7. **Acesse o projeto**
   ```
   http://localhost:3000
   ```

## 🔧 Correção de Problemas

### Erro "Formato de resposta inválido ou QR Code não encontrado"

Este erro foi corrigido nas seguintes versões:



3. **Adicionado logs detalhados** para debug


### Solução de Problemas Comuns



2. **Variáveis de ambiente não configuradas**
   - Verifique se o arquivo `.env.local` existe
   - Confirme se as variáveis estão corretas
   - Reinicie o servidor após alterações



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
│   │   ├── api/           # API Routes
│   
│   │   │   └── n8n/       # n8n integration
│   │   ├── globals.css    # Estilos globais
│   │   ├── layout.tsx     # Layout principal
│   │   └── page.tsx       # Página inicial
│   ├── components/        # Componentes React
│   │   ├── dashboard/     # Componentes do dashboard
│   │   ├── sections/      # Seções da landing page
│   │   └── ui/            # Componentes de UI
│   ├── hooks/             # Custom hooks
│   └── lib/               # Bibliotecas e configurações
├── tailwind.config.ts     # Configuração do Tailwind
├── next.config.ts         # Configuração do Next.js

├── ENVIRONMENT_SETUP.md   # Documentação de configuração
└── package.json           # Dependências e scripts
```

## 📚 Documentação Adicional



- `ENVIRONMENT_SETUP.md` - Configuração de variáveis de ambiente
- `FONTE_MUSEOMODERNO.md` - Informações sobre a fonte utilizada

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@nutrimatic.com ou abra uma issue no GitHub.
