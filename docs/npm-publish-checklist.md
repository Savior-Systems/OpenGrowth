# npm Publish Checklist

Step-by-step checklist for publishing OpenGrowth to the npm registry.

## Pre-Publish

1. **Verify all tests pass**
   ```bash
   npm run verify
   ```

2. **Check package contents**
   ```bash
   npm pack --dry-run
   ```
   Ensure only intended files are included:
   - `dist/` — Compiled JavaScript and type declarations
   - `README.md` — Package readme (shown on npmjs.com)
   - `LICENSE` — MIT license
   - `CHANGELOG.md` — Version history
   - `docs/` — Documentation files
   - `examples/` — Example audit outputs
   - `action.yml` — GitHub Action definition
   - `package.json` — Package metadata

3. **Check package size**
   The packed tarball should be reasonable (under 1 MB). If it's significantly larger, check for accidentally included files.

4. **Run npm audit**
   ```bash
   npm audit
   ```
   Resolve any critical or high severity vulnerabilities before publishing.

5. **Verify version**
   ```bash
   node dist/cli.js --version
   ```
   Should output `1.0.0-rc.1` (or the target version).

## Publishing

6. **Login to npm** (if not already logged in)
   ```bash
   npm login
   ```

7. **Publish with tag**
   For release candidates:
   ```bash
   npm publish --tag next
   ```
   For stable releases:
   ```bash
   npm publish
   ```

8. **Verify on npmjs.com**
   - Visit https://www.npmjs.com/package/opengrowth
   - Check README renders correctly
   - Check version is correct
   - Check files list is correct

## Post-Publish

9. **Test installation**
   ```bash
   npx opengrowth --version
   npx opengrowth audit https://example.com --output /tmp/test-report
   ```

10. **Create GitHub Release**
    - Tag: `v1.0.0-rc.1`
    - Title: `v1.0.0-rc.1 — Launch Candidate`
    - Body: Copy from `docs/v1-release-notes.md`
    - Mark as pre-release (for RC versions)

## Version Bumping Rules

| Scenario | Version | npm Tag |
|---|---|---|
| Release candidate | `1.0.0-rc.1` | `next` |
| Stable release | `1.0.0` | `latest` |
| Patch fix | `1.0.1` | `latest` |
| Minor feature | `1.1.0` | `latest` |
