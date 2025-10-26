# Contributing to WP Kakitai

Thank you for considering contributing to WP Kakitai! This document outlines the process and guidelines for contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- WordPress 6.7+
- PHP 7.4+
- Composer
- Git

### Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/wp-kakitai.git
cd wp-kakitai
```

2. **Install dependencies**

```bash
npm install
composer install
```

3. **Start development mode**

```bash
npm start
```

This will watch for file changes and rebuild automatically.

## 📋 Development Workflow

### Branch Naming

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Performance: `perf/description`

Example: `feature/add-custom-block-support`

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**

```
feat: add support for list blocks
fix: resolve furigana duplication issue
docs: update installation instructions
```

### Making Changes

1. **Create a new branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

- Write clean, readable code
- Follow WordPress coding standards
- Add comments where necessary
- Update documentation if needed

3. **Test your changes**

```bash
# Build for production
npm run build

# Run linters
npm run lint:js
npm run lint:css
composer lint
```

4. **Commit your changes**

```bash
git add .
git commit -m "feat: your feature description"
```

5. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request**

- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Fill in the PR template
- Submit the PR

## 🎨 Coding Standards

### JavaScript

- Follow [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- Use ESLint (configured via `@wordpress/scripts`)
- Run `npm run format` before committing

**Key Points:**

- Use tabs for indentation
- Use single quotes for strings
- Add JSDoc comments to functions
- Use meaningful variable names

### PHP

- Follow [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- Use PHPCS (configured in `phpcs.xml.dist`)
- Run `composer format` to auto-fix issues

**Key Points:**

- Use tabs for indentation
- Add PHPDoc comments to all functions
- Use WordPress core functions when available
- Follow naming conventions

### CSS/SCSS

- Follow [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)
- Use BEM methodology when appropriate
- Mobile-first approach

## 🧪 Testing

### Manual Testing

1. Install the plugin in a WordPress instance
2. Test in the Gutenberg editor
3. Verify furigana are correctly added and removed
4. Test with different types of Japanese text
5. Check browser console for errors

### Testing Checklist

- [ ] Plugin activates without errors
- [ ] Furigana button appears in toolbar
- [ ] Furigana are correctly added
- [ ] Furigana can be removed
- [ ] Works with Paragraph blocks
- [ ] Works with Heading blocks
- [ ] No JavaScript errors in console
- [ ] No PHP errors in debug log

## 📝 Documentation

When contributing, please:

- Update README.md if you change functionality
- Add entries to CHANGELOG.md
- Update readme.txt for WordPress.org compatibility
- Add JSDoc/PHPDoc comments to new functions
- Include inline comments for complex logic

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues to avoid duplicates
2. Test with the latest version
3. Disable other plugins to rule out conflicts
4. Try with a default WordPress theme

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- WordPress version:
- PHP version:
- Browser and version:
- WP Kakitai version:
```

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check if the feature was already requested
2. Explain the use case clearly
3. Describe how it would work
4. Consider implementation complexity

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Accept responsibility for mistakes
- Prioritize community benefit

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Unprofessional conduct

## 🎯 Pull Request Process

1. **Ensure your code passes all checks**
   - Linting (JS, CSS, PHP)
   - Build succeeds
   - Manual testing completed

2. **Update documentation**
   - README if needed
   - CHANGELOG with your changes
   - Code comments

3. **Fill out the PR template**
   - Describe your changes
   - Reference related issues
   - Include testing notes

4. **Wait for review**
   - Respond to feedback promptly
   - Make requested changes
   - Be patient and respectful

5. **Merge**
   - Once approved, maintainers will merge
   - Your contribution will be credited

## 📞 Questions?

If you have questions:

- Open a [GitHub Discussion](https://github.com/firestar300/wp-kakitai/discussions)
- Check existing documentation
- Ask in your Pull Request

## 🙏 Thank You

Every contribution helps make WP Kakitai better. Whether it's code, documentation, bug reports, or feature ideas – thank you for being part of this project!

---

Made with ❤️ for the Japanese language learning community
