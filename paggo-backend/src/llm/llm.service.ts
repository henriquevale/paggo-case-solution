import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class LlmService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    
    if (apiKey) console.log(`✅ Chave Gemini em uso: ${apiKey.substring(0, 8)}...`);

    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // CORREÇÃO: Usamos 'gemini-2.0-flash' pois ele ESTÁ na sua lista de modelos permitidos.
    // O erro 404 acontecia porque sua conta não tinha acesso ao 1.5.
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async askQuestion(documentText: string, userQuestion: string): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return 'Erro: Chave não configurada no .env';
      }

      const prompt = `Texto do documento: """${documentText}""" \n\n Pergunta: ${userQuestion}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Erro detalhado do Gemini:', error);
      return `Erro Google: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
}