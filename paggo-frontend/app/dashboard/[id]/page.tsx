"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { 
  ArrowLeft, Send, Bot, User, FileText, Loader2, Download 
} from "lucide-react";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface Document {
  id: string;
  fileName: string;
  extractedText: string | null;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  
  const [doc, setDoc] = useState<Document | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingDoc, setFetchingDoc] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  //const API_URL = "http://localhost:3000";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  // 1. Carregar o documento e histórico (se houvesse)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    // Como não criamos uma rota específica para GET /documents/:id no backend,
    // vamos buscar todos e filtrar (solução rápida para o MVP).
    axios.get(`${API_URL}/documents`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      const foundDoc = response.data.find((d: Document) => d.id === documentId);
      if (foundDoc) {
        setDoc(foundDoc);
        // Mensagem inicial do Robô
        setMessages([{ 
          role: "bot", 
          content: `Olá! Analisei o documento "${foundDoc.fileName}". O que gostaria de saber sobre ele?` 
        }]);
      } else {
        alert("Documento não encontrado.");
        router.push("/dashboard");
      }
    })
    .catch(err => console.error(err))
    .finally(() => setFetchingDoc(false));
  }, [documentId, router]);

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. Enviar Pergunta
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuestion = input;
    setInput("");
    
    // Adiciona mensagem do usuário na tela imediatamente
    setMessages(prev => [...prev, { role: "user", content: userQuestion }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${API_URL}/documents/${documentId}/chat`,
        { question: userQuestion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Adiciona resposta do bot
      setMessages(prev => [...prev, { role: "bot", content: response.data.answer }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "bot", content: "Erro ao consultar a IA. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  };

  // 3. Gerar e Baixar Relatório
  const handleDownloadReport = () => {
    if (!doc) return;

    // Monta o conteúdo do arquivo de texto
    const content = [
      `RELATÓRIO PAGGO OCR`,
      `-------------------`,
      `Arquivo: ${doc.fileName}`,
      `ID: ${doc.id}`,
      `Gerado em: ${new Date().toLocaleString()}`,
      `\n===================\nTEXTO EXTRAÍDO (OCR)\n===================\n`,
      doc.extractedText || "(Sem texto extraído)",
      `\n===================\nHISTÓRICO DA CONVERSA (IA)\n===================\n`,
      messages.map(msg => `[${msg.role === 'user' ? 'VOCÊ' : 'IA'}]: ${msg.content}`).join('\n\n')
    ].join('\n');

    // Cria um Blob e dispara o download via link temporário
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio-${doc.fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (fetchingDoc) {
    return <div className="h-screen flex items-center justify-center text-blue-600"><Loader2 className="animate-spin" size={40}/></div>;
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      
      {/* Lado Esquerdo: Visualizador do Texto (OCR) */}
      <div className="w-full md:w-1/2 bg-white border-r border-gray-200 flex flex-col h-1/2 md:h-full">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-slate-50">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-blue-600">
            <ArrowLeft />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-blue-500" />
              {doc?.fileName}
            </h2>
            <p className="text-xs text-gray-400">Texto extraído pelo OCR</p>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 font-mono text-sm text-gray-700 whitespace-pre-wrap leading-relaxed shadow-inner">
          {doc?.extractedText || "Nenhum texto foi extraído desta imagem."}
        </div>
      </div>

      {/* Lado Direito: Chat com IA */}
      <div className="w-full md:w-1/2 flex flex-col h-1/2 md:h-full bg-white relative">
        <div className="p-4 border-b border-gray-100 bg-white shadow-sm z-10 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Bot className="text-purple-600" /> Assistente IA
            </h3>
            <p className="text-xs text-gray-500">Pergunte sobre valores, datas ou itens.</p>
          </div>

          {/* Botão de Download do Relatório */}
          <button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-blue-200"
            title="Baixar Texto + Histórico"
          >
            <Download size={14} />
            Relatório
          </button>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`p-2 rounded-full ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div 
                className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-400 text-xs ml-12">
              <Loader2 className="animate-spin" size={14} /> A IA está a pensar...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de Envio */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Qual é o valor total da nota?"
              className="w-full bg-gray-100 text-gray-800 placeholder-gray-400 border-0 rounded-full py-3 pl-5 pr-12 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}