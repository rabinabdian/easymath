# CLAUDE.md - AI Assistant Guide for EasyMath

## Repository Overview

**Repository:** rabinabdian/easymath
**Purpose:** Mathematics utility web application
**Tech Stack:** React 19 + TypeScript + Vite + React Router
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

### Current Directory Layout

```
easymath/
├── src/                    # React application source code
│   ├── assets/            # Static assets (images, fonts, etc.)
│   ├── components/        # React components (to be created)
│   ├── pages/             # Page components for routing (to be created)
│   ├── hooks/             # Custom React hooks (to be created)
│   ├── utils/             # Utility functions and helpers
│   ├── types/             # TypeScript type definitions
│   ├── styles/            # Global styles and theme
│   ├── App.tsx            # Main App component
│   ├── App.css            # App component styles
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global CSS styles
├── public/                 # Static public assets
│   └── vite.svg           # Favicon and static files
├── node_modules/           # NPM dependencies (gitignored)
├── .git/                   # Git repository data
├── .gitignore              # Git ignore rules
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Locked dependency versions
├── tsconfig.json           # Base TypeScript configuration
├── tsconfig.app.json       # App-specific TypeScript config
├── tsconfig.node.json      # Node-specific TypeScript config
├── vite.config.ts          # Vite bundler configuration
├── eslint.config.js        # ESLint configuration
├── README.md               # Vite-generated project overview
└── CLAUDE.md               # This file - AI assistant guide
```

### Key Directories

- **src/**: Contains all React application source code
  - **components/**: Reusable React components
  - **pages/**: Top-level page components for each route
  - **hooks/**: Custom React hooks for shared logic
  - **utils/**: Helper functions and utilities
  - **types/**: TypeScript interfaces and type definitions
  - **assets/**: Images, icons, and other static assets imported in code

- **public/**: Static files served directly
  - Files here are copied as-is to the build output
  - Use for favicon, robots.txt, etc.

- **Configuration Files**:
  - **vite.config.ts**: Vite build tool configuration
  - **tsconfig.*.json**: TypeScript compiler options
  - **eslint.config.js**: Code linting rules

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
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # Vite dev server with hot module replacement (HMR)
   # Usually runs at http://localhost:5173
   ```

4. **Build for production**
   ```bash
   npm run build
   # Creates optimized production build in dist/
   ```

5. **Preview production build**
   ```bash
   npm run preview
   # Serves the production build locally for testing
   ```

6. **Run linter**
   ```bash
   npm run lint
   # Checks code for linting errors
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
  ```typescript
  class MathCalculator { }
  type UserProfile = { };
  interface CalculatorProps { }
  ```

- **React Components**: `PascalCase` (both files and component names)
  ```typescript
  // File: src/components/Calculator.tsx
  export function Calculator() { }
  export const MathInput: React.FC = () => { };
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

### React & TypeScript Conventions

#### Component Structure

```typescript
// Prefer function components with TypeScript
interface CalculatorProps {
  initialValue?: number;
  onCalculate: (result: number) => void;
}

export function Calculator({ initialValue = 0, onCalculate }: CalculatorProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="calculator">
      {/* Component JSX */}
    </div>
  );
}
```

#### Component Organization

1. **File structure per component**:
   ```
   components/
   ├── Calculator/
   │   ├── Calculator.tsx       # Component logic
   │   ├── Calculator.css       # Component styles (or .module.css)
   │   ├── Calculator.test.tsx  # Component tests
   │   └── index.ts             # Barrel export
   ```

2. **Component file order**:
   - Imports (React, third-party, local)
   - Type definitions and interfaces
   - Component definition
   - Exports

#### Hooks Guidelines

- **Use built-in hooks appropriately**:
  - `useState` for component state
  - `useEffect` for side effects
  - `useMemo` for expensive calculations
  - `useCallback` for callback memoization
  - `useRef` for DOM references

- **Custom hooks**:
  ```typescript
  // File: src/hooks/useCalculator.ts
  export function useCalculator(initialValue = 0) {
    const [result, setResult] = useState(initialValue);

    const calculate = useCallback((operation: string, value: number) => {
      // calculation logic
    }, []);

    return { result, calculate };
  }
  ```

#### TypeScript Best Practices

- **Explicit prop types**: Always define prop interfaces
- **Avoid `any`**: Use `unknown` or proper types
- **Leverage type inference**: Don't over-annotate when TypeScript can infer
- **Use strict mode**: Keep TypeScript strict settings enabled

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function UserProfile({ user }: { user: User }) {
  // TypeScript ensures type safety
}

// Bad
function UserProfile({ user }: { user: any }) {
  // No type safety
}
```

#### React Router Patterns

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### State Management

- **Local state**: Use `useState` for component-specific state
- **Shared state**: Use Context API for app-wide state
- **Complex state**: Consider using `useReducer` for complex state logic

```typescript
// Context example for shared state
interface MathContextType {
  history: number[];
  addToHistory: (value: number) => void;
}

const MathContext = createContext<MathContextType | undefined>(undefined);

export function MathProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<number[]>([]);

  const addToHistory = useCallback((value: number) => {
    setHistory(prev => [...prev, value]);
  }, []);

  return (
    <MathContext.Provider value={{ history, addToHistory }}>
      {children}
    </MathContext.Provider>
  );
}
```

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

- **Test behavior, not implementation**
- **Aim for meaningful coverage** (focus on critical paths)
- **Keep tests simple and readable**
- **Test user interactions, not internals**

### React Component Testing

Note: Testing libraries are not yet installed. To add testing:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Component Test Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Calculator } from './Calculator';

describe('Calculator', () => {
  it('should render calculator interface', () => {
    render(<Calculator />);
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
  });

  it('should call onCalculate when button is clicked', () => {
    const handleCalculate = vi.fn();
    render(<Calculator onCalculate={handleCalculate} />);

    const button = screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(button);

    expect(handleCalculate).toHaveBeenCalled();
  });

  it('should display result after calculation', () => {
    render(<Calculator />);
    // Test user interaction and result display
  });
});
```

### Utility Function Testing

```typescript
import { describe, it, expect } from 'vitest';
import { calculateFactorial } from './mathUtils';

describe('calculateFactorial', () => {
  it('should calculate factorial of positive numbers', () => {
    expect(calculateFactorial(5)).toBe(120);
    expect(calculateFactorial(0)).toBe(1);
  });

  it('should handle edge cases', () => {
    expect(calculateFactorial(1)).toBe(1);
  });
});
```

### Test File Naming

- Component tests: `ComponentName.test.tsx`
- Utility tests: `utilityName.test.ts`
- Hook tests: `useHookName.test.ts`
- Keep test files adjacent to source files

### Testing Best Practices

- **Test user-facing behavior**: Focus on what users see and do
- **Avoid testing implementation details**: Don't test state or internal methods
- **Use accessible queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
- **Test edge cases**: Empty states, error states, loading states
- **Mock external dependencies**: API calls, timers, etc.

### Edge Cases to Consider

- **Null/undefined inputs**
- **Empty states** (no data to display)
- **Loading states**
- **Error states**
- **Boundary values** (min/max numbers)
- **Floating point precision**
- **User interaction errors** (invalid input)

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

### Adding a New React Component

1. **Create component directory**: `src/components/ComponentName/`
2. **Create component file**: `ComponentName.tsx`
   ```typescript
   interface ComponentNameProps {
     // props definition
   }

   export function ComponentName({ ...props }: ComponentNameProps) {
     return <div>Component content</div>;
   }
   ```
3. **Create styles**: `ComponentName.css` or `ComponentName.module.css`
4. **Create barrel export**: `index.ts`
5. **Write tests**: `ComponentName.test.tsx` (if needed)
6. **Use in parent component or route**
7. **Test in browser**: `npm run dev`
8. **Commit**: `git commit -m "feat(components): add ComponentName"`

### Adding a New Page/Route

1. **Create page component** in `src/pages/PageName.tsx`
2. **Define route** in `src/App.tsx`:
   ```typescript
   <Route path="/page-name" element={<PageName />} />
   ```
3. **Add navigation link** if needed
4. **Test navigation** in browser
5. **Commit**: `git commit -m "feat(pages): add PageName route"`

### Adding a New Utility Function

1. **Create or update file** in `src/utils/`
2. **Add TypeScript types**:
   ```typescript
   export function calculateFactorial(n: number): number {
     // implementation
   }
   ```
3. **Export from utils index** if using barrel exports
4. **Write unit tests** (optional but recommended)
5. **Use in components**
6. **Commit**: `git commit -m "feat(utils): add calculateFactorial function"`

### Adding a Custom Hook

1. **Create hook file**: `src/hooks/useHookName.ts`
2. **Implement hook**:
   ```typescript
   export function useHookName(initialValue: Type) {
     const [state, setState] = useState(initialValue);
     // hook logic
     return { state, setState };
   }
   ```
3. **Use in components**
4. **Test behavior**
5. **Commit**: `git commit -m "feat(hooks): add useHookName"`

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

### React Performance

1. **Avoid unnecessary re-renders**
   ```typescript
   // Use React.memo for expensive components
   export const ExpensiveComponent = React.memo(({ data }: Props) => {
     // component logic
   });

   // Use useMemo for expensive calculations
   const result = useMemo(() => {
     return expensiveCalculation(data);
   }, [data]);

   // Use useCallback for functions passed as props
   const handleClick = useCallback(() => {
     doSomething();
   }, [dependency]);
   ```

2. **Code splitting and lazy loading**
   ```typescript
   const Calculator = lazy(() => import('./pages/Calculator'));

   <Suspense fallback={<LoadingSpinner />}>
     <Calculator />
   </Suspense>
   ```

3. **Optimize bundle size**
   - Check bundle size: `npm run build` and review dist/
   - Use tree-shaking friendly imports
   - Avoid importing entire libraries when only using parts

### For Mathematical Operations

1. **Minimize object allocation** in hot paths
2. **Use typed arrays** for large numerical datasets
3. **Cache expensive calculations** using `useMemo`
4. **Prefer iterative over recursive** for better performance
5. **Profile before optimizing** - use React DevTools Profiler

### Floating Point Precision

```typescript
// Be aware of floating point precision issues
0.1 + 0.2 === 0.3  // false!

// Use epsilon comparisons for floating point
function almostEqual(a: number, b: number, epsilon = 1e-10): boolean {
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
