# Contributing Guide 🤝

We love contributions! Here's how you can help:

## Getting Started

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

## Code Standards

### TypeScript
- Use **strict mode**: `strict: true` in tsconfig.json
- Add **type annotations** for public APIs
- No `any` types without good reason

### Formatting
```bash
npm run format  # Auto-format code
npm run lint    # Check for issues
```

### Testing
```bash
npm run test           # Run all tests
npm run test:coverage  # Check coverage
```

## Commit Message Format

```
[Feature|Fix|Docs|Refactor] Brief description

Longer explanation if needed.
```

Examples:
- `[Feature] Add URL expiration support`
- `[Fix] Resolve race condition in analytics worker`
- `[Docs] Update API documentation`

## Pull Request Process

1. Update tests for new functionality
2. Ensure `npm run lint` passes
3. Update documentation if needed
4. Add description of changes

## Areas We're Looking For

- 🐛 Bug fixes
- ⚡ Performance improvements
- 📚 Documentation improvements
- ✅ Better test coverage
- 🎨 UI/UX improvements

## Questions?

Open an issue with the `question` label!

---

**Thank you for contributing!** 🙌
