import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly repo: Repository<Project>,
  ) {}

  async findAllByUser(userId: string): Promise<Project[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['photos'],
    });
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.repo.findOne({
      where: { id, userId },
      relations: ['photos', 'findings', 'checklistResponses'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(userId: string, dto: CreateProjectDto): Promise<Project> {
    const project = this.repo.create({ ...dto, userId });
    return this.repo.save(project);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id, userId);
    Object.assign(project, dto);
    return this.repo.save(project);
  }

  async archive(id: string, userId: string): Promise<Project> {
    const project = await this.findOne(id, userId);
    project.status = 'archived';
    return this.repo.save(project);
  }
}
