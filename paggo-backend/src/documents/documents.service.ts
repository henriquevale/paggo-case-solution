import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OcrService } from '../ocr/ocr.service';
import { LlmService } from '../llm/llm.service'; // Importar LLM

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private ocrService: OcrService,
    private llmService: LlmService, // Injetar LLM
  ) {}

  async create(file: Express.Multer.File, userId: string) {
    const extractedText = await this.ocrService.extractText(file.path);

    return this.prisma.document.create({
      data: {
        fileName: file.originalname,
        mimeType: file.mimetype,
        storagePath: file.path,
        extractedText: extractedText,
        userId: userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // NOVA FUNÇÃO: Chat com o Documento
  async chat(documentId: string, question: string, userId: string) {
    // 1. Buscar o documento e garantir que pertence ao usuário
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, userId: userId },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    if (!document.extractedText) {
      return { answer: 'Este documento ainda não tem texto extraído.' };
    }

    // 2. Perguntar ao Gemini
    const answer = await this.llmService.askQuestion(document.extractedText, question);

    // 3. Salvar a interação no banco (histórico)
    await this.prisma.lLMInteraction.create({
      data: {
        userPrompt: question,
        llmResponse: answer,
        documentId: document.id,
      },
    });

    return { answer };
  }
}