# OpenGrowth Final v1.0 Release Approval Checklist

> **CRITICAL:** Do not run publish or tag commands until explicit final approval from Savior Systems leadership/user.

## 1. Release Identification
- **Current Candidate Version:** `1.0.0-rc.1`
- **Release Target:** `1.0.0`
- **Branch:** `main`
- **Latest Hardening Commit:** `0e9ae03 feat: launch candidate hardening (v1.0.0-rc.1)`

## 2. Verification Status

| Checklist Item | Status | Notes |
|---|---|---|
| **TypeScript Typecheck** | ✅ PASSED | `npm run typecheck` passes with zero errors |
| **Unit & Integration Tests** | ✅ PASSED | `176 / 176` tests passed successfully |
| **Linter (ESLint)** | ✅ PASSED | Clean output, no unused variables or explicit 'any' |
| **Production Build** | ✅ PASSED | `tsup` ESM outputs compiled successfully to `dist/` |
| **CLI Verification** | ✅ PASSED | Manual audit command runs correctly with version `1.0.0-rc.1` |
| **Dashboard Verification** | ✅ PASSED | Start-up and help commands verified, test suite passes |
| **GitHub CI Status** | ⏳ PENDING | Check status at: https://github.com/Savior-Systems/OpenGrowth/actions |

## 3. Package Audit & Content Check

### npm Audit
- **Status:** 1 Low Severity DevDependency issue related to `esbuild` development server on Windows (does not affect production bundle).
- **Vulnerabilities in Production:** 0

### npm Pack Dry Run Check
- **Tarball size:** `295.1 kB`
- **Unpacked size:** `1.3 MB`
- **Total files:** `48`
- **Excluded successfully:** `.local-ai/`, `opengrowth-report/`, `.opengrowth-data/`, `.git/`, `.env`, and all other local folders.
- **Included successfully:** `dist/`, `README.md`, `LICENSE`, `CHANGELOG.md`, `docs/`, `examples/`, and `action.yml`.

## 4. Final Release Steps (NOT EXECUTED)

To promote this launch candidate to the stable `1.0.0` release, run the following commands in order:

```bash
# 1. Bump version in package.json without creating a git tag automatically
npm version 1.0.0 --no-git-tag-version

# 2. Run final local verification (typecheck, tests, build)
npm run verify

# 3. Check for any moderate or higher vulnerabilities
npm audit --audit-level=moderate

# 4. Perform dry-run package verification
npm pack --dry-run

# 5. Check git status to ensure working directory is clean except for the version bump
git status

# 6. Stage only public source, config, and docs files
git add package.json package-lock.json src tests docs README.md CHANGELOG.md ROADMAP.md SECURITY.md SUPPORT.md

# 7. Commit the stable release version bump
git commit -m "chore: release v1.0.0"

# 8. Create annotated git tag pointing to the release commit
git tag -a v1.0.0 -m "v1.0.0: stable OpenGrowth release"

# 9. Push the release commit and tag to remote repository
git push origin main
git push origin v1.0.0

# 10. Publish the package to public npm registry
npm publish --access public
```

> [!IMPORTANT]
> **Warning on Release Tagging:**
> Do not tag v1.0.0 while package.json is still 1.0.0-rc.1. The stable tag must point to the commit where package.json says 1.0.0.

## 5. Rollback Plan

If a blocker is found post-release:

1. **Deprecate the package on npm**
   ```bash
   npm deprecate opengrowth@1.0.0 "Critical issue found. Please use 1.0.0-rc.1"
   ```

2. **Revert main branch**
   ```bash
   git revert HEAD
   git push origin main
   ```
