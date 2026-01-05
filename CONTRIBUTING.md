# Contributing to Reliable Email Delivery 🚀

Thank you for your interest in contributing to Reliable Email Delivery! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

We welcome contributions in the form of:

- 🐛 **Bug reports and fixes**
- ✨ **New features and enhancements**
- 📚 **Documentation improvements**
- 🧪 **Test coverage improvements**
- 🎨 **UI/UX improvements**
- ⚡ **Performance optimizations**

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (we recommend pnpm)
- **Git**

### Setting Up the Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/reliable-email-delivery.git
   cd reliable-email-delivery
   ```

2. **Install dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your email provider credentials
   # See README.md for detailed configuration instructions
   ```

4. **Run the development server**
   ```bash
   # Start the development server
   pnpm dev
   
   # Open http://localhost:3000 in your browser
   ```

5. **Run tests**
   ```bash
   # Run the test suite
   pnpm test
   
   # Run tests in watch mode
   pnpm test:watch
   
   # Run linting
   pnpm lint
   ```

## 🏗️ Project Structure

Understanding the project structure will help you navigate the codebase:

```
reliable-email-delivery/
├── app/                    # Next.js 14 app router
├── components/            # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── email/           # Email-related functionality
│   ├── templates.ts     # Email templates
│   └── utils.ts         # General utilities
├── public/               # Static assets
├── styles/               # Global styles
├── __tests__/            # Test files
│   ├── CircuitBreaker.test.ts
│   ├── EmailService.test.ts
│   ├── RateLimiter.test.ts
│   └── RetryManager.test.ts
└── ...                   # Configuration files
```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: We use TypeScript for type safety
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is handled by Prettier
- **Naming Conventions**:
  - Use `camelCase` for variables and functions
  - Use `PascalCase` for components and classes
  - Use `kebab-case` for file names

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

Examples:
feat(email): add new retry mechanism
fix(ui): resolve dashboard loading issue
docs: update API documentation
test(service): add unit tests for rate limiter
refactor(components): extract common button logic
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting changes
- `refactor`: Code restructuring without functionality changes
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

### Branch Naming

Use descriptive branch names with the following pattern:
```
type/short-description

Examples:
feat/add-webhook-support
fix/circuit-breaker-timeout
docs/update-contributing-guide
test/add-integration-tests
```

## 🧪 Testing Guidelines

### Writing Tests

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **Coverage**: Aim for >80% test coverage
- **Test Files**: Place tests in `__tests__/` directory
- **Naming**: Use descriptive test names that explain what is being tested

### Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup code
  });

  it('should do something specific when condition is met', () => {
    // Test implementation
  });

  it('should handle error case appropriately', () => {
    // Error handling test
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test EmailService.test.ts
```

## 📝 Documentation

When contributing, please ensure:

- **Code Comments**: Add JSDoc comments for public APIs
- **README Updates**: Update README.md if adding new features
- **Type Definitions**: Ensure TypeScript types are properly defined
- **Examples**: Provide usage examples for new features

## 🔍 Code Review Process

1. **Create Pull Request**: Submit a PR with a clear title and description
2. **Fill PR Template**: Complete the pull request template
3. **Tests**: Ensure all tests pass and coverage is maintained
4. **Review**: Wait for maintainer review and address feedback
5. **Merge**: Once approved, maintainers will merge your PR

### Pull Request Guidelines

- **Clear Title**: Use descriptive titles following conventional commits
- **Description**: Explain what changes you made and why
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how you tested your changes
- **Breaking Changes**: Clearly mark any breaking changes

## 🐛 Reporting Issues

When reporting bugs, please include:

- **Clear Title**: Descriptive issue title
- **Environment**: OS, Node.js version, browser (if applicable)
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Error Messages**: Any error messages or logs

## ✨ Feature Requests

For feature requests:

- **Use Case**: Describe the problem your feature solves
- **Proposed Solution**: Your idea for implementing the feature
- **Alternatives**: Other solutions you've considered
- **Additional Context**: Any other relevant information

## 🏆 Recognition

Contributors will be:

- **Listed in CONTRIBUTORS.md**
- **Mentioned in release notes** for significant contributions
- **Invited to join** the maintainers team for outstanding contributions

## 📞 Getting Help

If you need help:

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and discussions

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Reliable Email Delivery! 🎉**

Your contributions help make this project better for everyone in the community.