# Security Review — OpenGrowth v1.0.0-rc.1

## Scope

This document covers a security review of the OpenGrowth CLI tool, dashboard server, and GitHub Action as of v1.0.0-rc.1.

## Architecture Security Profile

| Property | Status |
|---|---|
| **Runtime** | Node.js 20+ (LTS) |
| **Network access** | Outbound HTTP(S) only (fetch target URL, robots.txt, sitemap.xml) |
| **Data storage** | Local filesystem only (JSON files in output directory) |
| **Authentication** | None required (local-first tool) |
| **External APIs** | None — no paid API keys, no cloud services |
| **Database** | None — file-based audit history |

## Threat Model

### 1. Command Injection
- **Risk**: Low
- **Mitigation**: URL inputs are validated and normalized. No shell execution of user input. CLI arguments are parsed by `commander` with typed options.

### 2. Path Traversal
- **Risk**: Low
- **Mitigation**: Output directories are resolved via `path.resolve()`. Dashboard file serving is restricted to the audit history directory with basename validation.

### 3. Cross-Site Scripting (XSS) in HTML Reports
- **Risk**: Medium (mitigated)
- **Mitigation**: All user-derived content in HTML reports is escaped using a dedicated `escapeHtml()` utility. Tests verify XSS payloads in page titles, headings, and URLs are properly escaped.

### 4. Server-Side Request Forgery (SSRF)
- **Risk**: Low
- **Mitigation**: The crawler fetches only the user-specified URL and standard well-known paths (robots.txt, sitemap.xml). No recursive crawling or redirect following to internal networks. The tool is designed for local use.

### 5. Denial of Service (Dashboard)
- **Risk**: Low
- **Mitigation**: The dashboard is designed for local single-user operation. It binds to `localhost` by default and processes one audit at a time.

### 6. Dependency Supply Chain
- **Risk**: Low
- **Production dependencies**: Only 2 (`cheerio`, `commander`) — both widely used, well-maintained packages.
- **Mitigation**: `npm audit` is run before each release. Lock file (`package-lock.json`) pins exact versions.

### 7. Information Leakage
- **Risk**: Low
- **Mitigation**: Generated reports contain only publicly available information from the target URL. No cookies, auth tokens, or private data are collected or stored.

## Dependency Audit

| Package | Version | Purpose | Risk |
|---|---|---|---|
| `cheerio` | ^1.2.0 | HTML parsing | Low — well-maintained, no network access |
| `commander` | ^13.1.0 | CLI argument parsing | Low — widely used, minimal surface |

## Recommendations

1. **Before public npm publish**: Run `npm audit` and resolve any critical/high findings.
2. **Dashboard deployment**: If exposing the dashboard beyond localhost, add authentication and rate limiting.
3. **Future multi-page crawl**: When recursive crawling is added, implement URL allowlisting and depth limits.
4. **Content Security Policy**: Consider adding CSP headers to the dashboard HTML responses.

## Conclusion

OpenGrowth has a minimal attack surface due to its local-first, no-auth, no-cloud architecture. The two production dependencies are well-known and low-risk. HTML report XSS is mitigated by escaping utilities with test coverage. No critical security issues were identified.
