import {
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly supabase: SupabaseService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post('register')
  async register(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user: supabaseUser },
      error,
    } = await this.supabase.getClient().auth.getUser(token);

    if (error || !supabaseUser) {
      throw new UnauthorizedException('Invalid token');
    }

    const existing = await this.userRepo.findOne({
      where: { supabaseUid: supabaseUser.id },
    });

    if (existing) {
      return existing;
    }

    const emailConflict = await this.userRepo.findOne({
      where: { email: supabaseUser.email! },
    });

    if (emailConflict) {
      throw new ConflictException('Email already registered');
    }

    const user = this.userRepo.create({
      supabaseUid: supabaseUser.id,
      email: supabaseUser.email!,
      fullName:
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.user_metadata?.name ||
        null,
    });

    return this.userRepo.save(user);
  }
}
