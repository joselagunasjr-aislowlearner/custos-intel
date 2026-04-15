import { Injectable } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { ChecklistService } from '../checklist/checklist.service';
import { AnalysisService } from '../analysis/analysis.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  constructor(
    private readonly projects: ProjectsService,
    private readonly checklist: ChecklistService,
    private readonly analysis: AnalysisService,
  ) {}

  async getReportData(projectId: string, userId: string) {
    const project = await this.projects.findOne(projectId, userId);
    const checklistData = await this.checklist.getProjectChecklist(projectId);
    const findings = await this.analysis.findByProject(projectId);

    const stats = {
      total: checklistData.length,
      pass: checklistData.filter((c) => c.response?.status === 'pass').length,
      fail: checklistData.filter((c) => c.response?.status === 'fail').length,
      na: checklistData.filter((c) => c.response?.status === 'na').length,
      pending: checklistData.filter(
        (c) => !c.response || c.response.status === 'pending',
      ).length,
    };

    const findingStats = {
      total: findings.length,
      compliant: findings.filter((f) => f.findingType === 'compliant').length,
      nonCompliant: findings.filter((f) => f.findingType === 'non_compliant')
        .length,
      needsReview: findings.filter((f) => f.findingType === 'needs_review')
        .length,
    };

    return {
      project,
      checklist: checklistData,
      checklistStats: stats,
      findings,
      findingStats,
      generatedAt: new Date().toISOString(),
    };
  }

  async generatePdf(projectId: string, userId: string): Promise<Buffer> {
    const data = await this.getReportData(projectId, userId);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('CUSTOS INTEL', { align: 'center' });
      doc
        .fontSize(14)
        .text('Fire & Life Safety Plan Review Report', { align: 'center' });
      doc.moveDown();

      // Project Info
      doc.fontSize(12).font('Helvetica-Bold').text('PROJECT INFORMATION');
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${data.project.name}`);
      if (data.project.address) doc.text(`Address: ${data.project.address}`);
      if (data.project.buildingType)
        doc.text(`Building Type: ${data.project.buildingType}`);
      if (data.project.constructionType)
        doc.text(`Construction Type: ${data.project.constructionType}`);
      if (data.project.occupancyGroup)
        doc.text(`Occupancy: ${data.project.occupancyGroup}`);
      if (data.project.sprinklerSystemType)
        doc.text(`Sprinkler System: ${data.project.sprinklerSystemType}`);
      if (data.project.hazardClassification)
        doc.text(
          `Hazard Classification: ${data.project.hazardClassification}`,
        );
      doc.text(`Generated: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // Checklist Summary
      doc.fontSize(12).font('Helvetica-Bold').text('CHECKLIST SUMMARY');
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(
        `Pass: ${data.checklistStats.pass} | Fail: ${data.checklistStats.fail} | N/A: ${data.checklistStats.na} | Pending: ${data.checklistStats.pending} | Total: ${data.checklistStats.total}`,
      );
      doc.moveDown();

      // Checklist Items
      const categories = [
        { key: 'A_sprinkler', label: 'A. Sprinkler System Compliance' },
        { key: 'B_fire_access', label: 'B. Fire Access & Hydrant Compliance' },
        { key: 'C_fdc_standpipe', label: 'C. FDC & Standpipe Compliance' },
        {
          key: 'D_fire_life_safety',
          label: 'D. Fire & Life Safety General',
        },
      ];

      for (const cat of categories) {
        const items = data.checklist.filter((c) => c.category === cat.key);
        if (items.length === 0) continue;

        doc.fontSize(11).font('Helvetica-Bold').text(cat.label);
        doc.moveDown(0.3);

        for (const item of items) {
          const status = item.response?.status || 'pending';
          const icon =
            status === 'pass'
              ? '[PASS]'
              : status === 'fail'
                ? '[FAIL]'
                : status === 'na'
                  ? '[N/A]'
                  : '[ -- ]';
          doc.fontSize(9).font('Helvetica');
          doc.text(`${icon} ${item.description}`, { indent: 10 });
          if (item.codeReference) {
            doc.fillColor('#6c757d').text(`     Ref: ${item.codeReference}`, {
              indent: 10,
            });
            doc.fillColor('#343a40');
          }
        }
        doc.moveDown();
      }

      // Findings
      if (data.findings.length > 0) {
        doc.addPage();
        doc.fontSize(12).font('Helvetica-Bold').text('AI ANALYSIS FINDINGS');
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        doc.text(
          `Compliant: ${data.findingStats.compliant} | Non-Compliant: ${data.findingStats.nonCompliant} | Needs Review: ${data.findingStats.needsReview}`,
        );
        doc.moveDown();

        for (const finding of data.findings) {
          const typeLabel =
            finding.findingType === 'non_compliant'
              ? '[NON-COMPLIANT]'
              : finding.findingType === 'compliant'
                ? '[COMPLIANT]'
                : finding.findingType === 'needs_review'
                  ? '[NEEDS REVIEW]'
                  : '[INFO]';
          doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .text(`${typeLabel} ${finding.title}`);
          doc
            .fontSize(9)
            .font('Helvetica')
            .text(finding.description, { indent: 10 });
          if (finding.codeReferences?.length) {
            doc.text(
              `Code: ${finding.codeReferences.map((r) => r.code).join(', ')}`,
              { indent: 10 },
            );
          }
          doc.moveDown(0.5);
        }
      }

      doc.end();
    });
  }
}
