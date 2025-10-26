# Quick Start Guide

## 🚀 For Users

### Installation

1. Download `wp-kakitai.zip` from [Releases](https://github.com/firestar300/wp-kakitai/releases)
2. In WordPress: **Plugins → Add New → Upload Plugin**
3. Choose the ZIP file and click **Install Now**
4. **Activate** the plugin

### Usage

1. Open the **Gutenberg editor**
2. Select Japanese text with kanji
3. Click the **🌐 Furigana** button in the toolbar
4. Done! Click again to remove furigana

## 💻 For Developers

### Setup

```bash
# Clone and install
git clone https://github.com/firestar300/wp-kakitai.git
cd wp-kakitai
npm install
composer install

# Start development
npm start
```

### Quick Commands

```bash
npm run build     # Production build
npm run lint:js   # Lint JavaScript
npm run lint:css  # Lint CSS
composer lint     # Lint PHP
npm run format    # Auto-format code
```

### Make Changes

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, then commit
git add .
git commit -m "feat: description"
git push origin feature/my-feature

# Open Pull Request on GitHub
```

## 📦 Making a Release

### Quick Release

```bash
# 1. Update version in:
#    - wp-kakitai.php (line 5)
#    - readme.txt (line 6)
#    - package.json (line 3)
#    - CHANGELOG.md

# 2. Commit and tag
git add .
git commit -m "chore: bump version to 1.0.0"
git push origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 3. GitHub Actions automatically:
#    - Builds the plugin
#    - Creates a release
#    - Uploads wp-kakitai.zip
```

See [RELEASE.md](RELEASE.md) for detailed instructions.

## 📚 Documentation

- [README.md](README.md) - Full documentation
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [RELEASE.md](RELEASE.md) - Detailed release process

## 🐛 Found a Bug?

[Open an issue](https://github.com/firestar300/wp-kakitai/issues/new?template=bug_report.md)

## 💡 Have an Idea?

[Request a feature](https://github.com/firestar300/wp-kakitai/issues/new?template=feature_request.md)

## 🤝 Want to Contribute?

Read [CONTRIBUTING.md](CONTRIBUTING.md) and open a Pull Request!

---

**Need more help?** Check the full [README.md](README.md) or [open a discussion](https://github.com/firestar300/wp-kakitai/discussions).
