#!/usr/bin/env node

import { Command } from "commander";
import { runAudit } from "./commands/audit.js";

const program = new Command();

program
  .name("opengrowth")
  .description(
    "Open-source growth operating system — audit any website for growth, content, ads, and conversion.",
  )
  .version("0.9.0");

program
  .command("audit")
  .description("Audit a website for growth opportunities")
  .argument("<url>", "URL to audit (e.g., https://example.com)")
  .option(
    "-c, --context <text>",
    "Business context for richer analysis",
    "",
  )
  .option(
    "-o, --output <dir>",
    "Output directory for report files",
    "opengrowth-report",
  )
  .option(
    "-f, --format <type>",
    "Output format (json, markdown)",
    "json",
  )
  .action(async (url: string, opts: { context: string; output: string; format: string }) => {
    await runAudit({
      url,
      context: opts.context,
      output: opts.output,
      format: opts.format,
    });
  });

program
  .command("dashboard")
  .description("Start the local self-hosted growth dashboard")
  .option("-p, --port <number>", "Port to run the dashboard on", "3007")
  .option("-d, --data <dir>", "Directory to store audits and reports data", ".opengrowth-data")
  .action(async (opts: { port: string; data: string }) => {
    const port = parseInt(opts.port, 10);
    const dataDir = opts.data;

    if (isNaN(port) || port < 1 || port > 65535) {
      console.error(`\n  ❌ Invalid port number: ${opts.port}\n`);
      process.exit(1);
    }

    const { startDashboardServer } = await import("./dashboard/server.js");

    console.log(`\n  🚀 Starting OpenGrowth Dashboard...`);
    try {
      await startDashboardServer({ port, dataDir });
      console.log(`\n  🟢 Dashboard running at: http://localhost:${port}`);
      console.log(`  📂 Data Directory:         ${dataDir}`);
      console.log(`  🛑 Press Ctrl+C to stop the server\n`);
    } catch (err: any) {
      console.error(`\n  ❌ Failed to start dashboard: ${err.message}\n`);
      process.exit(1);
    }
  });

program.parse();
