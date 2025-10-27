# Release Process

This document describes the release process for WP Kakitai.

## 🚀 Automated Release via GitHub Actions

The project uses GitHub Actions to automatically create releases when you push a version tag.

### Prerequisites

1. All changes are merged to `main` branch
2. All tests pass
3. Documentation is up to date
4. CHANGELOG.md is updated

### Step-by-Step Release Process

#### 1. Update Version Numbers Manually

Update the version in all files:

```bash
# For version 1.1.0, update:
# - package.json: "version": "1.1.0"
# - wp-kakitai.php: * Version: 1.1.0
# - wp-kakitai.php: define( 'WP_KAKITAI_VERSION', '1.1.0' );
# - readme.txt: Stable tag: 1.1.0
```

#### 2. Update CHANGELOG.md

Add release notes for the new version:

```markdown
## [Unreleased]

## [1.1.0] - 2025-10-27

### Added
- New landing page with Sakura Tech design
- Multilingual support (EN/FR/JA)

### Changed
- Updated Japanese font to Mochiy Pop P One
```

#### 3. Commit Changes

```bash
git add -A
git commit -m "chore: bump version to 1.1.0"
git push origin main
```

#### 4. Create and Push Tag

```bash
# Create an annotated tag matching the version
git tag -a v1.1.0 -m "Release version 1.1.0"

# Push the tag to trigger GitHub Actions
git push origin v1.1.0
```

**Important:** The workflow will verify that the tag version matches all file versions. If they don't match, the build will fail.

**GitHub Actions will then:**

- ✅ Verify version consistency across all files
- ✅ Install dependencies
- ✅ Build the plugin (`npm run build`)
- ✅ Create ZIP file with `/build`, `wp-kakitai.php`, `readme.txt`, `LICENSE`
- ✅ Publish the GitHub Release with release notes and ZIP file

#### 5. Verify Release

1. Go to [Releases page](https://github.com/firestar300/wp-kakitai/releases)
2. Verify the new release is published
3. Download `wp-kakitai.zip`
4. Test installation in WordPress

## 📦 What Gets Included in the Release ZIP

The automated build includes:

```
wp-kakitai/
├── build/
│   ├── index.js            (compiled JavaScript)
│   ├── index.asset.php     (WordPress asset file)
│   └── dict/               (Kuromoji dictionaries)
├── wp-kakitai.php          (main plugin file)
├── readme.txt              (WordPress.org readme)
└── LICENSE                 (GPL license)
```

**Note:** The following are NOT included in the release:

- `node_modules/`
- `src/` (source files)
- `vendor/` (Composer dependencies, dev only)
- `.git/`
- Development configuration files

## 🔢 Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)
  - **MAJOR**: Breaking changes
  - **MINOR**: New features (backward compatible)
  - **PATCH**: Bug fixes (backward compatible)

### Examples

- `1.0.0` → `1.0.1`: Bug fix release
- `1.0.0` → `1.1.0`: New feature added
- `1.0.0` → `2.0.0`: Breaking changes

### Pre-release Versions

For testing:

- `1.0.0-alpha.1`: Alpha release
- `1.0.0-beta.1`: Beta release
- `1.0.0-rc.1`: Release candidate

## 🛠️ Manual Release (Fallback)

If automated release fails, you can create a manual release:

### 1. Build Locally

```bash
# Install dependencies
npm ci

# Build for production
npm run build
```

### 2. Create ZIP

```bash
# Create plugin directory
mkdir -p wp-kakitai

# Copy files
cp -r build wp-kakitai/
cp wp-kakitai.php wp-kakitai/
cp readme.txt wp-kakitai/
cp LICENSE wp-kakitai/

# Create archive
zip -r wp-kakitai.zip wp-kakitai

# Cleanup
rm -rf wp-kakitai
```

### 3. Create GitHub Release

1. Go to [Releases page](https://github.com/firestar300/wp-kakitai/releases)
2. Click "Draft a new release"
3. Choose the tag (or create new)
4. Fill in release notes
5. Upload `wp-kakitai.zip`
6. Click "Publish release"

## 📋 Release Checklist

Use this checklist for each release:

### Pre-Release

- [ ] All features tested
- [ ] All bugs fixed
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version numbers updated in all files
- [ ] No console errors
- [ ] No PHP errors/warnings
- [ ] Linters pass (JS, CSS, PHP)

### Release

- [ ] Changes committed to main
- [ ] Tag created and pushed
- [ ] GitHub Action completed successfully
- [ ] Release published on GitHub

### Post-Release

- [ ] ZIP downloaded and tested
- [ ] Installation verified
- [ ] Functionality verified
- [ ] Release notes reviewed
- [ ] Announcement posted (if applicable)
- [ ] WordPress.org updated (future)

## 🐛 Hotfix Process

For urgent bug fixes:

```bash
# Create hotfix branch
git checkout -b hotfix/critical-bug main

# Fix the bug
# ... make changes ...

# Update version (patch bump)
# Update CHANGELOG.md

# Commit
git commit -m "fix: critical bug description"

# Merge to main
git checkout main
git merge hotfix/critical-bug

# Tag and push
git tag -a v1.0.1 -m "Hotfix: critical bug"
git push origin main v1.0.1

# Clean up
git branch -d hotfix/critical-bug
```

## 📖 Release Notes Template

When writing release notes, use this structure:

```markdown
## 🎉 Version X.Y.Z

### ✨ New Features
- Feature description

### 🐛 Bug Fixes
- Bug fix description

### 🔧 Improvements
- Improvement description

### 📝 Documentation
- Documentation updates

### ⚠️ Breaking Changes
- Any breaking changes (major versions only)

### 🙏 Contributors
Thanks to @username for their contributions!
```

## 🔐 Security Releases

For security-related releases:

1. **Do not disclose details publicly before release**
2. Prepare the fix in a private branch
3. Create release as usual
4. After release, disclose the security issue with:
   - Description of the vulnerability
   - Affected versions
   - Fixed version
   - Mitigation steps

## 📞 Need Help?

If you encounter issues during release:

1. Check GitHub Actions logs
2. Verify all files are included
3. Test the ZIP file locally
4. Open an issue if problems persist

---

**Next Steps After First Release:**

- Consider submitting to WordPress.org plugin directory
- Set up automated testing
- Consider creating a staging release process
