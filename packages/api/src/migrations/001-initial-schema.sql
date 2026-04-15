-- Custos Intel — Initial Database Schema
-- Run this against the rockwell-portal Supabase project (kihzwozrqcoqjkwvoxjg)
-- All tables prefixed with ci_ to coexist with existing Rockwell tables

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (mirrors Supabase Auth users with app-specific fields)
CREATE TABLE ci_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_uid UUID UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'reviewer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table (one per building submission)
CREATE TABLE ci_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES ci_users(id),
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  building_type VARCHAR(100),
  construction_type VARCHAR(10),
  occupancy_group VARCHAR(50),
  stories INTEGER,
  square_footage INTEGER,
  sprinkler_system_type VARCHAR(50),
  hazard_classification VARCHAR(50),
  status VARCHAR(50) DEFAULT 'in_progress',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uploaded plan photos
CREATE TABLE ci_plan_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ci_projects(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  storage_url VARCHAR(1000),
  original_filename VARCHAR(255),
  file_size_bytes INTEGER,
  mime_type VARCHAR(100),
  photo_type VARCHAR(100),
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI analysis findings
CREATE TABLE ci_analysis_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ci_projects(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES ci_plan_photos(id) ON DELETE SET NULL,
  category VARCHAR(50) NOT NULL,
  finding_type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  code_references JSONB DEFAULT '[]',
  confidence DECIMAL(3,2),
  ai_model VARCHAR(100),
  raw_ai_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checklist items (47 items, pre-seeded)
CREATE TABLE ci_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  item_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  code_reference VARCHAR(500),
  sort_order INTEGER NOT NULL,
  UNIQUE(category, item_number)
);

-- Per-project checklist responses
CREATE TABLE ci_checklist_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES ci_projects(id) ON DELETE CASCADE,
  checklist_item_id UUID NOT NULL REFERENCES ci_checklist_items(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes TEXT,
  finding_id UUID REFERENCES ci_analysis_findings(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES ci_users(id),
  reviewed_at TIMESTAMPTZ,
  UNIQUE(project_id, checklist_item_id)
);

-- Code reference database (structured fire code data)
CREATE TABLE ci_code_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  code_source VARCHAR(100) NOT NULL,
  section VARCHAR(100),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  numeric_value DECIMAL,
  unit VARCHAR(50),
  tags TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ci_projects_user_id ON ci_projects(user_id);
CREATE INDEX idx_ci_plan_photos_project_id ON ci_plan_photos(project_id);
CREATE INDEX idx_ci_analysis_findings_project_id ON ci_analysis_findings(project_id);
CREATE INDEX idx_ci_analysis_findings_category ON ci_analysis_findings(category);
CREATE INDEX idx_ci_checklist_responses_project_id ON ci_checklist_responses(project_id);
CREATE INDEX idx_ci_code_references_category ON ci_code_references(category);
CREATE INDEX idx_ci_code_references_source ON ci_code_references(code_source);
CREATE INDEX idx_ci_code_references_tags ON ci_code_references USING GIN(tags);
CREATE INDEX idx_ci_code_references_search ON ci_code_references
  USING GIN(to_tsvector('english', title || ' ' || content));
