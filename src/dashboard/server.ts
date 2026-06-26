import { createServer, IncomingMessage, ServerResponse, Server } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { DashboardConfig, DashboardAuditRecord } from "./types.js";
import {
  ensureDashboardDataDir,
  readAuditHistory,
  appendAuditRecord,
  getAuditRecord
} from "./storage.js";
import {
  generateAuditId,
  isSafeAuditId,
  isSafeFilename,
  isSafeFilePath
} from "./dashboard-utils.js";
import {
  renderHome,
  renderAuditDetail,
  renderError
} from "./templates.js";
import { runOpenGrowthAudit } from "../audit/run-audit.js";

/**
 * Starts the native local dashboard HTTP server.
 */
export async function startDashboardServer(config: DashboardConfig): Promise<Server> {
  const dataDir = config.dataDir;
  await ensureDashboardDataDir(dataDir);

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const parsedUrl = new URL(req.url || "", `http://localhost:${config.port}`);
      const pathname = parsedUrl.pathname;
      const method = req.method;

      // GET /health
      if (pathname === "/health" && method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, tool: "OpenGrowth", version: "0.8.0" }));
        return;
      }

      // GET /
      if (pathname === "/" && method === "GET") {
        const records = await readAuditHistory(dataDir);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(renderHome(records));
        return;
      }

      // POST /audit
      if (pathname === "/audit" && method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          try {
            const params = new URLSearchParams(body);
            const url = params.get("url")?.trim() || "";
            const context = params.get("context")?.trim() || "";

            if (!url) {
              res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
              res.end(renderError("URL parameter is required."));
              return;
            }

            const auditId = generateAuditId(url);
            const outputDirectory = join(dataDir, "reports", auditId);

            try {
              const auditResult = await runOpenGrowthAudit({
                url,
                context,
                output: outputDirectory
              });

              // Success record
              const record: DashboardAuditRecord = {
                id: auditId,
                url: auditResult.url,
                context: auditResult.context,
                createdAt: new Date().toISOString(),
                status: "completed",
                outputDirectory,
                reportHtmlPath: `/reports/${auditId}/report.html`,
                overallScore: auditResult.score.overall,
                rulesPassed: auditResult.ruleResults.filter((r) => r.passed).length,
                rulesTotal: auditResult.ruleResults.length,
                highPriorityFindings: auditResult.findings.filter(
                  (f) => f.severity === "critical" || f.severity === "high"
                ).length
              };

              await appendAuditRecord(dataDir, record);
              res.writeHead(302, { Location: `/audit/${auditId}` });
              res.end();
            } catch (err: any) {
              // Failure record
              const record: DashboardAuditRecord = {
                id: auditId,
                url,
                context,
                createdAt: new Date().toISOString(),
                status: "failed",
                outputDirectory,
                errorMessage: err.message || String(err)
              };

              await appendAuditRecord(dataDir, record);
              res.writeHead(302, { Location: `/audit/${auditId}` });
              res.end();
            }
          } catch (err: any) {
            res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
            res.end(renderError(`Failed to parse request: ${err.message}`));
          }
        });
        return;
      }

      // GET /audit/:id
      const auditMatch = pathname.match(/^\/audit\/([a-zA-Z0-9-]+)$/);
      if (auditMatch && method === "GET") {
        const auditId = auditMatch[1];
        if (!isSafeAuditId(auditId)) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(renderError("Invalid audit ID format."));
          return;
        }

        const record = await getAuditRecord(dataDir, auditId);
        if (!record) {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(renderError("Audit record not found."));
          return;
        }

        let scorecardData: any = null;
        if (record.status === "completed") {
          try {
            const scorecardPath = resolve(process.cwd(), record.outputDirectory, "scorecard.json");
            if (existsSync(scorecardPath)) {
              scorecardData = JSON.parse(readFileSync(scorecardPath, "utf-8"));
            }
          } catch {
            // Ignore missing scorecard data
          }
        }

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(renderAuditDetail(record, scorecardData));
        return;
      }

      // GET /reports/:auditId/:filename
      const reportMatch = pathname.match(/^\/reports\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9_.-]+)$/);
      if (reportMatch && method === "GET") {
        const auditId = reportMatch[1];
        const filename = reportMatch[2];

        if (!isSafeAuditId(auditId)) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(renderError("Invalid audit ID."));
          return;
        }

        if (!isSafeFilename(filename)) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(renderError("Access to requested file is not allowed."));
          return;
        }

        const reportsDir = resolve(process.cwd(), dataDir, "reports");
        const filePath = resolve(reportsDir, auditId, filename);

        if (!isSafeFilePath(reportsDir, filePath)) {
          res.writeHead(403, { "Content-Type": "text/html; charset=utf-8" });
          res.end(renderError("Access forbidden: Path traversal detected."));
          return;
        }

        if (!existsSync(filePath)) {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(renderError("Report file not found."));
          return;
        }

        const ext = filename.split(".").pop();
        let contentType = "text/plain";
        if (ext === "html") contentType = "text/html; charset=utf-8";
        else if (ext === "json") contentType = "application/json; charset=utf-8";
        else if (ext === "md") contentType = "text/markdown; charset=utf-8";

        const content = readFileSync(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
        return;
      }

      // 404 Route
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(renderError("Page not found."));
    } catch (err: any) {
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      res.end(renderError(`Internal server error: ${err.message}`));
    }
  });

  return new Promise((resResolve, reject) => {
    server.listen(config.port, () => {
      resResolve(server);
    }).on("error", (err) => {
      reject(err);
    });
  });
}
