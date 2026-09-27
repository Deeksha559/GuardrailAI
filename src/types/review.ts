export interface ArchitectureRule {
  id: string;
  name: string;
  category: 'architecture' | 'security' | 'reliability';
  description: string;
  documentationQuote: string;
  status: 'passed' | 'violated';
  severity: 'critical' | 'high' | 'medium';
  lineNumbers?: number[];
  recommendation: string;
}

export interface SecurityVulnerability {
  cwe: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  lineNumber: number;
  snippet: string;
  description: string;
  remediation: string;
}

export interface AgentThoughtStep {
  id: string;
  timestamp: string;
  phase: string;
  thought: string;
  detail: string;
  verdict: 'flagged' | 'passed' | 'analyzing';
  ruleRef?: string;
}

export interface AgentTrack {
  id: 'devsecops' | 'architect';
  agentName: string;
  title: string;
  framework: string;
  avatarIcon: string;
  status: 'completed' | 'in-progress' | 'flagged';
  verdict: string;
  summary: string;
  steps: AgentThoughtStep[];
  findingsCount: number;
}
