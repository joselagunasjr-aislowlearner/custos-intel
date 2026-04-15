import { Project } from '../../projects/project.entity';

export function buildSystemPrompt(
  project: Project,
  category: string,
  codeRefs: Array<{ section: string; title: string; content: string; codeSource: string }>,
): string {
  const codeContext = codeRefs
    .map((r) => `[${r.codeSource} ${r.section}] ${r.title}: ${r.content}`)
    .join('\n');

  const projectContext = [
    `Project: ${project.name}`,
    project.address ? `Address: ${project.address}` : null,
    project.buildingType ? `Building Type: ${project.buildingType}` : null,
    project.constructionType ? `Construction Type: ${project.constructionType}` : null,
    project.occupancyGroup ? `Occupancy Group: ${project.occupancyGroup}` : null,
    project.stories ? `Stories: ${project.stories}` : null,
    project.sprinklerSystemType ? `Sprinkler System: ${project.sprinklerSystemType}` : null,
    project.hazardClassification ? `Hazard Classification: ${project.hazardClassification}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const categoryDescriptions: Record<string, string> = {
    sprinkler: 'sprinkler system installation, spacing, coverage, and hydraulic design',
    fire_access: 'fire apparatus access roads, hydrant placement and spacing',
    fdc_standpipe: 'fire department connections (FDC), standpipe systems, and signage',
    fire_life_safety: 'construction type ratings, fire alarm, egress, and fire separation',
  };

  return `You are a fire protection engineer reviewing building plans for compliance in Chippewa Falls, Wisconsin.

JURISDICTION: Chippewa Falls adopts Wisconsin Commercial Building Code (SPS 361-366), which incorporates IBC 2012 with Wisconsin amendments. The city also adopts NFPA 1 for fire prevention.

APPLICABLE CODES:
- NFPA 13 (2012) — Standard for the Installation of Sprinkler Systems
- NFPA 14 (2010) — Standard for the Installation of Standpipe and Hose Systems
- NFPA 72 (2010) — National Fire Alarm and Signaling Code
- IBC 2012 — International Building Code
- IFC 2012 — International Fire Code
- Wisconsin SPS 361-366 — Commercial Building Code
- Chippewa Falls Municipal Code Ch. 14 & 17

PROJECT DETAILS:
${projectContext}

ANALYSIS FOCUS: ${categoryDescriptions[category] || category}

APPLICABLE CODE REQUIREMENTS:
${codeContext}

INSTRUCTIONS:
1. Analyze the building plan photo for ${categoryDescriptions[category] || category} compliance.
2. Identify specific compliant and non-compliant conditions visible in the plans.
3. For each finding, cite the specific code section that applies.
4. Only report findings you can actually observe in the photo.
5. If the photo does not show enough detail for a particular check, report it as "needs_review".

Return a JSON array of findings:
[{
  "title": "string — brief description of finding",
  "finding_type": "compliant | non_compliant | needs_review | informational",
  "description": "string — detailed explanation of what was observed and why it does or does not comply",
  "code_references": [{"code": "NFPA 13 §8.6.2", "requirement": "max 15ft spacing for Light Hazard"}],
  "confidence": 0.0-1.0
}]

Return ONLY the JSON array, no additional text.`;
}
