import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  
  async extractText(imagePath: string): Promise<string> {
    try {
      console.log(`🔍 Iniciando Tesseract na imagem: ${imagePath}`);
      
      const result = await Tesseract.recognize(
        imagePath,
        'eng', 
        { logger: m => {
            // Mostra o progresso apenas quando está reconhecendo texto
            if (m.status === 'recognizing text') {
               console.log(`Progresso: ${Math.round(m.progress * 100)}%`);
            }
        }}
      );

      return result.data.text || '';
    } catch (error) {
      console.error('❌ Erro no Tesseract:', error);
      throw new Error('Falha ao processar imagem localmente');
    }
  }
}