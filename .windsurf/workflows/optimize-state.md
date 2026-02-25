---
description: Workflow for optimizing React renders and Zustand state management
---
# State & Render Optimization Workflow

When the app feels sluggish or the bundle size grows too large, follow this optimization workflow:

1. **Identify Bottlenecks**
   - Use React DevTools Profiler to find components that re-render too often.
   - Check the Vite build output for chunks exceeding 500kB.

2. **Refactor Zustand Selectors**
   - **Bad**: `const { habits, toggleHabit } = useStore()` (Causes component to re-render on ANY store change).
   - **Good**: 
     ```typescript
     const habits = useStore(state => state.habits);
     const toggleHabit = useStore(state => state.toggleHabit);
     ```
   - Use the `useShallow` hook from Zustand if extracting multiple properties from an object.

3. **Memoization**
   - Wrap large or complex list item components in `React.memo`.
   - Use `useCallback` for functions passed down to memoized child components.
   - Use `useMemo` for expensive calculations (e.g., filtering habits, calculating FIRE numbers).

4. **Code Splitting (Lazy Loading)**
   - For heavy pages (like Analytics, Learning, Finance), update `App.tsx` to use `React.lazy`:
     ```typescript
     const Finance = lazy(() => import('./pages/Finance').then(module => ({ default: module.Finance })));
     ```
   - Wrap the main content area in `Layout.tsx` or `App.tsx` with `<Suspense fallback={<Loader />}>`.
