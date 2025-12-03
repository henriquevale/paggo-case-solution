import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita CORS para aceitar conexões do Frontend (Vercel)
  app.enableCors();
  
  // CORREÇÃO CRÍTICA DO RENDER:
  // Usa a variável PORT do sistema (Render) OU 3000 (Local)
  // '0.0.0.0' é necessário para aceitar conexões externas no Render
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();