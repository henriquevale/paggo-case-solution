import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';

@Module({
  providers: [LlmService],
  exports: [LlmService], // <--- Exporta para outros usarem
})
export class LlmModule {}