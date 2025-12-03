import { 
  Controller, Post, Get, UseInterceptors, UploadedFile, UseGuards, Request, Body, Param 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.documentsService.create(file, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.documentsService.findAll(req.user.userId);
  }

  // NOVA ROTA: Chat
  @UseGuards(JwtAuthGuard)
  @Post(':id/chat')
  async chat(
    @Param('id') id: string, 
    @Body('question') question: string, 
    @Request() req
  ) {
    return this.documentsService.chat(id, question, req.user.userId);
  }
}