# Contributing to OpenGrowth

Thank you for your interest in contributing to OpenGrowth! 🚀

## How to Contribute

### Reporting Bugs

1. Check [existing issues](https://github.com/Savior-Systems/OpenGrowth/issues) first
2. Use the [Bug Report template](./.github/ISSUE_TEMPLATE/bug_report.md)
3. Include steps to reproduce, expected behavior, and actual behavior

### Suggesting Features

1. Check the [Roadmap](./ROADMAP.md) to see if it's already planned
2. Use the [Feature Request template](./.github/ISSUE_TEMPLATE/feature_request.md)
3. Describe the use case and expected behavior

### Contributing Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Write or update tests
5. Run the test suite: `npm test`
6. Commit with a clear message: `git commit -m "feat: add my feature"`
7. Push and open a Pull Request

### Contributing Rule Packs

OpenGrowth's power comes from its modular rule packs. If you want to contribute new validation checks (e.g., SEO, Content, Conversion, Trust, Ads, or Industry-specific audits):
1. Review the rule engine architecture in [docs/rules-engine.md](./docs/rules-engine.md).
2. Create or modify rules inside `src/rules/`.
3. Add tests verifying the rule outputs.

### Contributing Example Reports & Gallery

Help others learn by contributing audit results of interesting websites to the gallery:
1. Run a local audit on a public website.
2. Ensure you follow anonymization guidelines in [examples/report-gallery/README.md](./examples/report-gallery/README.md) if the data is sensitive.
3. Submit a PR placing the 9 output files in `examples/report-gallery/<site-name>`.

### Contributing Launch Assets & Documentation

If you want to suggest improvements to our outreach drafts, video scripts, visual screenshot checklists, or general project documentation:
1. Open an issue proposing the change.
2. Modify or add draft templates under `examples/launch-assets/` or `docs/`.
3. Submit a PR.

### Dashboard Feedback & Bug Reports

For issues or improvements related to the self-hosted dashboard:
1. Open an issue describing the UI layout error or new feature request.
2. Run testing locally and verify dashboard server responsiveness before submitting code changes.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/Savior-Systems/OpenGrowth.git
cd OpenGrowth

# Install dependencies
npm install

# Run tests
npm test

# Run the CLI locally
npm run dev -- audit https://example.com
```

## Code Style

- TypeScript for all source code
- ESLint + Prettier for formatting
- Conventional Commits for commit messages (`feat:`, `fix:`, `docs:`, `chore:`)
- Write tests for new features and bug fixes

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Purpose |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `chore:` | Maintenance |
| `test:` | Test additions/changes |
| `refactor:` | Code refactoring |
| `perf:` | Performance improvements |

## Good First Issues

Look for issues labeled [`good first issue`](https://github.com/Savior-Systems/OpenGrowth/labels/good%20first%20issue) — these are great starting points.

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
