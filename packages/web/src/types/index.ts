export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  address: string | null;
  buildingType: string | null;
  constructionType: string | null;
  occupancyGroup: string | null;
  stories: number | null;
  squareFootage: number | null;
  sprinklerSystemType: string | null;
  hazardClassification: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  photos?: PlanPhoto[];
  findings?: AnalysisFinding[];
  checklistResponses?: ChecklistResponse[];
}

export interface PlanPhoto {
  id: string;
  projectId: string;
  storagePath: string;
  storageUrl: string | null;
  originalFilename: string | null;
  fileSizeBytes: number | null;
  mimeType: string | null;
  photoType: string | null;
  description: string | null;
  uploadedAt: string;
}

export interface AnalysisFinding {
  id: string;
  projectId: string;
  photoId: string | null;
  category: string;
  findingType: 'compliant' | 'non_compliant' | 'needs_review' | 'informational';
  title: string;
  description: string;
  codeReferences: Array<{ code: string; requirement: string }>;
  confidence: number | null;
  aiModel: string | null;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  itemNumber: number;
  description: string;
  codeReference: string | null;
  sortOrder: number;
}

export interface ChecklistResponse {
  id: string;
  projectId: string;
  checklistItemId: string;
  status: 'pass' | 'fail' | 'na' | 'pending';
  notes: string | null;
  reviewedAt: string | null;
}

export interface ChecklistItemWithResponse extends ChecklistItem {
  response: ChecklistResponse | null;
}

export interface CodeReference {
  id: string;
  category: string;
  codeSource: string;
  section: string | null;
  title: string;
  content: string;
  numericValue: number | null;
  unit: string | null;
  tags: string[];
  sortOrder: number;
}

export interface ReportData {
  project: Project;
  checklist: ChecklistItemWithResponse[];
  checklistStats: {
    total: number;
    pass: number;
    fail: number;
    na: number;
    pending: number;
  };
  findings: AnalysisFinding[];
  findingStats: {
    total: number;
    compliant: number;
    nonCompliant: number;
    needsReview: number;
  };
  generatedAt: string;
}
