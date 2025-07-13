# Branch Protection Configuration Guide

This guide explains how to set up branch protection rules for the video-n8n repository to ensure code quality and proper CI/CD workflow.

## Required Branch Protection Rules

### Main Branch Protection

Configure the following rules for the `main` branch:

#### General Settings
- ✅ **Restrict pushes that create files larger than 100 MB**
- ✅ **Require a pull request before merging**
- ✅ **Require approvals**: 1 approval required
- ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require review from code owners** (if CODEOWNERS file exists)

#### Status Checks
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**

**Required Status Checks:**
- `All Checks Status`
- `Code Quality`
- `Security Scan` 
- `Test Suite`
- `Build Verification`
- `Dependency Analysis`

#### Additional Restrictions
- ✅ **Restrict pushes that create files larger than 100 MB**
- ✅ **Include administrators** (administrators must follow these rules too)
- ✅ **Allow force pushes**: ❌ Disabled
- ✅ **Allow deletions**: ❌ Disabled

### Develop Branch Protection (Optional)

For a development branch workflow, configure similar but slightly relaxed rules:

#### General Settings
- ✅ **Require a pull request before merging**
- ✅ **Require approvals**: 1 approval required
- ❌ **Dismiss stale PR approvals**: Optional

#### Status Checks
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**

**Required Status Checks:**
- `Code Quality`
- `Test Suite`
- `Build Verification`

## How to Configure Branch Protection

### Via GitHub Web Interface

1. Go to your repository on GitHub
2. Click **Settings** → **Branches**
3. Click **Add rule** or edit existing rule
4. Enter branch name pattern: `main`
5. Configure the settings as described above
6. Click **Create** or **Save changes**

### Via GitHub CLI

```bash
# Install GitHub CLI if not already installed
# brew install gh (macOS) or see https://cli.github.com/

# Login to GitHub
gh auth login

# Create branch protection rule for main
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["All Checks Status","Code Quality","Security Scan","Test Suite","Build Verification","Dependency Analysis"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
  --field restrictions=null
```

### Via Repository Settings API

```bash
# Using curl with personal access token
curl -X PUT \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/branches/main/protection \
  -d '{
    "required_status_checks": {
      "strict": true,
      "contexts": [
        "All Checks Status",
        "Code Quality", 
        "Security Scan",
        "Test Suite",
        "Build Verification",
        "Dependency Analysis"
      ]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": false
    },
    "restrictions": null
  }'
```

## Epic Branch Workflow

### Epic Branch Naming Convention
- `epic-1-foundation`
- `epic-2-api-core`  
- `epic-3-third-party`
- `epic-4-file-proc`
- `epic-5-workflows`
- `epic-6-7-quality`

### Epic Branch Protection (Optional)
For long-running epic branches, consider lighter protection:

#### Settings
- ✅ **Require status checks to pass before merging**
- ❌ **Require approvals**: Not required for epic branches
- ❌ **Require branches to be up to date**: Optional

**Required Status Checks:**
- `Code Quality`
- `Test Suite`

## Workflow Integration

### PR Creation Process
1. Create feature branch from epic branch: `epic-1-foundation`
2. Make changes and commit
3. Push branch and create PR to `main`
4. Wait for all CI/CD checks to pass
5. Request review (if required)
6. Merge after approval and passing checks

### Emergency Hotfix Process
For critical production issues:

1. Create hotfix branch from `main`
2. Make minimal fix
3. Create PR with **[HOTFIX]** prefix
4. Expedited review process
5. Merge with admin override if necessary

## Status Check Details

### All Checks Status
- Aggregates results from all other required checks
- Must pass for PR to be mergeable

### Code Quality
- TypeScript compilation
- ESLint linting
- Prettier formatting
- TODO/FIXME comment check
- Console.log detection

### Security Scan
- npm audit for vulnerabilities
- Hardcoded secret detection
- Environment variable usage validation

### Test Suite
- Unit tests with coverage
- Integration tests
- Coverage reporting (minimum 70%)

### Build Verification
- TypeScript compilation
- Docker build test
- Docker Compose validation

### Dependency Analysis
- Dependency change detection
- Unused dependency check
- Bundle size analysis

## Troubleshooting

### Common Issues

**Status checks not appearing:**
- Ensure the workflow files are in the `main` branch
- Check workflow syntax with `github-actions[bot]`
- Verify branch names match exactly

**Tests failing in CI but passing locally:**
- Check environment variables in `.env.test`
- Ensure database/Redis services are running in CI
- Verify Node.js version consistency

**Docker build failing:**
- Check Dockerfile syntax
- Ensure all dependencies are properly specified
- Verify multi-stage build configuration

### Support

For issues with branch protection or CI/CD:

1. Check GitHub Actions logs for detailed error messages
2. Review the PR template checklist
3. Ensure all required files are present and correctly configured
4. Test locally with `npm test` and `npm run build`

## Best Practices

1. **Keep PRs small and focused** - easier to review and test
2. **Write descriptive commit messages** - helps with debugging
3. **Include tests for new features** - maintains code quality
4. **Update documentation** - keeps the project maintainable
5. **Follow the epic branch strategy** - enables parallel development
6. **Monitor CI/CD pipeline performance** - optimize for faster feedback

---

**Note**: These settings ensure high code quality and prevent broken code from reaching production while enabling efficient parallel development across multiple epic branches.