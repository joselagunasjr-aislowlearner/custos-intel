import { IsString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  buildingType?: string;

  @IsOptional()
  @IsString()
  constructionType?: string;

  @IsOptional()
  @IsString()
  occupancyGroup?: string;

  @IsOptional()
  @IsInt()
  stories?: number;

  @IsOptional()
  @IsInt()
  squareFootage?: number;

  @IsOptional()
  @IsIn(['NFPA 13', 'NFPA 13R', 'NFPA 13D', 'None'])
  sprinklerSystemType?: string;

  @IsOptional()
  @IsIn(['Light Hazard', 'OH1', 'OH2', 'EH1', 'EH2'])
  hazardClassification?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
