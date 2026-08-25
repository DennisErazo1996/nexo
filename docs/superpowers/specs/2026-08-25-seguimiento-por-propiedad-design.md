# Especificación Técnica: Seguimiento por Propiedad, Ciclo de Coincidencias y Cierre de Venta

## 1. Resumen Ejecutivo
Esta funcionalidad traslada el embudo comercial (pipeline de ventas) desde el perfil general del cliente hacia cada coincidencia (**propiedad potencial individual**). Permite registrar notas de seguimiento vinculadas a un inmueble específico y actualiza automáticamente el estado de la propiedad a `vendida` cuando un trato se marca como `cerrado`.

---

## 2. Cambios en Base de Datos y Modelos

### 2.1 Ampliación de Estados de Coincidencia
Modificación del enum `App\Enums\EstadoCoincidencia`:
- `pendiente`: Coincidencia detectada automáticamente.
- `notificado`: Se compartió la información de la propiedad con el cliente.
- `visitando`: Visita agendada o en curso para la propiedad.
- `negociando`: Oferta o negociación activa sobre la propiedad.
- `cerrado`: Trato cerrado y ganado.
- `descartado`: Oportunidad descartada.

### 2.2 Migración para `notas_seguimiento`
- Se añade la columna `propiedad_id` (`foreignId('propiedad_id')->nullable()->constrained('propiedades')->nullOnDelete()`) a la tabla `notas_seguimiento`.
- En el modelo `App\Models\NotaSeguimiento`:
  - Se agrega `propiedad_id` a `$fillable`.
  - Se define la relación `public function propiedad(): BelongsTo`.

---

## 3. Lógica de Negocio y Controladores

### 3.1 Actualización de Estado de Coincidencia (`CoincidenciaController::updateEstado`)
- Endpoint existente `PATCH /coincidencias/{coincidencia}` (`App\Http\Controllers\Coincidencia\CoincidenciaController::updateEstado`).
- Validación: Acepta los nuevos estados del enum `EstadoCoincidencia`.
- **Efecto secundario al cerrar**: Si el nuevo estado es `EstadoCoincidencia::Cerrado`, el controlador actualiza automáticamente el estado de la propiedad asociada a `EstadoPropiedad::Vendida`.

### 3.2 Creación de Notas de Seguimiento (`NotaSeguimientoController::store`)
- Endpoint existente `POST /clientes/{cliente}/notas`.
- Se actualiza `StoreNotaRequest` para validar `propiedad_id` (`nullable|integer|exists:propiedades,id`).
- Se almacena `propiedad_id` si fue enviado en el formulario.

### 3.3 Consulta de Detalle del Cliente (`ClienteController::show`)
- Carga las notas de seguimiento con su relación `propiedad:id,tipo,zona`.
- Carga las coincidencias con el estado actualizado y las propiedades disponibles para asociar a notas.

---

## 4. Experiencia de Usuario e Interfaz (Frontend React / Inertia)

### 4.1 Perfil del Cliente (`resources/js/pages/clientes/show.tsx`)
1. **Cabecera**:
   - Muestra el estado global sugerido o badge informativo del cliente según su etapa más avanzada en sus propiedades activas.
2. **Sección "Propiedades potenciales"**:
   - Si la coincidencia está en estado `pendiente`: Muestra botones rápidos **[Notificado]** y **[Descartar]**.
   - Si la coincidencia está en `notificado`, `visitando` o `negociando`: Muestra un selector `<select>` con las opciones (*Notificado*, *Visitando*, *Negociando*, *Cerrado*, *Descartado*) que actualiza el estado de la coincidencia inmediatamente con `preserveScroll: true`.
   - Si la coincidencia está en `cerrado` o `descartado`: Muestra su badge correspondiente con opción de cambiar estado si es necesario.
3. **Sección "Notas de seguimiento"**:
   - En el formulario para crear nota se agrega un selector de propiedad opcional: *"General (sin propiedad específica)"* o una de las propiedades potenciales del cliente.
   - En la lista histórica de notas, si la nota cuenta con `propiedad`, se muestra un badge estilizado indicando el inmueble relacionado (ej. `Casa en Tegucigalpa`).

### 4.2 Detalle de la Propiedad (`resources/js/pages/propiedades/show.tsx`)
1. **Botón de Marcado Rápido como Vendida**:
   - Junto al selector de estados de la propiedad, se añade un botón destacado **"Marcar como vendida"** (disponible cuando la propiedad está en `disponible` o `reservada`).
   - Al pulsar el botón, pide confirmación y actualiza el estado de la propiedad a `vendida`.

---

## 5. Plan de Pruebas Automatizadas (PHPUnit)
1. `test_updating_coincidencia_to_cerrado_marks_propiedad_as_vendida`:
   - Verifica que al actualizar una coincidencia a `cerrado`, la propiedad asociada pasa automáticamente a `vendida`.
2. `test_storing_nota_with_associated_propiedad`:
   - Verifica que una nota de seguimiento puede crearse vinculada a una propiedad y que se persiste `propiedad_id`.
3. `test_coincidencia_supports_all_pipeline_states`:
   - Verifica transiciones entre `notificado`, `visitando`, `negociando`, `cerrado`, `descartado`.
