# Especificación de Diseño: Perfil de Cliente Moderno y Minimalista (UI/UX)

**Fecha:** 2026-08-25  
**Estado:** Aprobado por el usuario  
**Archivo afectado principal:** `resources/js/pages/clientes/show.tsx`

---

## 1. Objetivos y Resumen

Transformar la vista de detalle de cliente (`clientes/show.tsx`) en un panel de control intuitivo, elegante y minimalista que agilice las tareas diarias de los agentes inmobiliarios. El nuevo diseño adopta una estructura de 2 columnas tipo dashboard con métricas clave, acciones directas de contacto (WhatsApp, llamada, copiar) y navegación fluida entre coincidencias de propiedades e historial de seguimiento.

---

## 2. Arquitectura de Información y Componentes

### 2.1. Cabecera (Hero Header)
* **Avatar y Datos**: Iniciales del cliente sobre fondo suave, nombre completo con jerarquía visual (`text-2xl font-bold tracking-tight`), y metadato *"Registrado por [Agente] el [Fecha]"*.
* **Acciones de Contacto Rápido**:
  * **WhatsApp (`wa.me`)**: Botón con icono de WhatsApp que limpia caracteres especiales del teléfono y abre el chat directamente en nueva pestaña (`https://wa.me/<numero_limpio>`).
  * **Llamada directa (`tel:`)**: Botón con icono de teléfono para iniciar llamadas telefónicas nativas.
  * **Copiar Teléfono**: Botón con icono de portapapeles y retroalimentación visual al copiar (icono de check transitorio durante 2 segundos y/o toast).
* **Gestión de Estado de Pipeline**:
  * Selector / Dropdown estilizado para cambiar el estado del cliente (`nuevo`, `en_contacto`, `buscando`, `negociando`, `cerrado`, `inactivo`) conectado mediante `Form` con `ClienteController.updateEstado.form(cliente.id)`.
* **Métricas Rápidas (Stat Pills)**:
  * 3 indicadores compactos: Intereses activos, Propiedades potenciales y Notas registradas.

---

### 2.2. Columna Lateral Izquierda (Detalles e Intereses - 4 columnas en desktop)
* **Tarjeta de Información de Contacto**:
  * Teléfono del cliente.
  * Agente responsable.
  * Fecha de creación / última actualización.
* **Tarjeta de Criterios de Búsqueda e Intereses**:
  * Cabecera con botón *"Agregar interés"* que abre modal `Dialog` mejorado.
  * Lista de intereses con diseño de micro-tarjetas:
    * Badge de etiqueta (e.g. *Casa*, *Departamento*, *Terreno*).
    * Zona deseada con icono de ubicación (`MapPin`).
    * Rango de presupuesto formateado con icono de moneda.
    * Botón sutil para eliminar interés (`ClienteInteresController.destroy`).
  * Estado vacío (*empty state*) elegante con icono descriptivo si no hay intereses.

---

### 2.3. Columna Principal Derecha (Propiedades Coincidentes y Notas - 8 columnas en desktop)
* **Sección: Propiedades Potenciales (Coincidencias)**:
  * Encabezado con contador de coincidencias y badge de estado.
  * Tarjetas de propiedad estilizadas con:
    * Enlace directo a la ficha de la propiedad (`/propiedades/{id}`).
    * Tipo de propiedad, zona y precio destacado en moneda correspondiente.
    * Agentes asociados.
    * Selector interactivo de estado de coincidencia (*Pendiente -> Notificado, Interesado, Visita agendada, Descartado*) con botones rápidos para notificar o descartar cuando está pendiente.
    * Botón para eliminar coincidencia.
  * Estado vacío minimalista cuando no hay propiedades coincidentes.
* **Sección: Línea de Tiempo de Notas de Seguimiento**:
  * Formulario de nueva nota con `Textarea` moderno, selector opcional de propiedad vinculada y botón de envío.
  * Feed cronológico de notas con:
    * Avatar o inicial del autor de la nota.
    * Nombre del agente y fecha formateada.
    * Badge de propiedad relacionada (si aplica).
    * Texto de la nota con buena legibilidad.
  * Estado vacío cuando no existen notas.

---

## 3. Consideraciones Técnicas y de Estilo
* **Framework y Librerías**: React 19, Inertia.js v3, Tailwind CSS v4, Lucide React, componentes shadcn/ui existentes (`Card`, `Badge`, `Button`, `Dialog`, `Input`, `Label`, `Textarea`).
* **Enrutamiento y Controladores**:
  * `ClienteController.updateEstado` para actualización de estado del cliente.
  * `ClienteInteresController.store` y `destroy` para intereses.
  * `CoincidenciaController.updateEstado` y `destroy` para coincidencias.
  * `NotaSeguimientoController.store` para notas.
  * Enlaces a propiedades mediante `show(propiedad.id)` de `PropiedadController` / `@/routes/propiedades`.
* **Dark Mode**: Uso coherente de clases semánticas (`bg-card`, `text-card-foreground`, `border-border`, `text-muted-foreground`) para soporte total de temas claro y oscuro.
* **Responsive Layout**: `grid grid-cols-1 lg:grid-cols-12 gap-6`.

---

## 4. Criterios de Aceptación
1. La vista `clientes/show` presenta un diseño moderno, limpio y organizado en 2 columnas en pantallas grandes y 1 columna en móviles.
2. Los botones de WhatsApp (`wa.me`), llamada (`tel:`) y copiar número funcionan adecuadamente.
3. El estado del cliente puede actualizarse directamente desde la interfaz mediante el selector interactivo.
4. Las propiedades potenciales tienen enlaces directos a sus respectivas páginas de detalle.
5. Se pueden agregar y eliminar intereses de búsqueda con confirmación visual.
6. Se pueden registrar y visualizar notas de seguimiento en formato de línea de tiempo cronológica.
7. Los tests de frontend y TypeScript compilan sin errores (`npm run types:check` / `npm run build`).
