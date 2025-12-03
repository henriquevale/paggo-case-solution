import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Onde procurar o token? No cabeçalho Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Rejeita tokens vencidos
      // Pega a chave secreta do arquivo .env
      secretOrKey: configService.get<string>('JWT_SECRET') || 'chave-secreta-padrao',
    });
  }

  // Se o token for válido, retorna os dados do usuário
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}