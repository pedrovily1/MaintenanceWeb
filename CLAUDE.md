# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
```

There is no lint or test script configured.

## Environment Variables

Requires a `.env` file with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

### Tech Stack
- **React 18** + **TypeScript** via **Vite**
- **Tailwind CSS** for styling (CSS variables for theming: `var(--bg)`, `var(--panel-2)`, etc.)
- **Supabase** as the backend (auth + postgres database)
- **Zustand** (only for `useSiteStore`) and a custom global-variable store pattern for all other stores
- **Radix UI** primitives, **Lucide React** icons, **Recharts**, **jsPDF**

### Path Alias
`@` resolves to `./src` (configured in `vite.config.ts`).

### App Entry & Routing
`src/App.tsx` is the root component. It handles:
- **Supabase auth state** via `onAuthStateChange` — bootstraps all store data on login
- **Hash-based routing** (`#workorders`, `#assets`, etc.) — no React Router `<Router>` is used for navigation
- **Multi-site resolution** — queries `user_sites` table to determine `activeSiteId`, then loads all stores
- Auth screens: `Login`, `SetPasswordScreen`, `NoSiteScreen`

StrictMode is intentionally disabled to prevent double token consumption during Supabase OTP auth flows.

### State Management Pattern

**All stores except `useSiteStore`** use a custom module-level global + listener pattern:
```ts
let globalWorkOrders: WorkOrder[] = [];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());
```
Each hook subscribes on mount and unsubscribes on unmount. Mutations update the global array then call `notify()`, triggering optimistic UI updates before the async Supabase call completes. On error, they roll back.

**`useSiteStore`** uses Zustand's `create` and holds `activeSiteId`, `activeUserId`, `isBootstrapping`, and `userSites`. Other stores call `useSiteStore.getState()` directly (not the hook) to read these values.

### Data Scoping
All data in Supabase is scoped by `site_id`. Every store's `load*` function takes a `siteId` parameter. The app supports multi-site membership, but only loads data for the primary site (first result from `user_sites`).

### Section Structure
`src/sections/` contains self-contained feature areas. Each section has an `index.tsx` as the entry point and a `components/` sub-directory:
- `WorkOrderList` — list view with cards, filtering, sorting, tab buttons (Open/In Progress/Done/On Hold)
- `WorkOrderDetail` — detail panel with procedure instances, comments, attachments, status transitions
- `MainContent` — wraps the work orders view (Header + FilterBar + WorkOrderList or CalendarView)
- `Procedures` — procedure template builder with a drag-and-drop-style item palette
- `Assets`, `Parts`, `Meters`, `Locations`, `Categories`, `Vendors`, `Users`, `Settings`, `Reporting`

### Services Layer
`src/services/` contains thin Supabase query wrappers. The richer mutation logic lives in the store hooks. Key services:
- `attachmentService.ts` — Supabase Storage uploads/deletes
- `procedurePersistence.ts` — procedure instance save/load
- `services/persistence/` — asset and meter persistence helpers
- `services/export/pdfExport.ts` — jsPDF-based PDF export

### Procedure System
Procedures are reusable checklists defined in `src/types/procedure.ts`. When attached to a work order they become `ProcedureInstance` objects (snapshot of schema + user responses). Responses are stored in `work_order_procedure_instances` table and persisted via `updateWorkOrder` in `useWorkOrderStore`.

### Database Snake_Case Mapping
Supabase columns use `snake_case`; TypeScript types use `camelCase`. Each store contains a `mapRow` function that translates between them (e.g., `work_order_number` → `workOrderNumber`).
