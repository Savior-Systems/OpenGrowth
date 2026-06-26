import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { DashboardAuditRecord } from "./types.js";

export async function ensureDashboardDataDir(dataDir: string): Promise<void> {
  const resolvedDir = resolve(process.cwd(), dataDir);
  if (!existsSync(resolvedDir)) {
    mkdirSync(resolvedDir, { recursive: true });
  }
  const reportsDir = join(resolvedDir, "reports");
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }
}

export async function readAuditHistory(dataDir: string): Promise<DashboardAuditRecord[]> {
  const resolvedDir = resolve(process.cwd(), dataDir);
  const filePath = join(resolvedDir, "audits.json");
  if (!existsSync(filePath)) {
    return [];
  }
  try {
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content) as DashboardAuditRecord[];
  } catch {
    return [];
  }
}

export async function writeAuditHistory(dataDir: string, records: DashboardAuditRecord[]): Promise<void> {
  await ensureDashboardDataDir(dataDir);
  const resolvedDir = resolve(process.cwd(), dataDir);
  const filePath = join(resolvedDir, "audits.json");
  writeFileSync(filePath, JSON.stringify(records, null, 2), "utf-8");
}

export async function appendAuditRecord(dataDir: string, record: DashboardAuditRecord): Promise<void> {
  const history = await readAuditHistory(dataDir);
  history.unshift(record);
  await writeAuditHistory(dataDir, history);
}

export async function getAuditRecord(dataDir: string, id: string): Promise<DashboardAuditRecord | undefined> {
  const history = await readAuditHistory(dataDir);
  return history.find((r) => r.id === id);
}

export async function createAuditOutputDirectory(dataDir: string, auditId: string): Promise<string> {
  await ensureDashboardDataDir(dataDir);
  const dirPath = resolve(process.cwd(), dataDir, "reports", auditId);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
}
