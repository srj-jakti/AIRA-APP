# Contributing to AIRA

Thank you for your interest in contributing to AIRA! This document provides guidelines for contributing to the project.

## Development Workflow

1. **Fork the repository** and clone it locally
2. **Create a branch** for your feature or bug fix
3. **Make your changes** following our coding standards
4. **Write tests** for your changes
5. **Run tests** to ensure everything passes
6. **Commit your changes** with clear commit messages
7. **Push to your fork** and submit a pull request

## Branch Naming Convention

- `feature/task-X-description` - For new features
- `bugfix/issue-X-description` - For bug fixes
- `hotfix/critical-issue` - For critical production fixes
- `docs/description` - For documentation updates

## Commit Message Format

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(trading-engine): add risk limit enforcement

Implement daily profit and loss limit checking before trade execution.
Trading engine now stops when limits are reached.

Closes #123
Validates Requirements 10.2, 10.3
```

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### React/Next.js

- Use functional components with hooks
- Keep components small and reusable
- Use TypeScript interfaces for props
- Follow Next.js App Router conventions

### Backend

- Use async/await for asynchronous operations
- Handle errors properly with try/catch
- Log errors with appropriate severity levels
- Use Prisma for database operations

## Testing

- Write unit tests for all new functions
- Write integration tests for API endpoints
- Write property-based tests for correctness properties
- Ensure all tests pass before submitting PR

## Pull Request Process

1. Update documentation if needed
2. Add tests for your changes
3. Ensure all tests pass
4. Update the CHANGELOG.md if applicable
5. Reference the task/issue number in PR description
6. Request review from maintainers

## Code Review Guidelines

Reviewers will check for:
- Code quality and style
- Test coverage
- Documentation updates
- Performance implications
- Security considerations
- Compliance with requirements

## Questions?

If you have questions, please:
1. Check existing documentation
2. Search closed issues
3. Create a new issue with the question label

Thank you for contributing to AIRA!
