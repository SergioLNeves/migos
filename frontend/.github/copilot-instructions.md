# Copilot Instructions - Fortress Mobile

## Build, Test, and Lint Commands

**Package Manager:** pnpm (do not use npm or yarn)

```bash
# Start development server
pnpm start          # Interactive - choose platform
pnpm run android    # Android specific
pnpm run ios        # iOS specific
pnpm run web        # Web browser

# Lint & Format
pnpm run lint       # Run ESLint + Prettier check
pnpm run format     # Auto-fix linting and formatting

# Makefile shortcuts
make run            # pnpm start --clear
make lint           # pnpm run lint
make format         # pnpm run format
```

## Architecture

### Tech Stack
- **Framework:** React Native with Expo (file-based routing via expo-router)
- **Styling:** NativeWind (Tailwind for React Native)
- **TypeScript:** Strict mode enabled with path aliases (`@/*` maps to `src/*`)
- **Fonts:** JetBrainsMono (loaded in _layout.tsx)

### Directory Structure

```
src/
├── app/              # Expo Router pages (file-based routing)
│   ├── _layout.tsx   # Root layout with SafeAreaView + fonts
│   ├── _sections/    # Page-specific sections (not routes due to _ prefix)
│   └── index.tsx     # Home screen
├── components/       
│   ├── molecules/    # Simple reusable components (Button, Input, Logo)
│   ├── organisms/    # Complex composed components (Card, FontSlider)
│   └── index.ts      # Barrel export for all components
├── styles/
│   └── global.css    # NativeWind global styles
└── utils/
    └── cn.ts         # clsx + tailwind-merge utility
```

### Component Architecture (Atomic Design)
- **Molecules:** Basic UI elements (button.tsx, input.tsx, logo.tsx)
- **Organisms:** Complex components composed of molecules (card.tsx, fontSlider.tsx)
- All components exported through `src/components/index.ts` barrel file

### Routing
- File-based routing via Expo Router
- Files/folders starting with `_` are not routes (e.g., `_layout.tsx`, `_sections/`)
- Import pages from `src/app/` directory

## Key Conventions

### Component Patterns

**1. Class Variance Authority (CVA) for variants:**
```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const componentVariants = cva('base-classes', {
  variants: { /* ... */ },
  defaultVariants: { /* ... */ }
});
```

**2. Import aliases:**
```tsx
import { Button, Card } from '@/components';
import { cn } from '@/utils/cn';
```

**3. Component exports:**
- Use named exports, not default exports for molecules/organisms
- Barrel export through `src/components/index.ts`
- Organize by type: molecules first, then organisms

### Styling

**NativeWind classes:** Use Tailwind utilities directly on React Native components
```tsx
<View className="flex-1 bg-canvas gap-6 p-6">
```

**Color system:** Custom design tokens defined in `tailwind.config.js`
- Background variants: `background`, `card`, `canvas`, `surface`, `overlay`
- Text variants: `text`, `text-muted`, `text-subtle`
- Semantic colors: `primary`, `secondary`, `accent`, `destructive`, `success`, `warning`, `info`
- ANSI colors: `ansi-*` and `ansi-bright-*` for terminal-like styling

**Font family:** All fonts use `JetBrainsMono` - configured in tailwind as `font-mono`, `font-sans`, `font-serif`

**cn() utility:** Merge Tailwind classes with conditional logic
```tsx
className={cn('base-class', variant && variantClass, className)}
```

### TypeScript

**Path aliases configured in tsconfig.json:**
```json
"paths": { "@/*": ["src/*"] }
```

**tsconfigPaths enabled** in app.json experiments

### Commit Messages

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)

**Format:** `<type>(<scope>): <description>`

**Types:** feat, fix, docs, style, refactor, perf, test, build, ci, chore

**Rules:**
- Use imperative mood: "add" not "added"
- Keep description under 50 characters
- No period at end
- Lowercase description
- Breaking changes: add `!` before `:` or use `BREAKING CHANGE:` footer

See `.github/rules/commit-messages.md` for full specification.
