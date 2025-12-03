"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  LogOut, UploadCloud, FileText, Loader2, MessageSquare, Trash2 
} from "lucide-react";

// Definição do Tipo de Documento
interface Document {
  id: string;
  fileName: string;
  extractedText: string | null;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState("");

  //const API_URL = "http://localhost:3000";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  // Ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");

    if (!token) {
      router.push("/"); // Chuta para fora se não tiver token
      return;
    }

    setUserName(storedName || "Usuário");
    fetchDocuments(token);
  }, []);

  // Busca lista de documentos
  const fetchDocuments = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocs(response.data);
    } catch (error) {
      console.error("Erro ao buscar documentos", error);
      // Se der erro de auth, desloga
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Faz Upload de Arquivo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        },
      });
      // Recarrega a lista após sucesso
      if (token) fetchDocuments(token);
    } catch (error) {
      alert("Erro ao enviar arquivo.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra Superior */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <FileText /> Meus Documentos
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Olá, <strong>{userName}</strong></span>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-5xl mx-auto mt-8 p-4">
        
        {/* Área de Upload */}
        <div className="mb-8">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="animate-spin" /> Processando OCR...
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 mb-2 text-blue-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clique para enviar</span> uma fatura ou arraste aqui
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG ou PDF (Imagens)</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Lista de Documentos */}
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Recentes</h2>
        
        {loading ? (
          <div className="text-center py-10 text-gray-400">Carregando...</div>
        ) : docs.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-400">Nenhum documento encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => (
              <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-800 truncate" title={doc.fileName}>
                  {doc.fileName}
                </h3>
                
                <p className="text-sm text-gray-500 mt-2 line-clamp-3 h-12">
                  {doc.extractedText || "Sem texto extraído..."}
                </p>

                <button 
                  onClick={() => router.push(`/dashboard/${doc.id}`)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition text-sm"
                >
                  <MessageSquare size={16} /> Conversar com IA
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}