export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export type ProjectDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type ProjectDomain =
  | "Healthcare & Medicine"
  | "Finance & FinTech"
  | "Education & EdTech"
  | "Cybersecurity & Privacy"
  | "Climate & Sustainability"
  | "Smart Cities & IoT"
  | "E-Commerce & Retail"
  | "Developer Tools & Productivity"
  | "Social Good & Accessibility";

export type ProjectType =
  | "Full-Stack Web App"
  | "AI / Machine Learning Platform"
  | "Mobile Application (Cross-Platform)"
  | "Cloud / DevOps Infrastructure"
  | "IoT & Embedded System"
  | "API Service / Developer CLI"
  | "Data Engineering & Analytics";

export interface StudentProfile {
  interests: string[];
  skills: string[];
  domain: string;
  projectType: string;
  experienceLevel: ExperienceLevel;
  timeframeWeeks: number;
  teamSize: number;
  preferredTech?: string;
  constraints?: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

export interface TechStackBreakdown {
  frontend: string[];
  backend: string[];
  database: string[];
  cloudDevOps: string[];
  aiMl: string[];
}

export interface AIMLComponent {
  included: boolean;
  description: string;
  modelOrApi: string;
  dataRequirements: string;
  datasetRecommendation: string;
}

export interface DevelopmentScope {
  totalWeeks: number;
  hoursPerWeek: number;
  teamSizeRecommendation: string;
}

export interface MVPVersion {
  summary: string;
  keyFeatures: string[];
  buildTimelineWeeks: number;
  deliverable: string;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  durationWeeks: number;
  milestones: string[];
  deliverables: string[];
}

export interface RiskChallenge {
  risk: string;
  severity: "High" | "Medium" | "Low";
  mitigation: string;
}

export interface ProjectBlueprint {
  id: string;
  title: string;
  concept: string;
  problem: string;
  suitability: string;
  targetUsers: string[];
  coreFeatures: ProjectFeature[];
  techStack: TechStackBreakdown;
  aiMlComponent: AIMLComponent;
  difficulty: ProjectDifficulty;
  estimatedScope: DevelopmentScope;
  mvpVersion: MVPVersion;
  roadmap: RoadmapPhase[];
  possibleImprovements: string[];
  futureScope: string[];
  risksAndChallenges: RiskChallenge[];
  architectureOverview: string;
}

export interface GenerateIdeasResponse {
  success: boolean;
  isDemoMode: boolean;
  source: "live_ai" | "curated_fallback";
  message?: string;
  data: ProjectBlueprint[];
}

export interface RefineIdeaRequest {
  blueprint: ProjectBlueprint;
  refinementPrompt: string;
  quickPreset?: string;
}

export interface RefineIdeaResponse {
  success: boolean;
  isDemoMode: boolean;
  source: "live_ai" | "curated_fallback";
  data: ProjectBlueprint;
}
