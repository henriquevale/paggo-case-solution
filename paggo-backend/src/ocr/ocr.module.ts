import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';

@Module({
  providers: [OcrService],
  exports: [OcrService], // <--- IMPORTANTE: Permite que outros módulos usem o OCR
})
export class OcrModule {}