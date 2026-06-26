import { escapeHtml } from "../report/html-utils.js";
import { DashboardAuditRecord } from "./types.js";
import { AuditResult } from "../audit/run-audit.js";

// Premium CSS stylesheet for all pages
const CSS_STYLE = `
:root {
  --bg-gradient: linear-gradient(135deg, #0b0f19 0%, #111827 50%, #1e1b4b 100%);
  --card-bg: rgba(17, 24, 39, 0.75);
  --card-border: rgba(255, 255, 255, 0.08);
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --accent-primary: #6366f1;
  --accent-hover: #4f46e5;
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg-gradient);
  color: var(--text-primary);
  font-family: var(--font-sans);
  min-height: 100vh;
  line-height: 1.5;
  padding: 2rem 1rem;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.logo-icon {
  font-size: 2.25rem;
  animation: float 3s ease-in-out infinite;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #a5b4fc, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 1rem;
  padding: 2rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.card:hover {
  border-color: rgba(99, 102, 241, 0.25);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #d1d5db;
  margin-bottom: 0.5rem;
}

input[type="text"], textarea {
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: rgba(10, 15, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s ease;
}

input[type="text"]:focus, textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: var(--accent-gradient);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
  background: var(--accent-hover);
}

.btn:active {
  transform: translateY(0);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
  width: auto;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: none;
}

.btn-secondary-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.375rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.btn-secondary-link:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-success {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-danger {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.15);
  color: var(--warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-size: 0.95rem;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background: rgba(255, 255, 255, 0.01);
}

.history-url {
  font-weight: 600;
  color: #818cf8;
  text-decoration: none;
}

.history-url:hover {
  text-decoration: underline;
}

.score-badge {
  font-size: 1.1rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  display: inline-block;
}

.score-excellent { background: rgba(16, 185, 129, 0.15); color: #34d399; }
.score-good { background: rgba(16, 185, 129, 0.1); color: #a7f3d0; }
.score-fair { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
.score-weak { background: rgba(239, 68, 68, 0.1); color: #fca5a5; }
.score-critical { background: rgba(239, 68, 68, 0.2); color: #f87171; }

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.score-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.score-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 8px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  position: relative;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
}

.score-circle.excellent { border-color: var(--success); text-shadow: 0 0 10px rgba(16, 185, 129, 0.4); }
.score-circle.good { border-color: #34d399; }
.score-circle.fair { border-color: var(--warning); text-shadow: 0 0 10px rgba(245, 158, 11, 0.4); }
.score-circle.weak { border-color: #fca5a5; }
.score-circle.critical { border-color: var(--danger); text-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }

.detail-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.category-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.category-row:last-child {
  border-bottom: none;
}

.category-name {
  font-weight: 500;
}

.category-score {
  font-weight: 700;
}

.finding-item {
  padding: 1rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-left: 4px solid var(--text-secondary);
  margin-bottom: 1rem;
}

.finding-item:last-child {
  margin-bottom: 0;
}

.finding-item.critical { border-left-color: var(--danger); }
.finding-item.high { border-left-color: var(--warning); }
.finding-item.medium { border-left-color: #fbbf24; }
.finding-item.low { border-left-color: #60a5fa; }
.finding-item.info { border-left-color: #a7f3d0; }

.finding-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.finding-title {
  font-weight: 700;
}

.finding-desc {
  font-size: 0.9rem;
  color: #d1d5db;
  margin-bottom: 0.5rem;
}

.finding-reco {
  font-size: 0.85rem;
  color: #a5b4fc;
}

.file-link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.error-card {
  border-color: rgba(239, 68, 68, 0.3);
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  color: var(--danger);
  margin-bottom: 1rem;
}

.error-msg {
  font-size: 1.1rem;
  color: #fca5a5;
  margin-bottom: 1.5rem;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 0.5rem;
  word-break: break-all;
}

/* Animations */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}

.loading-indicator {
  display: none;
  text-align: center;
  padding: 1rem;
}

.pulse {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent-primary);
  animation: pulse 1.2s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 1; }
}

.loading-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}
`;

function getScoreClass(score: number): string {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 60) return "fair";
  if (score >= 40) return "weak";
  return "critical";
}

function getHeader(): string {
  return `
    <header>
      <div class="logo-container">
        <span class="logo-icon">🚀</span>
        <h1>OpenGrowth</h1>
      </div>
      <p class="subtitle">Local Growth Audit Dashboard</p>
    </header>
  `;
}

export function renderHome(records: DashboardAuditRecord[]): string {
  const tableRows = records.length === 0
    ? `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No audit runs found. Use the form above to start one!</td></tr>`
    : records.map((r) => {
        const dateStr = new Date(r.createdAt).toLocaleString();
        const scoreDisplay = r.status === "completed" && typeof r.overallScore === "number"
          ? `<span class="score-badge score-${getScoreClass(r.overallScore)}">${r.overallScore}/100</span>`
          : `<span class="badge badge-danger">Failed</span>`;
        
        const passedDisplay = typeof r.rulesPassed === "number" && typeof r.rulesTotal === "number"
          ? `${r.rulesPassed}/${r.rulesTotal}`
          : "-";

        const findingsDisplay = typeof r.highPriorityFindings === "number"
          ? `<span class="${r.highPriorityFindings > 0 ? 'badge badge-warning' : 'badge badge-success'}">${r.highPriorityFindings}</span>`
          : "-";

        return `
          <tr>
            <td>
              <a href="/audit/${r.id}" class="history-url">${escapeHtml(r.url)}</a>
            </td>
            <td style="color: var(--text-secondary); font-size: 0.85rem;">${escapeHtml(dateStr)}</td>
            <td>${scoreDisplay}</td>
            <td style="text-align: center;">${passedDisplay}</td>
            <td style="text-align: center;">${findingsDisplay}</td>
            <td>
              <a href="/audit/${r.id}" class="btn-secondary-link">Details →</a>
            </td>
          </tr>
        `;
      }).join("\n");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OpenGrowth Dashboard</title>
      <style>${CSS_STYLE}</style>
      <script>
        function showLoading() {
          document.getElementById('audit-form-card').style.opacity = '0.6';
          document.getElementById('submit-btn').style.display = 'none';
          document.getElementById('loading').style.display = 'block';
        }
      </script>
    </head>
    <body>
      <div class="container">
        ${getHeader()}

        <div class="grid grid-2">
          <!-- Audit Form Card -->
          <div class="card" id="audit-form-card">
            <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem;">Run Website Audit</h2>
            <form action="/audit" method="POST" onsubmit="showLoading()">
              <div class="form-group">
                <label for="url">Website URL</label>
                <input type="text" id="url" name="url" placeholder="https://example.com" required autocomplete="off" />
              </div>
              <div class="form-group">
                <label for="context">Business Context (Ideal for Tailoring Strategies)</label>
                <textarea id="context" name="context" placeholder="Describe your product, target audience, pricing, and main offer (e.g. B2B SaaS for feedback management targeting product teams)..."></textarea>
              </div>
              <button type="submit" id="submit-btn" class="btn">Start Free Audit</button>
              
              <div id="loading" class="loading-indicator">
                <div class="pulse"></div>
                <div class="loading-text">Crawling, analyzing rules, and generating ad/content strategies... This takes a few seconds.</div>
              </div>
            </form>
          </div>

          <!-- Quick Information Card -->
          <div class="card">
            <h2 style="font-size: 1.5rem; margin-bottom: 1.25rem; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem;">How it works</h2>
            <ul style="list-style-type: none; display: flex; flex-direction: column; gap: 1rem;">
              <li style="display: flex; gap: 0.75rem;">
                <span style="font-size: 1.25rem; color: #818cf8;">🔍</span>
                <div>
                  <strong style="display:block; font-size: 0.95rem;">1. Lightweight Crawler</strong>
                  <span style="color: var(--text-secondary); font-size: 0.85rem;">Fetches main landing HTML page, parses titles, metadata, structure, CTAs, and trust cues.</span>
                </div>
              </li>
              <li style="display: flex; gap: 0.75rem;">
                <span style="font-size: 1.25rem; color: #818cf8;">⚙️</span>
                <div>
                  <strong style="display:block; font-size: 0.95rem;">2. Rules & Scorecard</strong>
                  <span style="color: var(--text-secondary); font-size: 0.85rem;">Evaluates 26+ modular rules. Computes an overall score from 0 to 100 across 7 marketing categories.</span>
                </div>
              </li>
              <li style="display: flex; gap: 0.75rem;">
                <span style="font-size: 1.25rem; color: #818cf8;">🎯</span>
                <div>
                  <strong style="display:block; font-size: 0.95rem;">3. Marketing Blueprints</strong>
                  <span style="color: var(--text-secondary); font-size: 0.85rem;">Generates a 30-day content calendar, topic clusters, ad hook variants, and audience messaging angles.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Audit History Table -->
        <div class="card">
          <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 700;">Audit History</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 35%;">URL</th>
                  <th style="width: 20%;">Date</th>
                  <th style="width: 15%;">Overall Score</th>
                  <th style="text-align: center; width: 10%;">Rules</th>
                  <th style="text-align: center; width: 10%;">High Priority</th>
                  <th style="width: 10%;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function renderAuditDetail(record: DashboardAuditRecord, scorecardData?: AuditResult | null): string {
  const dateStr = new Date(record.createdAt).toLocaleString();
  
  let scoreCardHtml = "";
  let findingsHtml = "";

  if (record.status === "completed" && scorecardData) {
    const overall = scorecardData.score.overall;
    const cat = scorecardData.score.categories;
    const scoreClass = getScoreClass(overall);
    
    scoreCardHtml = `
      <div class="card">
        <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem;">Audit Scorecard</h2>
        <div class="grid grid-2" style="align-items: center;">
          <div class="score-hero">
            <div class="score-circle ${scoreClass}">
              ${overall}
            </div>
            <div style="font-weight: 700; font-size: 1.1rem; text-transform: uppercase; color: var(--text-secondary);">${scoreClass} score</div>
          </div>
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: #818cf8;">Category Performance</h3>
            <div class="category-row">
              <span class="category-name">SEO Foundation</span>
              <span class="category-score">${cat.seo}/100</span>
            </div>
            <div class="category-row">
              <span class="category-name">Content Opportunity</span>
              <span class="category-score">${cat.content}/100</span>
            </div>
            <div class="category-row">
              <span class="category-name">Conversion Readiness</span>
              <span class="category-score">${cat.conversion}/100</span>
            </div>
            <div class="category-row">
              <span class="category-name">Trust Signals</span>
              <span class="category-score">${cat.trust}/100</span>
            </div>
            <div class="category-row">
              <span class="category-name">Technical SEO</span>
              <span class="category-score">${cat.technical}/100</span>
            </div>
            <div class="category-row">
              <span class="category-name">Offer Clarity</span>
              <span class="category-score">${cat.offer}/100</span>
            </div>
            <div class="category-row">
              <span class="category-name">Ad Readiness</span>
              <span class="category-score">${cat.ads}/100</span>
            </div>
          </div>
        </div>
      </div>
    `;

    if (scorecardData.findings && scorecardData.findings.length > 0) {
      const findingsList = scorecardData.findings.map((f) => `
        <div class="finding-item ${f.severity}">
          <div class="finding-header">
            <span class="finding-title">${escapeHtml(f.title)}</span>
            <span class="badge ${f.severity === 'critical' || f.severity === 'high' ? 'badge-danger' : 'badge-warning'}">${escapeHtml(f.severity)}</span>
          </div>
          <div class="finding-desc">${escapeHtml(f.description)}</div>
          ${f.recommendation ? `<div class="finding-reco">💡 <strong>Recommendation:</strong> ${escapeHtml(f.recommendation)}</div>` : ""}
        </div>
      `).join("\n");

      findingsHtml = `
        <div class="card">
          <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem;">Growth Audit Findings</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem; max-height: 400px; overflow-y: auto; padding-right: 0.5rem;">
            ${findingsList}
          </div>
        </div>
      `;
    } else {
      findingsHtml = `
        <div class="card">
          <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem;">Growth Audit Findings</h2>
          <p style="color: var(--text-secondary); text-align: center; padding: 2rem;">🎉 All rules passed! No issues detected.</p>
        </div>
      `;
    }
  } else if (record.status === "failed") {
    scoreCardHtml = `
      <div class="card error-card">
        <div class="error-icon">⚠️</div>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; font-weight: 700; color: var(--danger);">Audit Execution Failed</h2>
        <p class="error-msg">${escapeHtml(record.errorMessage || "Unknown audit pipeline execution error.")}</p>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OpenGrowth - Audit Details</title>
      <style>${CSS_STYLE}</style>
    </head>
    <body>
      <div class="container">
        ${getHeader()}

        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
          <a href="/" class="btn-secondary-link">← Back to Dashboard</a>
          ${record.status === "completed" ? `<a href="/reports/${record.id}/report.html" target="_blank" class="btn" style="width: auto; padding: 0.5rem 1.25rem; font-size: 0.9rem; box-shadow: none;">Open Full HTML Report ↗</a>` : ""}
        </div>

        <!-- Meta info -->
        <div class="card">
          <div class="grid grid-3">
            <div>
              <div class="detail-label">Audited URL</div>
              <div class="detail-value" style="word-break: break-all;"><a href="${escapeHtml(record.url)}" target="_blank" style="color: #818cf8; text-decoration: none;">${escapeHtml(record.url)} ↗</a></div>
            </div>
            <div>
              <div class="detail-label">Audit Date</div>
              <div class="detail-value">${escapeHtml(dateStr)}</div>
            </div>
            <div>
              <div class="detail-label">Execution Status</div>
              <div>
                <span class="badge ${record.status === 'completed' ? 'badge-success' : 'badge-danger'}">${record.status}</span>
              </div>
            </div>
          </div>
          ${record.context ? `
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05);">
              <div class="detail-label">Business Context provided</div>
              <div style="color: #d1d5db; font-size: 0.95rem; white-space: pre-wrap; font-style: italic;">"${escapeHtml(record.context)}"</div>
            </div>
          ` : ""}
        </div>

        ${scoreCardHtml}
        ${findingsHtml}

        <!-- Download & view reports list -->
        ${record.status === "completed" ? `
          <div class="card">
            <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem;">Audit Artifact Outputs</h2>
            <div class="file-link-grid">
              <a href="/reports/${record.id}/report.html" target="_blank" class="btn-secondary-link" style="padding: 1rem;">
                <span style="font-size: 1.5rem; display:block; margin-bottom: 0.25rem;">📄</span>
                <strong>report.html</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary); display:block; margin-top: 0.25rem;">Interactive Report</span>
              </a>
              <a href="/reports/${record.id}/report.md" target="_blank" class="btn-secondary-link" style="padding: 1rem;">
                <span style="font-size: 1.5rem; display:block; margin-bottom: 0.25rem;">📝</span>
                <strong>report.md</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary); display:block; margin-top: 0.25rem;">Markdown Report</span>
              </a>
              <a href="/reports/${record.id}/scorecard.json" target="_blank" class="btn-secondary-link" style="padding: 1rem;">
                <span style="font-size: 1.5rem; display:block; margin-bottom: 0.25rem;">📊</span>
                <strong>scorecard.json</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary); display:block; margin-top: 0.25rem;">Core Metrics & Score</span>
              </a>
              <a href="/reports/${record.id}/content-strategy.md" target="_blank" class="btn-secondary-link" style="padding: 1rem;">
                <span style="font-size: 1.5rem; display:block; margin-bottom: 0.25rem;">✍️</span>
                <strong>content-strategy.md</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary); display:block; margin-top: 0.25rem;">Content Blueprint</span>
              </a>
              <a href="/reports/${record.id}/content-strategy.json" target="_blank" class="btn-secondary-link" style="padding: 1rem;">
                <span style="font-size: 1.5rem; display:block; margin-bottom: 0.25rem;">⚙️</span>
                <strong>content-strategy.json</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary); display:block; margin-top: 0.25rem;">Content Schema</span>
              </a>
              <a href="/reports/${record.id}/ad-strategy.md" target="_blank" class="btn-secondary-link" style="padding: 1rem;">
                <span style="font-size: 1.5rem; display:block; margin-bottom: 0.25rem;">🎯</span>
                <strong>ad-strategy.md</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary); display:block; margin-top: 0.25rem;">Ad Hook Concepts</span>
              </a>
              <a href="/reports/${record.id}/ad-strategy.json" target="_blank" class="btn-secondary-link" style="padding: 1rem;">
                <span style="font-size: 1.5rem; display:block; margin-bottom: 0.25rem;">⚙️</span>
                <strong>ad-strategy.json</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary); display:block; margin-top: 0.25rem;">Ad Target Schema</span>
              </a>
              <a href="/reports/${record.id}/page-data.json" target="_blank" class="btn-secondary-link" style="padding: 1rem;">
                <span style="font-size: 1.5rem; display:block; margin-bottom: 0.25rem;">💾</span>
                <strong>page-data.json</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary); display:block; margin-top: 0.25rem;">Raw Crawled HTML Data</span>
              </a>
              <a href="/reports/${record.id}/rule-results.json" target="_blank" class="btn-secondary-link" style="padding: 1rem;">
                <span style="font-size: 1.5rem; display:block; margin-bottom: 0.25rem;">🔧</span>
                <strong>rule-results.json</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary); display:block; margin-top: 0.25rem;">All Evaluated Rules</span>
              </a>
            </div>
          </div>
        ` : ""}
      </div>
    </body>
    </html>
  `;
}

export function renderError(message: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OpenGrowth - Error</title>
      <style>${CSS_STYLE}</style>
    </head>
    <body>
      <div class="container" style="max-width: 600px; padding-top: 4rem;">
        <div class="card error-card">
          <div class="error-icon">❌</div>
          <h2 style="font-size: 1.75rem; margin-bottom: 1rem; font-weight: 800; color: var(--danger);">An Error Occurred</h2>
          <p class="error-msg">${escapeHtml(message)}</p>
          <a href="/" class="btn">Return to Dashboard</a>
        </div>
      </div>
    </body>
    </html>
  `;
}
