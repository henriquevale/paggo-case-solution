import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORREÇÃO CORS: Configuração explícita para aceitar o Frontend da Vercel
  app.enableCors({
    origin: '*', // Aceita requisições de qualquer lugar (Vercel, Localhost, etc)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  
  // CORREÇÃO PORTA: Pega a porta do Render ou usa 3000
  const port = process.env.PORT || 3000;
  
  // Inicia o servidor ouvindo em 0.0.0.0 (obrigatório para Render)
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Servidor rodando na porta: ${port}`);
  console.log(`📡 URL da Aplicação: ${await app.getUrl()}`);
}
bootstrap();