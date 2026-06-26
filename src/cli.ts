#!/usr/bin/env node

import { Command } from "commander";
import { runAudit } from "./commands/audit.js";

const program = new Command();

program
  .name("opengrowth")
  .description(
    "Open-source growth operating system — audit any website for growth, content, ads, and conversion.",
  )
  .version("0.6.0");

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

program.parse();
