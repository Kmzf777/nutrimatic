'use client';

import { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Loader2, AlertTriangle, FileText, Eye } from 'lucide-react';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function PDFModal({ isOpen, onClose, url, title }: PDFModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [useProxy, setUseProxy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      setUseProxy(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExternalView = () => {
    window.open(url, '_blank');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleTryProxy = () => {
    setUseProxy(true);
    setHasError(false);
    setIsLoading(true);
  };

  const getIframeSrc = () => {
    if (useProxy) {
      return `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
    }
    return `${url}#toolbar=1&navpanes=1&scrollbar=1`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop com blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal com design moderno */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-6xl mx-auto my-8 max-h-[90vh] flex flex-col">
        {/* Header com gradiente - fixo */}
        <div className="bg-gradient-to-r from-nutrimatic-50 to-green-50 rounded-t-2xl p-6 border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-nutrimatic-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 font-display truncate">{title}</h2>
                <p className="text-sm text-gray-600 mt-1">Visualizando PDF da receita</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Baixar</span>
              </button>
              <button
                onClick={handleExternalView}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 hover:from-nutrimatic-600 hover:to-nutrimatic-700 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100/80 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* PDF Content - scrollável */}
        <div className="relative flex-1 bg-gray-50/50 min-h-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-200/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-nutrimatic-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {useProxy ? 'Carregando via Proxy' : 'Carregando PDF'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {useProxy ? 'Tentando carregar o documento de forma segura...' : 'Preparando o documento para visualização...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50 p-4">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-200/50 max-w-md w-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
                    PDF não pode ser exibido
                  </h3>
                  <p className="text-gray-600 mb-6">
                    O navegador bloqueou a exibição do PDF por questões de segurança. Tente uma das opções abaixo:
                  </p>
                  <div className="space-y-3">
                    {!useProxy && (
                      <button
                        onClick={handleTryProxy}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-colors"
                      >
                        🔧 Tentar via Proxy
                      </button>
                    )}
                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Baixar PDF</span>
                    </button>
                    <button
                      onClick={handleExternalView}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-nutrimatic-500 to-nutrimatic-600 hover:from-nutrimatic-600 hover:to-nutrimatic-700 text-white rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Abrir em Nova Aba</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <iframe
            src={getIframeSrc()}
            className="w-full h-full rounded-b-2xl"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title={title}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
          />
        </div>
      </div>
    </div>
  );
} 