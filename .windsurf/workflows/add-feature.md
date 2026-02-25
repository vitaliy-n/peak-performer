---
description: Workflow for adding a new feature, module, or page to the app
---
# Adding a New Feature Workflow

Follow these steps strictly to ensure architectural consistency when adding new features to Peak Performer:

1. **Define Types & Interfaces** 
   - Open `src/types/index.ts`.
   - Define the TypeScript interfaces for the new data entities.
   - Add new types to unions if necessary (e.g., new `Achievement` categories).

2. **Update Global Store (Zustand)**
   - Open `src/store/useStore.ts`.
   - Add the new state arrays/objects to `AppState`.
   - Add the necessary actions (add, update, delete, toggle).
   - Initialize the default state in the `create` function.

3. **Create UI Components**
   - Build reusable UI fragments (Modals, Cards, specific buttons) in `src/components/`.
   - Build the main view container in `src/pages/[NewFeature].tsx`.
   - Export the new page from `src/pages/index.ts`.

4. **Register Route/View**
   - Open `src/App.tsx` and add the new component to the `renderCurrentView` switch statement.
   - Open `src/components/Layout.tsx` and add a new item to the `navItems` array with an appropriate Lucide icon and a `tourClass` (e.g., `.new-feature-tour`).

5. **Update Guided Tour**
   - Open `src/components/Tour.tsx`.
   - Add a new step to `TOUR_STEPS` referencing your `tourClass`.

6. **Verify Build**
   - Run `npm run build` to ensure there are no TypeScript or ESLint errors.
