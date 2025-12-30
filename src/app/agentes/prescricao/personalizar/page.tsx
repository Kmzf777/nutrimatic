'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardPageLayout, { DashboardButton, DashboardInput, DashboardSelect } from '@/components/dashboard/DashboardPageLayout';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  GripVertical, 
  CheckSquare, 
  Type, 
  Hash, 
  List, 
  AlignLeft,
  Eye,
  Save
} from 'lucide-react';

type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'textarea';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

const initialFields: FormField[] = [];

export default function PersonalizarFormularioPage() {
  const router = useRouter();
  const { nutricionista } = useAuth();
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [formTitle, setFormTitle] = useState("Anamnese Nutricional");
  const [formDescription, setFormDescription] = useState("Preencha com seus dados para gerarmos sua prescrição.");
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTemplate() {
      if (!nutricionista?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('anamnesis_templates')
          .select('*')
          .eq('nutricionista_id', nutricionista.id)
          .single();

        if (data) {
          setTemplateId(data.id);
          setFormTitle(data.title);
          if (data.description) setFormDescription(data.description);
          if (Array.isArray(data.questions) && data.questions.length > 0) {
            setFields(data.questions as FormField[]);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar template:', error);
      }
    }
    fetchTemplate();
  }, [nutricionista?.id]);

  const handleSave = async () => {
    if (!nutricionista?.id) {
        alert('Erro: Nutricionista não identificado. Tente fazer login novamente.');
        return;
    }
    
    setSaving(true);
    try {
        const payload = {
            title: formTitle,
            description: formDescription,
            questions: fields,
            nutricionista_id: nutricionista.id,
            ...(templateId ? { id: templateId } : {})
        };

        const { data, error } = await supabase
            .from('anamnesis_templates')
            .upsert(payload)
            .select()
            .single();

        if (error) throw error;
        
        if (data) {
            setTemplateId(data.id);
            alert('Formulário salvo com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar formulário.');
    } finally {
        setSaving(false);
    }
  };

  const handleAddField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'Nova Pergunta',
      required: false,
      placeholder: ''
    };
    setFields([...fields, newField]);
    setActiveFieldId(newField.id);
  };

  const handleUpdateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => field.id === id ? { ...field, ...updates } : field));
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    if (activeFieldId === id) setActiveFieldId(null);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === fields.length - 1)
    ) return;

    const newFields = [...fields];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[swapIndex]] = [newFields[swapIndex], newFields[index]];
    setFields(newFields);
  };

  const handleOptionChange = (fieldId: string, optionIndex: number, value: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    const newOptions = [...field.options];
    newOptions[optionIndex] = value;
    handleUpdateField(fieldId, { options: newOptions });
  };

  const handleAddOption = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    
    const newOptions = [...(field.options || []), `Opção ${(field.options?.length || 0) + 1}`];
    handleUpdateField(fieldId, { options: newOptions });
  };

  const handleRemoveOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field || !field.options) return;

    const newOptions = field.options.filter((_, idx) => idx !== optionIndex);
    handleUpdateField(fieldId, { options: newOptions });
  };

  const getIconForType = (type: FieldType) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'number': return <Hash className="w-4 h-4" />;
      case 'select': return <List className="w-4 h-4" />;
      case 'checkbox': return <CheckSquare className="w-4 h-4" />;
      case 'textarea': return <AlignLeft className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPageLayout 
          title="Construtor de Formulário" 
          subtitle="Personalize as perguntas do formulário de anamnese"
          actions={
            <div className="flex gap-2">
               <DashboardButton 
                variant="secondary" 
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Voltar à Edição' : 'Visualizar'}
              </DashboardButton>
              <DashboardButton 
                variant="primary" 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Salvando...' : 'Salvar'}
              </DashboardButton>
            </div>
          }
        >
          {/* Back Button */}
          <button 
            onClick={() => router.push('/agentes/prescricao')}
            className="mb-4 flex items-center text-sm text-gray-500 hover:text-nutrimatic-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar para Agente
          </button>

          {previewMode ? (
             <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-8 border-b pb-4">
                  <h1 className="text-3xl font-bold text-gray-900">Anamnese Nutricional</h1>
                  <p className="text-gray-500 mt-2">Preencha com seus dados para gerarmos sua prescrição.</p>
                </div>
                
                <div className="space-y-6">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      
                      {field.type === 'text' && (
                        <input 
                          type="text" 
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500/20 focus:border-nutrimatic-500"
                        />
                      )}

                      {field.type === 'number' && (
                        <input 
                          type="number" 
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500/20 focus:border-nutrimatic-500"
                        />
                      )}

                      {field.type === 'textarea' && (
                         <textarea 
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500/20 focus:border-nutrimatic-500"
                        />
                      )}

                      {field.type === 'select' && (
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nutrimatic-500/20 focus:border-nutrimatic-500">
                          <option value="">Selecione uma opção</option>
                          {field.options?.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {field.type === 'checkbox' && (
                        <div className="space-y-2 mt-2">
                          {field.options?.map((opt, idx) => (
                            <div key={idx} className="flex items-center">
                              <input 
                                type="checkbox" 
                                id={`${field.id}-${idx}`}
                                className="h-4 w-4 text-nutrimatic-600 focus:ring-nutrimatic-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`${field.id}-${idx}`} className="ml-2 block text-sm text-gray-900">
                                {opt}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-6">
                    <button className="w-full bg-nutrimatic-600 text-white py-3 rounded-lg font-medium shadow-sm opacity-50 cursor-not-allowed">
                      Enviar Formulário
                    </button>
                  </div>
                </div>
             </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4 pb-20">
              {/* Card de Título e Descrição do Formulário */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 mb-8 border-t-8 border-t-nutrimatic-600">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Título do Formulário</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full text-2xl font-bold text-gray-900 border-b border-gray-200 focus:border-nutrimatic-500 outline-none pb-2 placeholder-gray-300"
                    placeholder="Título do Formulário"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Descrição</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={2}
                    className="w-full text-gray-600 border-b border-gray-200 focus:border-nutrimatic-500 outline-none pb-2 resize-none placeholder-gray-300"
                    placeholder="Descrição do formulário"
                  />
                </div>
              </div>

              {fields.map((field, index) => {
                const isActive = activeFieldId === field.id;

                return (
                  <div 
                    key={field.id}
                    className={`bg-white rounded-xl border transition-all duration-200 ${
                      isActive 
                        ? 'border-nutrimatic-500 shadow-md ring-1 ring-nutrimatic-500/20' 
                        : 'border-gray-200 shadow-sm hover:border-gray-300'
                    }`}
                    onClick={() => setActiveFieldId(field.id)}
                  >
                    {/* Header do Card (sempre visível) */}
                    {/* Se não estiver ativo, mostra resumo. Se estiver ativo, mostra edição. */}
                    
                    {!isActive ? (
                       <div className="p-6 flex items-start gap-4 cursor-pointer">
                          <div className="mt-1 text-gray-400">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900">{field.label}</h3>
                            {field.required && <span className="text-xs text-red-500 font-medium">* Obrigatório</span>}
                            <div className="mt-1 flex items-center gap-2">
                              {getIconForType(field.type)}
                              <span className="text-xs text-gray-500 uppercase">{field.type}</span>
                            </div>
                          </div>
                       </div>
                    ) : (
                      <div className="p-6 space-y-6">
                        <div className="flex gap-4">
                          <div className="flex-1 space-y-4">
                            {/* Primeira linha: Pergunta e Tipo */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Título da Pergunta</label>
                                <input
                                  type="text"
                                  value={field.label}
                                  onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                                  className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-nutrimatic-500 outline-none transition-colors font-medium text-gray-900"
                                  placeholder="Ex: Qual seu nome?"
                                  autoFocus
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tipo de Resposta</label>
                                <div className="relative">
                                  <select
                                    value={field.type}
                                    onChange={(e) => handleUpdateField(field.id, { type: e.target.value as FieldType })}
                                    className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 focus:border-nutrimatic-500 outline-none appearance-none font-medium text-gray-700"
                                  >
                                    <option value="text">Texto Curto</option>
                                    <option value="textarea">Parágrafo</option>
                                    <option value="number">Número</option>
                                    <option value="select">Múltipla Escolha</option>
                                    <option value="checkbox">Caixas de Seleção</option>
                                  </select>
                                  <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                                    {getIconForType(field.type)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Configurações específicas por tipo */}
                            {(field.type === 'text' || field.type === 'number' || field.type === 'textarea') && (
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Texto de Exemplo (Placeholder)</label>
                                <input
                                  type="text"
                                  value={field.placeholder || ''}
                                  onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                  placeholder="Texto que aparece antes de digitar..."
                                />
                              </div>
                            )}

                            {(field.type === 'select' || field.type === 'checkbox') && (
                              <div className="space-y-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Opções</label>
                                {field.options?.map((option, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => handleOptionChange(field.id, idx, e.target.value)}
                                      className="flex-1 p-2 border-b border-gray-200 focus:border-nutrimatic-500 outline-none text-sm"
                                    />
                                    <button 
                                      onClick={() => handleRemoveOption(field.id, idx)}
                                      className="text-gray-400 hover:text-red-500 p-1"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => handleAddOption(field.id)}
                                  className="flex items-center gap-2 text-sm text-nutrimatic-600 hover:text-nutrimatic-700 font-medium mt-2 pl-1"
                                >
                                  <Plus className="w-4 h-4" />
                                  Adicionar opção
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer do Card de Edição */}
                        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-end gap-4">
                           <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={field.required}
                                  onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                                  className="w-4 h-4 text-nutrimatic-600 rounded focus:ring-nutrimatic-500"
                                />
                                Obrigatório
                              </label>
                           </div>
                           
                           <div className="flex items-center gap-1">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleMoveField(index, 'up'); }}
                                disabled={index === 0}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full disabled:opacity-30"
                                title="Mover para cima"
                              >
                                <MoveUp className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleMoveField(index, 'down'); }}
                                disabled={index === fields.length - 1}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full disabled:opacity-30"
                                title="Mover para baixo"
                              >
                                <MoveDown className="w-5 h-5" />
                              </button>
                           </div>

                           <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteField(field.id); }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full ml-2"
                              title="Excluir"
                           >
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex justify-center pt-4">
                 <button
                    onClick={handleAddField}
                    className="flex items-center gap-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 hover:border-nutrimatic-500 hover:text-nutrimatic-600 px-6 py-3 rounded-full font-medium transition-all shadow-sm hover:shadow-md"
                 >
                    <Plus className="w-5 h-5" />
                    Adicionar Nova Pergunta
                 </button>
              </div>
            </div>
          )}

        </DashboardPageLayout>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
