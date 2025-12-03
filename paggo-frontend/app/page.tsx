"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Lock, Mail, User, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Alterna entre Login e Cadastro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // URL do Backend (ajuste se a porta mudar)
    //const API_URL = "http://localhost:3000";
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    try {
      if (isLogin) {
        // --- LÓGICA DE LOGIN ---
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        // Salva o token no LocalStorage para usar depois
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("userName", response.data.user.name || "Usuário");
        
        // Redireciona para o Dashboard
        router.push("/dashboard");

      } else {
        // --- LÓGICA DE CADASTRO ---
        await axios.post(`${API_URL}/auth/register`, {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });

        // Se der certo, faz login automático ou pede para logar
        alert("Conta criada com sucesso! Faça login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        "Erro ao conectar com o servidor. Verifique se o backend está rodando."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Paggo OCR</h1>
          <p className="text-gray-500">
            {isLogin ? "Bem-vindo de volta!" : "Crie sua conta grátis"}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nome (Só aparece no cadastro) */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Seu Nome"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                required={!isLogin}
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
              required
            />
          </div>

          {/* Senha */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Sua senha"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
              required
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="p-3 bg-red-100 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Botão de Ação */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {isLogin ? "Entrar" : "Criar Conta"}
                <ArrowRight className="ml-2" size={20} />
              </>
            )}
          </button>
        </form>

        {/* Rodapé (Trocar Login/Cadastro) */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? "Cadastre-se" : "Faça Login"}
          </button>
        </div>
      </div>
    </div>
  );
}