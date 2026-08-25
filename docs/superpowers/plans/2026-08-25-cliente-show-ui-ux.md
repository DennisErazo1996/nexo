# Rediseño UI/UX de la Pantalla del Perfil de Cliente Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the client profile page (`resources/js/pages/clientes/show.tsx`) into a modern, minimalist 2-column dashboard featuring quick contact actions (WhatsApp chat, phone call, copy number), interactive pipeline status management, enriched interest cards, property match links, and a chronological tracking note timeline.

**Architecture:** 
- Responsive 2-column dashboard layout (12 columns on `lg`: 4 cols for client details & interests, 8 cols for property matches and activity notes).
- Modern minimalist UI components with subtle borders, clean typography, soft badges, and full light/dark mode support.
- Direct quick-action controls: Phone copy with visual feedback, WhatsApp `wa.me` chat link, and native phone call `tel:` link.
- Inertia Forms wired directly to typed actions (`ClienteController.updateEstado`, `ClienteInteresController.store`/`destroy`, `CoincidenciaController.updateEstado`/`destroy`, `NotaSeguimientoController.store`).

**Tech Stack:** 
- React 19, TypeScript, Inertia.js v3, Tailwind CSS v4, Lucide React, Shadcn UI primitives (`Card`, `Badge`, `Button`, `Dialog`, `Input`, `Label`, `Textarea`, `DropdownMenu`).

## Global Constraints

- Must follow existing Laravel Wayfinder controller actions and routes conventions (`@/actions/App/Http/Controllers/...`, `@/routes/...`).
- Must maintain all existing functionality (adding/removing interests, updating match status, creating tracking notes) without breaking backwards compatibility.
- Ensure strict TypeScript typing and run `npm run types:check` and `php artisan test --compact tests/Feature/Cliente/ClienteManagementTest.php`.

---

### Task 1: Refactor and Modernize `resources/js/pages/clientes/show.tsx`

**Files:**
- Modify: `resources/js/pages/clientes/show.tsx`

**Interfaces:**
- Consumes: `Props { cliente: Cliente; coincidencias: Coincidencia[]; etiquetas: EtiquetaInteres[]; estados: EstadoOption[]; estadosCoincidencia: { value: EstadoCoincidencia; label: string }[]; }`
- Produces: Updated React Component for `clientes/show` page.

- [ ] **Step 1: Implement the modernized layout and features in `resources/js/pages/clientes/show.tsx`**
  - Add quick action buttons:
    - WhatsApp button (`https://wa.me/${cleanPhone}`)
    - Call button (`tel:${cliente.telefono}`)
    - Copy phone button with visual feedback (copied state)
  - Add Pipeline Status changer dropdown/form in the header / client card (`ClienteController.updateEstado.form(cliente.id)`)
  - Add Quick Metric pills (Intereses, Coincidencias, Notas)
  - Refactor Left Column:
    - Client Info Card (Phone, Agent, Registration date)
    - Search Interests Card (Modern interest item cards with `Badge`, zone, budget range, and sleek delete button + improved "Agregar interés" Dialog)
  - Refactor Right Column:
    - Potential Properties (Coincidencias) Card/Section with clickable links to property details (`/propiedades/${propiedad.id}`), price badges, and interactive match status actions
    - Tracking Notes Timeline Section with modern composer form and chronological note cards with agent initials/avatar and timestamp.

- [ ] **Step 2: Run TypeScript check to verify zero type errors**

Run: `npm run types:check`
Expected: Exited with code 0

- [ ] **Step 3: Run backend Feature tests to ensure API compatibility**

Run: `php artisan test --compact tests/Feature/Cliente/ClienteManagementTest.php`
Expected: 10 passed

- [ ] **Step 4: Run Vite build check to verify bundle builds cleanly**

Run: `npm run build`
Expected: Build successfully created without syntax/JSX errors.

- [ ] **Step 5: Commit changes**

```bash
git add resources/js/pages/clientes/show.tsx docs/superpowers/
git commit -m "feat(clientes): redesign cliente show page with modern minimalist UI/UX"
```
