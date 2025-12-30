'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { ContentCard, DashboardButton, DashboardInput } from '@/components/dashboard/DashboardPageLayout';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Check } from 'lucide-react';

export default function PrescricaoAgentPage() {
  const router = useRouter();
  const { nutricionista } = useAuth();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkTemplate() {
      if (!nutricionista?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('anamnesis_templates')
          .select('id')
          .eq('nutricionista_id', nutricionista.id)
          .single();

        if (data) {
          setTemplateId(data.id);
        }
      } catch (error) {
        // Ignore error if no row found (PGRST116 is 'The result contains 0 rows')
        // console.error('Error checking template:', error);
      } finally {
        setLoading(false);
      }
    }
    checkTemplate();
  }, [nutricionista?.id]);

  const formUrl = templateId 
    ? `forms.nutrimatic.com.br/${templateId}` 
    : "Você precisa criar um Formulário";

  const handleCopy = () => {
    if (!templateId) return;
    navigator.clipboard.writeText(`https://${formUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout 
          title="Agente de Prescrição" 
          subtitle="Configure e utilize seu agente de prescrição inteligente"
        >
          {/* Seção 1: Personalização do Formulário */}
          <ContentCard 
            title="Personalização do Formulário" 
            subtitle="Configure a URL do formulário de prescrição"
          >
            <div className="space-y-4 max-w-xl">
              <div>
                <label htmlFor="formUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  URL do Formulário
                </label>
                <div className="flex gap-2">
                  <DashboardInput 
                    id="formUrl"
                    type="text"
                    value={loading ? "Carregando..." : formUrl}
                    readOnly
                    className={!templateId && !loading ? "text-red-500 font-medium" : "text-gray-600"}
                  />
                  <button 
                    onClick={handleCopy}
                    disabled={!templateId || loading}
                    className="p-2 text-gray-500 hover:text-nutrimatic-600 border border-gray-200 rounded-lg hover:border-nutrimatic-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                    title="Copiar URL"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {templateId 
                    ? "Este é o link direto para o formulário que será utilizado pelo agente."
                    : "Configure seu formulário para gerar o link de acesso."
                  }
                </p>
              </div>
              
              <div className="pt-2">
                <DashboardButton onClick={() => router.push('/agentes/prescricao/personalizar')}>
                  {loading ? 'Carregando...' : (templateId ? 'Personalizar' : 'Criar Formulário')}
                </DashboardButton>
              </div>
            </div>
          </ContentCard>

          {/* Seção 2: AI Prescrição */}
          <ContentCard 
            title="AI Prescrição" 
            subtitle="Área de atuação do agente de prescrição"
          >
            <div className="min-h-[300px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
              <p className="text-gray-400 text-sm">Conteúdo da AI Prescrição em breve</p>
            </div>
          </ContentCard>

        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
