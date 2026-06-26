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

OpenGrowth's power comes from its modular rule packs. See [docs/rules-engine.md](./docs/rules-engine.md) for how to create custom rules.

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
