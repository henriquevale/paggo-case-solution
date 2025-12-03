import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module'; // 1. Importação necessária
import { OcrModule } from './ocr/ocr.module';
import { DocumentsModule } from './documents/documents.module';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. O PrismaModule PRECISA estar aqui para inicializar o banco
    PrismaModule, 
    UsersModule,
    AuthModule,
    OcrModule,
    DocumentsModule,
    LlmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}