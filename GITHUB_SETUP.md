# 🚀 GitHub Repository Setup Instructions

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `elmora`
3. **Description**: `ELMORA - Your Personal Wellness Companion 🌸`
4. **Visibility**: Public (or Private if preferred)
5. **DON'T initialize with README** (we already have one)
6. **Click "Create repository"**

## Step 2: Push Local Repository to GitHub

Run these commands in your terminal:

```bash
# Add your GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/elmora.git

# Rename current branch to main (if it's not already)
git branch -M main

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Set Up Branch Protection Rules

After pushing to GitHub, set up branch protection to ensure code quality:

### Navigate to Settings
1. **Go to your repository** on GitHub
2. **Click "Settings"** tab
3. **Click "Branches"** in the left sidebar

### Create Branch Protection Rule
1. **Click "Add rule"**
2. **Branch name pattern**: `main`
3. **Enable these protections**:

#### Required Status Checks
- ☑️ **Require status checks to pass before merging**
- ☑️ **Require branches to be up to date before merging**

#### Pull Request Requirements
- ☑️ **Require a pull request before merging**
- ☑️ **Require approvals**: Set to `1`
- ☑️ **Dismiss stale PR approvals when new commits are pushed**
- ☑️ **Require review from code owners**

#### Additional Restrictions
- ☑️ **Restrict pushes that create files larger than 100MB**
- ☑️ **Require linear history**
- ☑️ **Include administrators** (This applies rules to you too)

#### Who Can Push to Main
- **ONLY YOU** can approve and merge pull requests
- **Other contributors** must create feature branches and PRs
- **No direct pushes to main** except by repository administrators

### Create the Rule
4. **Click "Create"** to save the branch protection rule

## Step 4: Set Up Repository Permissions

### Collaborator Settings
1. **Go to Settings → Collaborators and teams**
2. **Add collaborators** if needed:
   - Vinayak Gupta (Lead Developer & Project Maintainer)
   - Kanishka Narang (Frontend Developer)
   - Deepanshu (Backend Support Developer & UI/UX Designer)

### Permission Levels
- **You (Repository Owner)**: Admin access
- **Core Contributors**: Write access (can create branches and PRs)
- **External Contributors**: Fork and create PRs from their forks

## Step 5: Configure Additional Settings

### Issues and PRs
1. **Settings → General**
2. **Features section**:
   - ☑️ Issues
   - ☑️ Discussions (optional for community)
   - ☑️ Projects

### Templates (Optional)
Create issue and PR templates:

1. **Create `.github` folder** in your repository
2. **Add templates**:
   - `.github/ISSUE_TEMPLATE/bug_report.md`
   - `.github/ISSUE_TEMPLATE/feature_request.md`
   - `.github/pull_request_template.md`

## Step 6: Add Repository Topics

1. **Go to your repository main page**
2. **Click the gear ⚙️ icon** next to "About"
3. **Add topics**:
   - `wellness`
   - `react`
   - `typescript`
   - `supabase`
   - `mental-health`
   - `journaling`
   - `meditation`
   - `vite`
   - `tailwindcss`

## Step 7: Set Up Actions (Optional)

Create `.github/workflows/ci.yml` for automated testing:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run type check
      run: npm run typecheck
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
```

## Summary of Protection Rules

✅ **Main branch is protected**
✅ **All changes require Pull Requests**
✅ **Pull Requests require approval from maintainer**
✅ **Status checks must pass before merging**
✅ **Linear history is enforced**
✅ **Only repository admins can push directly to main**

## Workflow for Contributors

1. **Fork the repository** (external contributors) or **create feature branch** (core team)
2. **Make changes** in the feature branch
3. **Create Pull Request** to `main` branch
4. **Request review** from project maintainer
5. **Wait for approval** and CI checks to pass
6. **Merge** only after approval

This ensures code quality and prevents unauthorized changes to the main branch! 🔒