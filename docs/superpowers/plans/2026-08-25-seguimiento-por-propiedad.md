# Seguimiento por Propiedad y Automatización de Venta Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement per-property pipeline tracking for client matches (coincidencias), allow attaching follow-up notes to specific properties, automate setting a property as `vendida` when a match is marked `cerrado`, and add a quick "Marcar como vendida" button on property pages.

**Architecture:** Extend `EstadoCoincidencia` enum with pipeline states (`visitando`, `negociando`, `cerrado`). Add `propiedad_id` to `notas_seguimiento`. Update `CoincidenciaController` and `NotaSeguimientoController`. Update React Inertia views for client profile and property show.

**Tech Stack:** Laravel 13, PostgreSQL, Inertia.js v3, React 19, Tailwind CSS, TypeScript, PHPUnit.

---

### Task 1: Extend EstadoCoincidencia Enum

**Files:**
- Modify: `app/Enums/EstadoCoincidencia.php`
- Modify: `resources/js/types/coincidencia.ts`

- [ ] **Step 1: Update `app/Enums/EstadoCoincidencia.php` with all pipeline cases and labels**

```php
<?php

namespace App\Enums;

enum EstadoCoincidencia: string
{
    case Pendiente = 'pendiente';
    case Notificado = 'notificado';
    case Visitando = 'visitando';
    case Negociando = 'negociando';
    case Cerrado = 'cerrado';
    case Descartado = 'descartado';

    /**
     * Get the human-readable label for the estado.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pendiente => 'Pendiente',
            self::Notificado => 'Notificado',
            self::Visitando => 'Visitando',
            self::Negociando => 'Negociando',
            self::Cerrado => 'Cerrado',
            self::Descartado => 'Descartado',
        };
    }
}
```

- [ ] **Step 2: Update TypeScript type in `resources/js/types/coincidencia.ts`**

```typescript
export type EstadoCoincidencia =
    | 'pendiente'
    | 'notificado'
    | 'visitando'
    | 'negociando'
    | 'cerrado'
    | 'descartado';
```

- [ ] **Step 3: Run existing tests to verify enum validity**

Run: `php artisan test --compact --filter=Coincidencia`
Expected: PASS

---

### Task 2: Add `propiedad_id` to `notas_seguimiento` and Update NotaSeguimiento Backend

**Files:**
- Create: `database/migrations/2026_08_25_203000_add_propiedad_id_to_notas_seguimiento_table.php`
- Modify: `app/Models/NotaSeguimiento.php`
- Modify: `app/Http/Requests/NotaSeguimiento/StoreNotaRequest.php`
- Modify: `app/Http/Controllers/NotaSeguimiento/NotaSeguimientoController.php`
- Modify: `resources/js/types/cliente.ts`
- Test: `tests/Feature/Cliente/NotaSeguimientoTest.php`

- [ ] **Step 1: Write migration for adding `propiedad_id` to `notas_seguimiento`**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notas_seguimiento', function (Blueprint $table) {
            $table->foreignId('propiedad_id')->nullable()->after('agente_id')->constrained('propiedades')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('notas_seguimiento', function (Blueprint $table) {
            $table->dropConstrainedForeignId('propiedad_id');
        });
    }
};
```

- [ ] **Step 2: Run migration**

Run: `php artisan migrate`
Expected: Migration executed successfully.

- [ ] **Step 3: Update `NotaSeguimiento` model**

Add `propiedad_id` to `#[Fillable(['cliente_id', 'agente_id', 'propiedad_id', 'texto'])]` and add `public function propiedad(): BelongsTo`.

- [ ] **Step 4: Update `StoreNotaRequest` validation**

Add `'propiedad_id' => ['nullable', 'integer', 'exists:propiedades,id']`.

- [ ] **Step 5: Update `NotaSeguimientoController::store` to save `propiedad_id`**

```php
$cliente->notas()->create([
    'texto' => $request->validated('texto'),
    'propiedad_id' => $request->validated('propiedad_id'),
    'agente_id' => $request->user()->id,
]);
```

- [ ] **Step 6: Update `resources/js/types/cliente.ts` for `NotaSeguimiento`**

Add `propiedad_id?: number | null;` and `propiedad?: { id: number; tipo: string; zona: string; precio: string; moneda: string } | null;` to `NotaSeguimiento` type.

- [ ] **Step 7: Write feature test in `tests/Feature/Cliente/NotaSeguimientoTest.php`**

Verify that submitting a note with `propiedad_id` stores the relation correctly.

---

### Task 3: Automatic Property Sold Transition on Coincidencia Cierre

**Files:**
- Modify: `app/Http/Controllers/Coincidencia/CoincidenciaController.php`
- Modify: `app/Http/Requests/Coincidencia/UpdateEstadoCoincidenciaRequest.php`
- Test: `tests/Feature/Coincidencia/CoincidenciaManagementTest.php`

- [ ] **Step 1: Update `UpdateEstadoCoincidenciaRequest.php` to accept all `EstadoCoincidencia` values**

Use `Rule::in(array_column(EstadoCoincidencia::cases(), 'value'))`.

- [ ] **Step 2: Update `CoincidenciaController::updateEstado` to set `propiedad->estado = EstadoPropiedad::Vendida` on `cerrado`**

```php
$nuevoEstado = EstadoCoincidencia::from($request->validated('estado'));
$coincidencia->update(['estado' => $nuevoEstado]);

if ($nuevoEstado === EstadoCoincidencia::Cerrado) {
    $coincidencia->propiedad()->update(['estado' => EstadoPropiedad::Vendida]);
}
```

- [ ] **Step 3: Write test in `tests/Feature/Coincidencia/CoincidenciaManagementTest.php`**

Test that updating coincidencia to `cerrado` automatically marks the property as `vendida`.

Run: `php artisan test --compact --filter=CoincidenciaManagementTest`
Expected: PASS

---

### Task 4: Eager Loading and Props in ClienteController and PropiedadController

**Files:**
- Modify: `app/Http/Controllers/Cliente/ClienteController.php`

- [ ] **Step 1: In `ClienteController::show`, load `notas.propiedad:id,tipo,zona` and pass `estadosCoincidencia` list to view**

Pass options for `EstadoCoincidencia` to the view:
```php
'estadosCoincidencia' => array_map(
    fn (EstadoCoincidencia $estado) => ['value' => $estado->value, 'label' => $estado->label()],
    EstadoCoincidencia::cases(),
),
```

---

### Task 5: Update Client Detail View (`resources/js/pages/clientes/show.tsx`)

**Files:**
- Modify: `resources/js/pages/clientes/show.tsx`

- [ ] **Step 1: Update "Propiedades potenciales" section**
  - If match is `pendiente`: show buttons **[Notificado]** and **[Descartar]**.
  - If match is not `pendiente`: render `<select>` with options (*Notificado*, *Visitando*, *Negociando*, *Cerrado*, *Descartado*). On change, automatically submit `CoincidenciaController.updateEstado.form(coincidencia.id)`.

- [ ] **Step 2: Update "Notas de seguimiento" form and list**
  - In the note creation form, add `<select name="propiedad_id">` listing `General (sin propiedad específica)` and each of `cliente.coincidencias` (or matched propiedades).
  - In the note timeline list, show a `Badge` with the property details if `nota.propiedad` exists.

- [ ] **Step 3: Update client header status**
  - Display informative badge based on the active state of matches.

---

### Task 6: Add "Marcar como vendida" Button in Property View (`resources/js/pages/propiedades/show.tsx`)

**Files:**
- Modify: `resources/js/pages/propiedades/show.tsx`

- [ ] **Step 1: Add "Marcar como vendida" button with Dialog confirmation**
  - When `propiedad.estado !== 'vendida'`, display a button next to the status selector that submits `PropiedadController.updateEstado` with `estado: 'vendida'` after confirmation.

---

### Task 7: Verification & Quality Checks

- [ ] **Step 1: Run Pint code formatter**
Run: `vendor/bin/pint --format agent`
Expected: PASS

- [ ] **Step 2: Build Vite assets**
Run: `npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 3: Run complete PHPUnit test suite**
Run: `php artisan test --compact`
Expected: All tests pass.
