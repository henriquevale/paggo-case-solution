import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'; // Adicionei imports de erro
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    try {
      return await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
        },
      });
    } catch (error) {
      // Código P2002 do Prisma = Violação de Unicidade (Duplicado)
      if (error.code === 'P2002') {
        throw new ConflictException('Este e-mail já está cadastrado.');
      }
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }
}