# The Growing Guide

A garden planning web app built with React + TypeScript + Vite, powered by AWS Amplify Gen 2.

## Development

```bash
# Frontend only
npm run dev

# Frontend accessible on local network (mobile testing)
npm run dev -- --host

# Backend sandbox with streaming logs
npx ampx sandbox --stream-function-logs
```

## Testing

- **Framework**: Vitest + React Testing Library
- **Setup file**: `src/test/setup.ts` (jsdom polyfills for Mantine)
- **Test location**: co-located with source (`*.test.ts` / `*.test.tsx`)
- **Pattern**: wrap components in `MemoryRouter` + `MantineProvider` for rendering tests

```bash
# Watch mode (re-runs on file changes)
npm test

# Single pass (CI-friendly)
npm run test:run
```

## Build

```bash
npm run build    # TypeScript compilation + Vite build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```
