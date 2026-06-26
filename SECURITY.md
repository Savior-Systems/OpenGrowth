# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Current release |
| 0.x     | ⚠️ Best-effort |

## Reporting a Vulnerability

If you discover a security vulnerability in OpenGrowth, please report it responsibly.

**Do NOT open a public issue for security vulnerabilities.**

### How to Report

1. Email: **security@savior-systems.com** (or open a private security advisory on GitHub)
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix & Disclosure**: Coordinated with reporter

### Scope

OpenGrowth is a local-first CLI tool. Security concerns include:
- Command injection via user input
- Path traversal in file operations
- Dependency vulnerabilities
- Information leakage in reports

### Recognition

We will credit security researchers in our release notes (with permission).

## Best Practices for Users

- Keep dependencies updated
- Do not commit `.env` files
- Review generated reports before sharing publicly
- Run with least-privilege permissions
