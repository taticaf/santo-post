
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { GeneratorForm } from './components/GeneratorForm';
import { ImageResult } from './components/ImageResult';
import { History } from './components/History';
import { GeneratedPost, GenerationStatus } from './types';
import { generateCatholicPost } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(null);
  const [history, setHistory] = useState<GeneratedPost[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('santopost_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = useCallback((post: GeneratedPost) => {
    setHistory(prev => {
      const updated = [post, ...prev].slice(0, 10);
      localStorage.setItem('santopost_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleGenerate = async (bibleText: string, phrase: string) => {
    setStatus('checking-key');
    setErrorMsg(null);

    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }

      setStatus('generating');
      const imageUrl = await generateCatholicPost(bibleText, phrase);
      
      const newPost: GeneratedPost = {
        id: crypto.randomUUID(),
        imageUrl,
        bibleText,
        phrase,
        timestamp: Date.now()
      };

      setCurrentPost(newPost);
      saveToHistory(newPost);
      setStatus('success');
    } catch (error: any) {
      console.error("Erro capturado no App:", error);
      
      if (error.message === 'KEY_NOT_FOUND') {
        setErrorMsg("Sua chave de API não tem permissão para este modelo. Certifique-se de usar uma chave de um projeto com faturamento ativo em ai.google.dev/gemini-api/docs/billing");
        // Abre o seletor novamente para o usuário tentar outra chave
        await window.aistudio.openSelectKey();
      } else {
        setErrorMsg(error.message || "Ocorreu um erro inesperado. Tente novamente.");
      }
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-4 py-8">
      <Header />
      
      <main className="flex-grow mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
              <h2 className="text-2xl font-bold mb-4 text-orange-900">Nova Criação</h2>
              <GeneratorForm onGenerate={handleGenerate} isLoading={status === 'generating' || status === 'checking-key'} />
            </div>

            {history.length > 0 && (
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="w-full py-3 px-4 rounded-xl bg-orange-50 text-orange-700 font-semibold hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
              >
                {showHistory ? 'Esconder Histórico' : 'Ver Criações Anteriores'}
              </button>
            )}
          </section>

          <section className="space-y-6">
            {status === 'generating' && (
              <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-2xl border-2 border-dashed border-orange-200 animate-pulse">
                <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-orange-900 font-medium">Inspirando a IA...</p>
                <p className="text-gray-500 text-sm mt-2 text-center px-6">Estamos criando uma arte sacra única para você. Isso pode levar alguns segundos.</p>
              </div>
            )}

            {(status === 'success' || status === 'idle') && currentPost && (
              <ImageResult post={currentPost} />
            )}

            {status === 'error' && (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-700 text-center">
                <p className="font-semibold">{errorMsg}</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-sm underline hover:text-red-900"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {status === 'idle' && !currentPost && (
              <div className="flex flex-col items-center justify-center h-[500px] bg-orange-50/50 rounded-2xl border-2 border-dashed border-orange-100 text-orange-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-medium">Sua arte aparecerá aqui</p>
              </div>
            )}
          </section>
        </div>

        {showHistory && (
          <History posts={history} onSelect={setCurrentPost} />
        )}
      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© 2024 SantoPost. Elevando a evangelização digital.</p>
        <p className="mt-1">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500">
            Dificuldades com a chave? Saiba mais sobre o faturamento.
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
