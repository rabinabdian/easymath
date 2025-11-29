# CLAUDE.md - AI Assistant Guide for EasyMath

## Repository Overview

**Repository:** rabinabdian/easymath
**Purpose:** Mathematics utility library/application
**Status:** Active Development

This document serves as a comprehensive guide for AI assistants working on the EasyMath codebase. It outlines the project structure, development workflows, coding conventions, and best practices.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Development Workflow](#development-workflow)
3. [Coding Conventions](#coding-conventions)
4. [Git Workflow](#git-workflow)
5. [Testing Guidelines](#testing-guidelines)
6. [Documentation Standards](#documentation-standards)
7. [AI Assistant Guidelines](#ai-assistant-guidelines)
8. [Common Tasks](#common-tasks)

---

## Project Structure

### Expected Directory Layout

```
easymath/
├── src/                    # Source code
│   ├── core/              # Core mathematical functions
│   ├── utils/             # Utility functions
│   ├── types/             # Type definitions
│   └── index.ts/js        # Main entry point
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── docs/                  # Documentation
├── examples/              # Usage examples
├── scripts/               # Build and utility scripts
├── .github/               # GitHub workflows and templates
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration (if applicable)
├── README.md              # Project overview and usage
├── CLAUDE.md              # This file - AI assistant guide
└── LICENSE                # Project license
```

### Key Directories

- **src/**: Contains all production source code
  - Keep code modular and well-organized by feature/domain
  - Use clear, descriptive naming conventions

- **tests/**: All test files mirror the src/ structure
  - Unit tests should be co-located or in parallel structure
  - Integration tests test multiple components together

- **docs/**: API documentation, guides, and tutorials
  - Keep documentation up-to-date with code changes
  - Include examples for complex features

---

## Development Workflow

### Setting Up Development Environment

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd easymath
   ```

2. **Install dependencies**
   ```bash
   npm install  # or yarn install / pnpm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Start development mode**
   ```bash
   npm run dev  # or equivalent watch mode
   ```

### Branch Strategy

- **Main branch**: `main` or `master` - Production-ready code
- **Feature branches**: `claude/<session-id>` for AI-assisted development
- **Development branches**: `dev` or `develop` - Integration branch (if used)

### Making Changes

1. **Create/checkout feature branch**
   ```bash
   git checkout -b feature/description
   ```

2. **Make changes following coding conventions**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test changes thoroughly**
   ```bash
   npm test
   npm run lint  # if linting is configured
   ```

4. **Commit with clear messages**
   ```bash
   git add .
   git commit -m "feat: add description of changes"
   ```

---

## Coding Conventions

### General Principles

1. **Clarity over Cleverness**: Write code that is easy to understand
2. **DRY (Don't Repeat Yourself)**: Extract common patterns into reusable functions
3. **KISS (Keep It Simple, Stupid)**: Avoid over-engineering
4. **YAGNI (You Aren't Gonna Need It)**: Don't add features speculatively

### Naming Conventions

- **Variables & Functions**: `camelCase`
  ```javascript
  const calculateSum = (a, b) => a + b;
  const userAge = 25;
  ```

- **Classes & Types**: `PascalCase`
  ```javascript
  class MathCalculator { }
  type UserProfile = { };
  ```

- **Constants**: `UPPER_SNAKE_CASE`
  ```javascript
  const MAX_VALUE = 100;
  const API_ENDPOINT = 'https://api.example.com';
  ```

- **Private members**: Prefix with underscore `_privateMethod`
  ```javascript
  class Calculator {
    _internalState = 0;
  }
  ```

### Code Style

- **Indentation**: 2 spaces (or 4 spaces, maintain consistency)
- **Line Length**: Maximum 100-120 characters
- **Semicolons**: Use consistently (either always or never)
- **Quotes**: Single quotes for strings (configurable)
- **Trailing Commas**: Use in multiline arrays/objects

### Function Design

```javascript
// Good: Clear, single responsibility
function calculateArea(radius) {
  return Math.PI * radius * radius;
}

// Bad: Multiple responsibilities
function calculateAndLogArea(radius) {
  const area = Math.PI * radius * radius;
  console.log(area);
  return area;
}
```

### Comments

- **Use comments to explain WHY, not WHAT**
  ```javascript
  // Good
  // Using binary search for O(log n) performance on sorted array
  function binarySearch(arr, target) { ... }

  // Bad
  // This function searches an array
  function binarySearch(arr, target) { ... }
  ```

- **Document complex algorithms**
- **Keep comments up-to-date** with code changes
- **Remove commented-out code** before committing

---

## Git Workflow

### Commit Message Format

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(calculator): add square root function"
git commit -m "fix(utils): correct precision error in decimal calculations"
git commit -m "docs: update API documentation for math functions"
```

### Branch Naming

- Feature: `feature/<description>` or `feat/<description>`
- Bugfix: `fix/<description>` or `bugfix/<description>`
- Claude AI: `claude/<session-id>`

### Pull Request Guidelines

1. **Clear title and description**
2. **Reference related issues**: "Fixes #123" or "Closes #456"
3. **Include test coverage**
4. **Update documentation** if needed
5. **Ensure CI passes** before requesting review

---

## Testing Guidelines

### Testing Philosophy

- **Write tests first** (TDD approach recommended)
- **Test behavior, not implementation**
- **Aim for high coverage** (>80% for critical code)
- **Keep tests simple and readable**

### Test Structure

```javascript
describe('MathCalculator', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      const result = add(2, 3);
      expect(result).toBe(5);
    });

    it('should handle negative numbers', () => {
      const result = add(-2, 3);
      expect(result).toBe(1);
    });

    it('should handle floating point numbers', () => {
      const result = add(0.1, 0.2);
      expect(result).toBeCloseTo(0.3);
    });
  });
});
```

### Test File Naming

- Unit tests: `*.test.js` or `*.spec.js`
- Integration tests: `*.integration.test.js`
- Keep test files adjacent to source or in parallel `tests/` directory

### Edge Cases to Consider

- **Null/undefined inputs**
- **Empty arrays/objects**
- **Boundary values** (min/max)
- **Floating point precision**
- **Type coercion**
- **Error conditions**

---

## Documentation Standards

### Code Documentation

1. **Function/Method Documentation**
   ```javascript
   /**
    * Calculates the factorial of a number
    * @param {number} n - The number to calculate factorial for
    * @returns {number} The factorial of n
    * @throws {Error} If n is negative
    * @example
    * factorial(5); // returns 120
    */
   function factorial(n) {
     if (n < 0) throw new Error('Negative numbers not supported');
     return n <= 1 ? 1 : n * factorial(n - 1);
   }
   ```

2. **Module/File Documentation**
   ```javascript
   /**
    * @module mathUtils
    * @description Utility functions for mathematical operations
    */
   ```

### README Requirements

- **Project description** and purpose
- **Installation instructions**
- **Usage examples**
- **API documentation** or link to docs
- **Contributing guidelines**
- **License information**

---

## AI Assistant Guidelines

### When Working on This Codebase

1. **Always Read Before Writing**
   - Never propose changes to code you haven't read
   - Understand existing patterns before adding new code
   - Check for existing similar functionality

2. **Maintain Consistency**
   - Follow existing code style and patterns
   - Use the same naming conventions as surrounding code
   - Match the project's architectural decisions

3. **Avoid Over-Engineering**
   - Only implement what's explicitly requested
   - Don't add "nice to have" features without asking
   - Keep solutions simple and focused
   - Three similar lines are better than premature abstraction

4. **Security Considerations**
   - Avoid command injection vulnerabilities
   - Sanitize user inputs
   - Don't expose sensitive information in logs/errors
   - Use safe parsing methods for external data

5. **Testing Requirements**
   - Write tests for new features
   - Update tests when modifying existing code
   - Ensure all tests pass before committing
   - Test edge cases and error conditions

6. **Documentation Updates**
   - Update README if adding public API
   - Add inline comments for complex logic
   - Update this CLAUDE.md if changing workflows
   - Keep examples up-to-date

7. **Git Practices**
   - Create commits with clear, descriptive messages
   - Use conventional commit format
   - Push to correct branch (usually `claude/<session-id>`)
   - Don't push to main/master without explicit permission

8. **Communication**
   - Ask for clarification when requirements are ambiguous
   - Explain complex changes clearly
   - Highlight breaking changes
   - Report any issues or blockers immediately

### Task Planning

Use the TodoWrite tool to:
- Plan multi-step tasks
- Track progress on complex features
- Ensure all requirements are met
- Provide visibility to users

### Code Review Self-Checklist

Before committing, verify:
- [ ] Code follows project conventions
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities introduced
- [ ] No backwards-compatibility issues (unless intentional)
- [ ] Removed any debugging code/console.logs
- [ ] Removed unused imports and dead code
- [ ] Error handling is appropriate
- [ ] Code is readable and maintainable

---

## Common Tasks

### Adding a New Math Function

1. **Create function in appropriate module** (e.g., `src/core/arithmetic.js`)
2. **Add JSDoc documentation**
3. **Export from module**
4. **Write comprehensive tests** in `tests/unit/`
5. **Update main index file** if adding to public API
6. **Add usage example** to README or examples/
7. **Run tests**: `npm test`
8. **Commit**: `git commit -m "feat(arithmetic): add <function name>"`

### Fixing a Bug

1. **Reproduce the bug** with a failing test
2. **Identify the root cause**
3. **Fix the bug** with minimal changes
4. **Verify test passes**
5. **Check for similar issues** elsewhere
6. **Commit**: `git commit -m "fix(<scope>): <description>"`

### Refactoring Code

1. **Ensure tests exist** for code being refactored
2. **Make small, incremental changes**
3. **Run tests after each change**
4. **Maintain external API compatibility**
5. **Commit**: `git commit -m "refactor(<scope>): <description>"`

### Adding Dependencies

1. **Evaluate if dependency is necessary**
2. **Check for security issues** (npm audit)
3. **Consider bundle size impact**
4. **Add to package.json**: `npm install <package>`
5. **Document usage** if it affects API
6. **Commit package.json and lock file**

---

## Performance Considerations

### For Mathematical Operations

1. **Minimize object allocation** in hot paths
2. **Use typed arrays** for large numerical datasets
3. **Cache expensive calculations** when appropriate
4. **Prefer iterative over recursive** for better performance
5. **Profile before optimizing** - don't guess

### Floating Point Precision

```javascript
// Be aware of floating point precision issues
0.1 + 0.2 === 0.3  // false!

// Use epsilon comparisons for floating point
function almostEqual(a, b, epsilon = 1e-10) {
  return Math.abs(a - b) < epsilon;
}
```

---

## Error Handling

### Function Error Handling

```javascript
// Use descriptive error messages
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

// Validate inputs early
function factorial(n) {
  if (typeof n !== 'number') {
    throw new TypeError('Input must be a number');
  }
  if (n < 0) {
    throw new RangeError('Input must be non-negative');
  }
  if (!Number.isInteger(n)) {
    throw new RangeError('Input must be an integer');
  }
  // ... implementation
}
```

### Error Types

- **TypeError**: Wrong type of argument
- **RangeError**: Number out of valid range
- **Error**: General errors

---

## Resources

### Useful Links

- Repository: http://local_proxy@127.0.0.1:55899/git/rabinabdian/easymath
- Issues: Track bugs and feature requests
- Discussions: For questions and ideas

### Mathematical References

- MDN Math Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
- Numerical Recipes (for algorithms)
- IEEE 754 (floating point standard)

---

## Version History

- **Initial Version** - Created comprehensive AI assistant guide
- This document should be updated as the project evolves

---

## Questions or Issues?

If you encounter any issues or have questions about development practices:
1. Check existing documentation
2. Review similar code in the codebase
3. Ask for clarification from the project maintainer
4. Update this document if you find gaps

---

**Last Updated:** 2025-11-29
**Maintained By:** AI Assistants working on rabinabdian/easymath
