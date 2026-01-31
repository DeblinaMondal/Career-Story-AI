export type ProjectType = 'success' | 'failure';

export interface Project {
  id: string;
  name: string;
  description: string;
  learnings: string;
  type: ProjectType;
  fixPlan?: string; // Only for 'failure' projects
  timestamp: number;
}

export interface GeneratedScript {
  pitch: string;
  keyStrengths: string[];
}
