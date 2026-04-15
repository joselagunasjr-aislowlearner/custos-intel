import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeReference } from './code-reference.entity';
import { CodeReferenceController } from './code-reference.controller';
import { CodeReferenceService } from './code-reference.service';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeReference, User])],
  controllers: [CodeReferenceController],
  providers: [CodeReferenceService],
  exports: [CodeReferenceService],
})
export class CodeReferenceModule {}
