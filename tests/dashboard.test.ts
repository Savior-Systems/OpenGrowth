import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { existsSync, rmSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { Command } from "commander";
import {
  ensureDashboardDataDir,
  readAuditHistory,
  writeAuditHistory,
  appendAuditRecord,
  getAuditRecord,
  createAuditOutputDirectory
} from "../src/dashboard/storage.js";
import {
  generateAuditId,
  isSafeAuditId,
  isSafeFilename,
  isSafeFilePath
} from "../src/dashboard/dashboard-utils.js";
import {
  renderHome,
  renderAuditDetail,
  renderError
} from "../src/dashboard/templates.js";
import { startDashboardServer } from "../src/dashboard/server.js";
import { DashboardAuditRecord } from "../src/dashboard/types.js";

const TEST_DATA_DIR = ".test-dashboard-data";

describe("Dashboard Storage", () => {
  beforeAll(async () => {
    await ensureDashboardDataDir(TEST_DATA_DIR);
  });

  afterAll(() => {
    if (existsSync(TEST_DATA_DIR)) {
      rmSync(TEST_DATA_DIR, { recursive: true, force: true });
    }
  });

  it("should ensure data directory is created", () => {
    expect(existsSync(TEST_DATA_DIR)).toBe(true);
    expect(existsSync(join(TEST_DATA_DIR, "reports"))).toBe(true);
  });

  it("should write and read audit history correctly", async () => {
    const records: DashboardAuditRecord[] = [
      {
        id: "test-id-1",
        url: "https://example.com",
        context: "test context",
        createdAt: new Date().toISOString(),
        status: "completed",
        outputDirectory: "some-dir",
        overallScore: 85
      }
    ];

    await writeAuditHistory(TEST_DATA_DIR, records);
    const readRecords = await readAuditHistory(TEST_DATA_DIR);
    expect(readRecords.length).toBe(1);
    expect(readRecords[0].id).toBe("test-id-1");
    expect(readRecords[0].url).toBe("https://example.com");
  });

  it("should append a record and get it by id", async () => {
    const record: DashboardAuditRecord = {
      id: "test-id-2",
      url: "https://google.com",
      context: "search giant",
      createdAt: new Date().toISOString(),
      status: "completed",
      outputDirectory: "google-dir",
      overallScore: 90
    };

    await appendAuditRecord(TEST_DATA_DIR, record);
    const found = await getAuditRecord(TEST_DATA_DIR, "test-id-2");
    expect(found).toBeDefined();
    expect(found?.url).toBe("https://google.com");

    const history = await readAuditHistory(TEST_DATA_DIR);
    // Newly appended should be at the front
    expect(history[0].id).toBe("test-id-2");
  });

  it("should create audit output directory", async () => {
    const auditId = "test-output-dir-id";
    const dir = await createAuditOutputDirectory(TEST_DATA_DIR, auditId);
    expect(existsSync(dir)).toBe(true);
  });
});

describe("Dashboard Security and Utilities", () => {
  it("should generate a clean audit ID", () => {
    const id = generateAuditId("https://sub-domain.example.com/path?query=1");
    expect(id).toMatch(/^\d+-sub-domain-example-com-path-query-1$/);
  });

  it("should validate safe audit IDs", () => {
    expect(isSafeAuditId("12345-example-com")).toBe(true);
    expect(isSafeAuditId("12345_example-com")).toBe(false);
    expect(isSafeAuditId("../12345")).toBe(false);
    expect(isSafeAuditId("")).toBe(false);
  });

  it("should allow only allowed report filenames", () => {
    expect(isSafeFilename("scorecard.json")).toBe(true);
    expect(isSafeFilename("report.html")).toBe(true);
    expect(isSafeFilename("report.md")).toBe(true);
    expect(isSafeFilename("content-strategy.json")).toBe(true);
    expect(isSafeFilename("ad-strategy.md")).toBe(true);
    expect(isSafeFilename("arbitrary.txt")).toBe(false);
    expect(isSafeFilename("index.html")).toBe(false);
    expect(isSafeFilename("../scorecard.json")).toBe(false);
  });

  it("should reject path traversal attempts", () => {
    const baseDir = resolve(process.cwd(), TEST_DATA_DIR, "reports");
    const safePath = resolve(baseDir, "test-audit", "scorecard.json");
    const unsafePath1 = resolve(baseDir, "..", "audits.json");
    const unsafePath2 = resolve(baseDir, "test-audit", "..", "..", "package.json");

    expect(isSafeFilePath(baseDir, safePath)).toBe(true);
    expect(isSafeFilePath(baseDir, unsafePath1)).toBe(false);
    expect(isSafeFilePath(baseDir, unsafePath2)).toBe(false);
  });
});

describe("Dashboard Templates XSS Safety", () => {
  it("should escape malicious user input in home template", () => {
    const maliciousRecords: DashboardAuditRecord[] = [
      {
        id: "xss-id",
        url: 'https://example.com/"><script>alert("xss")</script>',
        context: '"><script>alert("context-xss")</script>',
        createdAt: new Date().toISOString(),
        status: "completed",
        outputDirectory: "some-dir",
        overallScore: 85,
        rulesPassed: 10,
        rulesTotal: 20,
        highPriorityFindings: 0
      }
    ];

    const html = renderHome(maliciousRecords);
    expect(html).not.toContain('<script>alert("xss")</script>');
    expect(html).not.toContain('<script>alert("context-xss")</script>');
    expect(html).toContain('&quot;&gt;&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it("should escape malicious user input in audit detail template", () => {
    const record: DashboardAuditRecord = {
      id: "xss-id-2",
      url: "https://example.com",
      context: '"><script>alert("context")</script>',
      createdAt: new Date().toISOString(),
      status: "completed",
      outputDirectory: "some-dir"
    };

    const scorecard = {
      score: {
        overall: 85,
        categories: { seo: 90, content: 80, conversion: 85, trust: 80, technical: 95, offer: 80, ads: 80 }
      },
      findings: [
        {
          title: '"><script>alert("finding-title")</script>',
          severity: "high",
          description: '"><script>alert("finding-desc")</script>',
          recommendation: '"><script>alert("finding-reco")</script>'
        }
      ]
    };

    const html = renderAuditDetail(record, scorecard);
    expect(html).not.toContain('<script>alert("context")</script>');
    expect(html).not.toContain('<script>alert("finding-title")</script>');
    expect(html).not.toContain('<script>alert("finding-desc")</script>');
    expect(html).not.toContain('<script>alert("finding-reco")</script>');
  });

  it("should render error template safely", () => {
    const html = renderError('"><script>alert("error")</script>');
    expect(html).not.toContain('<script>alert("error")</script>');
  });
});

describe("Dashboard HTTP Server", () => {
  let server: any;
  const port = 3999;
  const serverDataDir = ".test-server-data";

  beforeAll(async () => {
    await ensureDashboardDataDir(serverDataDir);
    server = await startDashboardServer({ port, dataDir: serverDataDir });
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((res) => server.close(() => res()));
    }
    if (existsSync(serverDataDir)) {
      rmSync(serverDataDir, { recursive: true, force: true });
    }
  });

  it("should return ok and version on /health", async () => {
    const response = await fetch(`http://localhost:${port}/health`);
    expect(response.status).toBe(200);
    const json = await response.json() as any;
    expect(json.ok).toBe(true);
    expect(json.tool).toBe("OpenGrowth");
    expect(json.version).toBe("0.8.0");
  });
});

describe("CLI Commands Integration", () => {
  it("should register dashboard command in commander Program", () => {
    const program = new Command();
    program
      .command("dashboard")
      .option("-p, --port <number>", "Port to run the dashboard on", "3007")
      .option("-d, --data <dir>", "Directory to store data", ".opengrowth-data");

    const cmd = program.commands.find((c) => c.name() === "dashboard");
    expect(cmd).toBeDefined();
    expect(cmd?.description()).toBeDefined();
    expect(cmd?.options.some((o) => o.flags.includes("-p"))).toBe(true);
    expect(cmd?.options.some((o) => o.flags.includes("-d"))).toBe(true);
  });
});
