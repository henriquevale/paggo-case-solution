import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // CORREÇÃO 1: Tratamento para evitar 'undefined' na URL
    const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

    // Inicializa o adaptador SQLite
    const adapter = new PrismaBetterSqlite3({
      url: dbUrl,
    });


    super({ adapter } as any);
  }

  async onModuleInit(): Promise<void> {
   
    await (this as any).$connect();
  }

  async onModuleDestroy(): Promise<void> {
    // CORREÇÃO 4: 'as any' silencia o erro se o client não tiver sido gerado ainda
    await (this as any).$disconnect();
  }
}