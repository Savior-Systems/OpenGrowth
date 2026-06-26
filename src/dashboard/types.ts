export type AuditStatus = "completed" | "failed";

export interface DashboardAuditRecord {
  id: string;
  url: string;
  context: string;
  createdAt: string;
  status: AuditStatus;
  outputDirectory: string;
  reportHtmlPath?: string;
  overallScore?: number;
  rulesPassed?: number;
  rulesTotal?: number;
  highPriorityFindings?: number;
  errorMessage?: string;
}

export interface DashboardConfig {
  port: number;
  dataDir: string;
}
