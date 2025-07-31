'use client';

import { useState } from 'react';
import { X, FileText, CheckCircle, XCircle, Send, Eye, Clock, AlertCircle } from 'lucide-react';
import { useWebhooks } from '@/hooks/useWebhooks';

interface RecipeApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: {
    id: string;
    nome: string;
    url: string;
  } | null;
  onApprove?: (recipeId: string) => void;
  onReject?: (recipeId: string, observation: string) => void;
}

export default function RecipeApprovalModal({ 
  isOpen, 
  onClose, 
  recipe, 
  onApprove, 
  onReject 
}: RecipeApprovalModalProps) {
  const [showObservation, setShowObservation] = useState(false);
  const [observation, setObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendRecipeStatusWebhook } = useWebhooks();

  if (!isOpen || !recipe) return null;

  const handleApprove = async () => {
    if (onApprove) {
      setIsSubmitting(true);
      try {
        // Disparar webhook de aprovação (sem aguardar resposta)
        sendRecipeStatusWebhook(recipe, 'approve');
        
        // Executar a função de aprovação
        await onApprove(recipe.id);
        onClose();
      } catch (error) {
        console.error('Erro ao aprovar receita:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReject = async () => {
    if (onReject) {
      setIsSubmitting(true);
      try {
        // Disparar webhook de reprovação (sem aguardar resposta)
        sendRecipeStatusWebhook(recipe, 'reject', observation);
        
        // Executar a função de reprovação
        await onReject(recipe.id, observation);
        onClose();
      } catch (error) {
        console.error('Erro ao reprovar receita:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOpenPDF = () => {
    window.open(recipe.url, '_blank');
  };

  const handleClose = () => {
    setShowObservation(false);
    setObservation('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop com blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      {/* Modal com design moderno */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-lg mx-auto my-8 max-h-[90vh] flex flex-col">
        {/* Header com gradiente - fixo */}
        <div className="bg-gradient-to-r from-nutrimatic-50 to-white rounded-t-2xl p-6 border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-nutrimatic-500 to-nutrimatic-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-display">Avaliar Receita</h2>
                <p className="text-sm text-gray-600 mt-1">{recipe.nome}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100/80 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - scrollável */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Seção 1: Visualizar PDF */}
          <div className="bg-gradient-to-r from-nutrimatic-50 to-green-50 rounded-xl p-5 border border-nutrimatic-200/50">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-nutrimatic-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-nutrimatic-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-nutrimatic-900 mb-2">Visualizar Receita</h3>
                <p className="text-sm text-nutrimatic-700 mb-4">
                  Abra o PDF da receita para avaliar o conteúdo antes de aprovar ou reprovar
                </p>
                <button
                  onClick={handleOpenPDF}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-nutrimatic-600 text-white rounded-lg hover:bg-nutrimatic-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Abrir PDF da Receita</span>
                </button>
              </div>
            </div>
          </div>

          {/* Seção 2: Aprovar/Reprovar */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-200/50">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-nutrimatic-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-nutrimatic-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Avaliação da Receita</h3>
                <p className="text-sm text-gray-600">
                  Após visualizar o PDF, escolha se aprova ou reprova a receita
                </p>
              </div>
            </div>
            
            {!showObservation ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Aprovar</span>
                </button>
                <button
                  onClick={() => setShowObservation(true)}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Reprovar</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200/50">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900 mb-1">Observação Obrigatória</h4>
                      <p className="text-sm text-red-700">
                        Para reprovar uma receita, é necessário fornecer uma justificativa
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="observation" className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo da Reprovação
                  </label>
                  <textarea
                    id="observation"
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="Descreva o motivo da reprovação da receita..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all duration-300"
                    rows={4}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowObservation(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isSubmitting || !observation.trim()}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirmar Reprovação</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isSubmitting && (
            <div className="bg-nutrimatic-50 rounded-xl p-4 border border-nutrimatic-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-nutrimatic-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-nutrimatic-700 font-medium">
                  Processando sua avaliação e enviando notificações...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 