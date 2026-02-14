# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fortress Mobile is a React Native mobile app built with Expo 54, Expo Router (file-based routing), TypeScript (strict mode), and NativeWind (Tailwind CSS for React Native). Package manager is **pnpm**.

## Commands

```bash
# Development
pnpm start              # Start Expo dev server (interactive platform picker)
pnpm run android        # Start on Android
pnpm run ios            # Start on iOS
pnpm run web            # Start on Web
make run                # pnpm start --clear

# Code quality
pnpm run lint           # ESLint + Prettier check
pnpm run format         # Auto-fix ESLint + Prettier
make lint               # Same as pnpm run lint
make format             # Same as pnpm run format

# Native
pnpm run prebuild       # Generate native iOS/Android projects
```

There are no tests configured in this project.

## Architecture

### Routing

Expo Router file-based routing lives in `src/app/`. Files/folders prefixed with `_` are excluded from routing (e.g., `_layout.tsx`, `_sections/`). The root layout (`_layout.tsx`) loads JetBrainsMono fonts, wraps content in `SafeAreaView`, and renders a `Slot`.

### Component Organization (Atomic Design)

- `src/components/molecules/` — Basic UI elements (Button, Input, Logo)
- `src/components/organisms/` — Composed components (Card, FontSlider)
- `src/components/index.ts` — Barrel exports for all components

### Styling

- **NativeWind** applies Tailwind classes directly to React Native components
- Global CSS: `src/styles/global.css` (Tailwind directives only)
- Font constants: `src/styles/styles.ts` (JetBrainsMono weight mappings)
- `cn()` utility in `src/utils/cn.ts` merges classes via `clsx` + `tailwind-merge`
- Dark theme by default with HSL-based design tokens defined in `tailwind.config.js`

### Color System (in `tailwind.config.js`)

Background variants: `background`, `card`, `canvas`, `surface`, `overlay`, `subtle`. Text variants: `text`, `text-muted`, `text-subtle`. Semantic colors: `primary`, `secondary`, `accent`, `destructive`, `success`, `warning`, `info`. Full ANSI palette (8 standard + 8 bright).

## Code Conventions

- **TypeScript strict mode** with path alias `@/*` → `src/*`
- **Named exports only** (no default exports)
- **CVA (class-variance-authority)** for component variants — export both component and variant configs
- Prettier: 100 char width, single quotes, trailing commas (es5), Tailwind class sorting plugin
- ESLint: expo flat config with `react/display-name` off

## Commit Messages

Conventional Commits 1.0.0: `<type>(<scope>): <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

Rules: imperative mood, under 50 chars, no trailing period, lowercase start, breaking changes use `!` suffix or `BREAKING CHANGE:` footer.
