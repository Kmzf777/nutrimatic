'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton } from '@/components/dashboard/DashboardPageLayout';
import { useState } from 'react';
import { Bot, Save, RefreshCw, Settings, MessageSquare, Brain, Zap, FileText } from 'lucide-react';

interface AgentConfig {
  name: string;
  personality: string;
  expertise: string;
  tone: string;
  language: string;
  responseLength: 'short' | 'medium' | 'long';
  enableMemory: boolean;
  enableLearning: boolean;
  customPrompt: string;
}

export default function AgenteIA() {
  const [config, setConfig] = useState<AgentConfig>({
    name: 'NutriBot',
    personality: 'Profissional e amigável',
    expertise: 'Nutrição e saúde',
    tone: 'Educativo e motivacional',
    language: 'Português',
    responseLength: 'medium',
    enableMemory: true,
    enableLearning: true,
    customPrompt: 'Você é um assistente nutricional especializado em ajudar pessoas a alcançarem seus objetivos de saúde através de uma alimentação balanceada e personalizada. Sempre seja educativo, motivacional e baseie suas respostas em evidências científicas.',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    {
      id: 'nutritionist',
      name: 'Nutricionista',
      description: 'Especialista em nutrição e saúde',
      prompt: 'Você é um nutricionista especializado em ajudar pessoas a alcançarem seus objetivos de saúde através de uma alimentação balanceada e personalizada. Sempre seja educativo, motivacional e baseie suas respostas em evidências científicas. Forneça orientações práticas e realistas, considerando as preferências e restrições alimentares de cada pessoa.',
      icon: '🥗'
    },
    {
      id: 'personal-trainer',
      name: 'Personal Trainer',
      description: 'Especialista em fitness e exercícios',
      prompt: 'Você é um personal trainer experiente e motivador, especializado em criar programas de exercícios personalizados e orientar pessoas em suas jornadas de fitness. Sempre priorize a segurança, forneça instruções claras e motive seus clientes a alcançarem seus objetivos de forma sustentável.',
      icon: '💪'
    },
    {
      id: 'health-coach',
      name: 'Health Coach',
      description: 'Coach de saúde e bem-estar',
      prompt: 'Você é um health coach holístico que ajuda pessoas a transformarem seus hábitos e estilo de vida para melhorar sua saúde geral. Aborde aspectos físicos, mentais e emocionais, fornecendo orientações práticas e motivacionais para mudanças duradouras.',
      icon: '🧘'
    },
    {
      id: 'medical-assistant',
      name: 'Assistente Médico',
      description: 'Assistente para informações médicas',
      prompt: 'Você é um assistente médico que fornece informações educativas sobre saúde e bem-estar. Sempre esclareça que não substitui consultas médicas e oriente as pessoas a procurarem profissionais de saúde quando necessário. Baseie suas respostas em evidências científicas.',
      icon: '🏥'
    },
    {
      id: 'fitness-nutrition',
      name: 'Fitness & Nutrição',
      description: 'Especialista em fitness e nutrição',
      prompt: 'Você é um especialista em fitness e nutrição, combinando conhecimentos sobre exercícios e alimentação para ajudar pessoas a alcançarem seus objetivos de saúde e fitness. Forneça orientações integradas e práticas para uma abordagem completa ao bem-estar.',
      icon: '🏃'
    },
    {
      id: 'wellness-advisor',
      name: 'Consultor de Bem-estar',
      description: 'Consultor de bem-estar e qualidade de vida',
      prompt: 'Você é um consultor de bem-estar focado em melhorar a qualidade de vida das pessoas através de orientações sobre saúde mental, física e emocional. Aborde temas como stress, sono, alimentação e equilíbrio pessoal de forma holística e acolhedora.',
      icon: '✨'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleReset = async () => {
    setIsLoading(true);
    // Simular reset
    await new Promise(resolve => setTimeout(resolve, 500));
    setConfig({
      name: 'NutriBot',
      personality: 'Profissional e amigável',
      expertise: 'Nutrição e saúde',
      tone: 'Educativo e motivacional',
      language: 'Português',
      responseLength: 'medium',
      enableMemory: true,
      enableLearning: true,
      customPrompt: 'Você é um assistente nutricional especializado em ajudar pessoas a alcançarem seus objetivos de saúde através de uma alimentação balanceada e personalizada. Sempre seja educativo, motivacional e baseie suas respostas em evidências científicas.',
    });
    setIsLoading(false);
  };

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setConfig({
      ...config,
      customPrompt: template.prompt,
      name: template.name,
      expertise: template.description,
    });
    setShowTemplates(false);
  };

  return (
    <DashboardLayout>
      <DashboardPageLayout
        title="Agente IA"
        subtitle="Personalize o comportamento e características do seu assistente virtual"
        actions={
          <div className="flex items-center space-x-3">
            <DashboardButton
              onClick={handleReset}
              disabled={isLoading}
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Resetar
            </DashboardButton>
            <DashboardButton
              onClick={handleSave}
              disabled={isSaving}
              variant="primary"
              size="sm"
            >
              <Save className={`w-4 h-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </DashboardButton>
          </div>
        }
      >
        {/* Configurações Básicas */}
        <ContentCard
          title="Configurações Básicas"
          subtitle="Defina as características fundamentais do seu agente"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Agente
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-transparent transition-all duration-300"
                placeholder="Digite o nome do agente"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma
              </label>
              <select
                value={config.language}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setConfig({ ...config, language: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-transparent transition-all duration-300"
              >
                <option value="Português">Português</option>
                <option value="English">English</option>
                <option value="Español">Español</option>
              </select>
            </div>
          </div>
        </ContentCard>

        {/* Personalidade e Comportamento */}
        <ContentCard
          title="Personalidade e Comportamento"
          subtitle="Configure como o agente se comunica e interage"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personalidade
              </label>
              <textarea
                value={config.personality}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConfig({ ...config, personality: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-transparent transition-all duration-300"
                placeholder="Descreva a personalidade do agente..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área de Especialização
              </label>
              <textarea
                value={config.expertise}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConfig({ ...config, expertise: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-transparent transition-all duration-300"
                placeholder="Descreva as áreas de conhecimento do agente..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tom de Comunicação
              </label>
              <select
                value={config.tone}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setConfig({ ...config, tone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-transparent transition-all duration-300"
              >
                <option value="Educativo e motivacional">Educativo e motivacional</option>
                <option value="Profissional e formal">Profissional e formal</option>
                <option value="Amigável e casual">Amigável e casual</option>
                <option value="Técnico e detalhado">Técnico e detalhado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho das Respostas
              </label>
              <div className="flex space-x-4">
                {(['short', 'medium', 'long'] as const).map((length) => (
                  <label key={length} className="flex items-center">
                    <input
                      type="radio"
                      name="responseLength"
                      value={length}
                      checked={config.responseLength === length}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig({ ...config, responseLength: e.target.value as 'short' | 'medium' | 'long' })}
                      className="w-4 h-4 text-nutrimatic-600 border-gray-300 focus:ring-nutrimatic-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {length === 'short' ? 'Curta' : length === 'medium' ? 'Média' : 'Longa'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
                 </ContentCard>

         {/* Prompt Personalizado */}
         <ContentCard
           title="Prompt Personalizado"
           subtitle="Crie instruções específicas para o comportamento do seu agente"
         >
                       <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Instruções do Agente
                  </label>
                  <DashboardButton
                    onClick={() => setShowTemplates(true)}
                    variant="secondary"
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Templates
                  </DashboardButton>
                </div>
               <textarea
                 value={config.customPrompt}
                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConfig({ ...config, customPrompt: e.target.value })}
                 rows={8}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nutrimatic-500 focus:border-transparent transition-all duration-300 font-mono text-sm"
                 placeholder="Digite as instruções personalizadas para o seu agente..."
               />
               <p className="text-xs text-gray-500 mt-2">
                 Este prompt será usado como base para todas as respostas do agente. Seja específico sobre o comportamento, conhecimento e estilo de comunicação desejados.
               </p>
             </div>
             
             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
               <div className="flex items-start">
                 <div className="flex-shrink-0">
                   <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                   </svg>
                 </div>
                 <div className="ml-3">
                   <h3 className="text-sm font-medium text-blue-800">Dicas para um bom prompt:</h3>
                   <div className="mt-2 text-sm text-blue-700">
                     <ul className="list-disc list-inside space-y-1">
                       <li>Defina claramente o papel e especialização do agente</li>
                       <li>Especifique o tom de comunicação desejado</li>
                       <li>Inclua diretrizes sobre o que o agente deve e não deve fazer</li>
                       <li>Mencione fontes de conhecimento ou metodologias específicas</li>
                       <li>Adicione exemplos de como responder em diferentes situações</li>
                     </ul>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </ContentCard>

         {/* Recursos Avançados */}
        <ContentCard
          title="Recursos Avançados"
          subtitle="Configure funcionalidades avançadas do agente"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-200/30">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-nutrimatic-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Memória de Conversas</h3>
                  <p className="text-sm text-gray-500">O agente lembra de conversas anteriores</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableMemory}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig({ ...config, enableMemory: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-nutrimatic-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nutrimatic-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-200/30">
              <div className="flex items-center">
                <Brain className="w-5 h-5 text-nutrimatic-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Aprendizado Contínuo</h3>
                  <p className="text-sm text-gray-500">O agente melhora com base nas interações</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableLearning}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig({ ...config, enableLearning: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-nutrimatic-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nutrimatic-600"></div>
              </label>
            </div>
          </div>
        </ContentCard>

        {/* Preview do Agente */}
        <ContentCard
          title="Preview do Agente"
          subtitle="Veja como seu agente se comportará"
        >
          <div className="bg-gradient-to-br from-nutrimatic-50 to-white p-6 rounded-xl border border-nutrimatic-200/50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-nutrimatic-500 rounded-full flex items-center justify-center mr-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{config.name}</h3>
                <p className="text-sm text-gray-500">Assistente IA</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg border border-gray-200/30">
                <p className="text-sm text-gray-600 mb-2">Exemplo de resposta:</p>
                <p className="text-gray-800">
                  "Olá! Sou o {config.name}, seu assistente especializado em {config.expertise.toLowerCase()}. 
                  Estou aqui para ajudá-lo com uma abordagem {config.tone.toLowerCase()}. 
                  Como posso ser útil hoje?"
                </p>
              </div>
              
                             <div className="text-xs text-gray-500 space-y-1">
                 <p><strong>Personalidade:</strong> {config.personality}</p>
                 <p><strong>Idioma:</strong> {config.language}</p>
                 <p><strong>Respostas:</strong> {config.responseLength === 'short' ? 'Curta' : config.responseLength === 'medium' ? 'Média' : 'Longa'}</p>
                 <p><strong>Memória:</strong> {config.enableMemory ? 'Ativada' : 'Desativada'}</p>
                 <p><strong>Aprendizado:</strong> {config.enableLearning ? 'Ativado' : 'Desativado'}</p>
                 <p><strong>Prompt personalizado:</strong> {config.customPrompt.length > 50 ? `${config.customPrompt.substring(0, 50)}...` : config.customPrompt}</p>
               </div>
            </div>
          </div>
                 </ContentCard>
       </DashboardPageLayout>

       {/* Modal de Templates */}
       {showTemplates && (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
             <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <div>
                 <h2 className="text-2xl font-bold text-gray-900">Templates de Agente</h2>
                 <p className="text-gray-600 mt-1">Escolha um template para personalizar seu agente</p>
               </div>
               <button
                 onClick={() => setShowTemplates(false)}
                 className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
             
             <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {templates.map((template) => (
                   <div
                     key={template.id}
                     className="border border-gray-200 rounded-lg p-4 hover:border-nutrimatic-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
                     onClick={() => handleTemplateSelect(template)}
                   >
                     <div className="flex items-start space-x-3">
                       <div className="text-2xl">{template.icon}</div>
                       <div className="flex-1">
                         <h3 className="font-semibold text-gray-900 group-hover:text-nutrimatic-600 transition-colors">
                           {template.name}
                         </h3>
                         <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                         <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                           {template.prompt}
                         </p>
                       </div>
                     </div>
                     <div className="mt-3 pt-3 border-t border-gray-100">
                       <span className="text-xs text-nutrimatic-600 font-medium">
                         Clique para usar este template
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         </div>
       )}
     </DashboardLayout>
   );
 } 