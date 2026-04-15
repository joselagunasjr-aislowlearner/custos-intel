import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from '../../modules/auth/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const {
      data: { user: supabaseUser },
      error,
    } = await this.supabase.getClient().auth.getUser(token);

    if (error || !supabaseUser) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const localUser = await this.dataSource
      .getRepository(User)
      .findOne({ where: { email: supabaseUser.email! } });

    if (!localUser) {
      throw new UnauthorizedException('User not found');
    }

    if (!localUser.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    request.user = {
      userId: localUser.id,
      email: localUser.email,
      fullName: localUser.fullName,
      role: localUser.role,
    };

    return true;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (!authHeader) return null;
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;
    return token;
  }
}
