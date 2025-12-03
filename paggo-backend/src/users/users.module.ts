import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // Exportamos para que outros módulos possam usar
})
export class UsersModule {}