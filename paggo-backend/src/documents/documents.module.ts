import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { OcrModule } from '../ocr/ocr.module';
import { LlmModule } from '../llm/llm.module'; // <--- 1. Importar aqui
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PrismaModule,
    OcrModule,
    LlmModule, // <--- 2. Adicionar aqui
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}