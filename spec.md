# Nexo — Especificación Técnica (MVP)

## 1. Contexto y objetivo

Nexo es un sistema para agentes de bienes raíces que trabajan en pequeños grupos colaborativos (no una inmobiliaria formal con jerarquía, sino agentes independientes que se apoyan entre sí). Resuelve dos problemas concretos:

1. **Memoria perdida**: cuando un cliente busca algo que no está disponible en el momento, ese interés se olvida. Cuando meses después aparece la propiedad que buscaba, nadie se acuerda de conectarlo.
2. **Protección del negocio**: personas se hacen pasar por compradores para obtener el contacto del dueño y cerrar tratos por fuera del agente, dejándolo sin comisión ("brincarse al agente").

El sistema no reemplaza WhatsApp ni las redes sociales (que siguen siendo el canal principal de contacto y publicación) — es la bitácora compartida que falta detrás de esos canales.

## 2. Stack tecnológico

- **Backend**: Laravel 13
- **Frontend**: React
- **Base de datos**: PostgreSQL
- **Autenticación**: Laravel Sanctum

**Asunción a confirmar**: se recomienda Laravel + Inertia.js + React (monolito, sin API REST separada) para reducir la complejidad de un proyecto en solitario/equipo pequeño. Si en algún momento planeas una app móvil nativa o abrir el sistema a integraciones externas, conviene migrar a API + SPA desacoplada con Sanctum tokens. Para el MVP, Inertia es el camino más rápido.

## 3. Alcance del MVP

**Incluido:**
- Registro y gestión de clientes potenciales con etiquetas de interés
- Registro y gestión de propiedades, con soporte para múltiples agentes (co-listers) por propiedad
- Motor de match automático entre clientes y propiedades
- Notificación in-app cuando hay match
- Equipos (grupos de agentes) con roles admin/agente
- Marca de agua automática en fotos de propiedades
- Generación de texto listo para compartir en WhatsApp/redes al registrar una propiedad

**Fuera de alcance del MVP** (ver sección 8)

## 4. Modelo de datos

```
equipos
  id, nombre, created_at

usuarios (agentes)
  id, equipo_id, nombre, telefono, email, password, rol (admin|agente), created_at

clientes
  id, equipo_id, nombre, telefono (normalizado, único por equipo), estado
     (nuevo|contactado|visitando|negociando|cerrado|perdido),
  agente_registro_id (quién lo registró primero), created_at

etiquetas_interes (catálogo — sirve tanto para interés de cliente como uso de propiedad)
  id, nombre (casa, terreno, apartamento, local_comercial, ganadero,
  lotificacion, bodega, agricola, ...)

cliente_intereses (pivot ampliado)
  id, cliente_id, etiqueta_id, zona, presupuesto_min, presupuesto_max,
  agente_id (quién capturó este interés específico), created_at

propiedades
  id, equipo_id, tipo (terreno|casa|apartamento|local_comercial|bodega),
  zona, tamano (decimal), unidad_medida (manzana|m2|vara2),
  precio, moneda (HNL|USD), forma_pago (contado|financiable|negociable),
  condicion_legal (escritura_publica|en_tramite|hipotecada|papeles_en_regla|documento_privado) nullable,
  acceso (texto libre: distancia a pavimento, tiempo desde ciudad, tipo de vía),
  descripcion, estado (disponible|reservada|vendida|retirada), created_at

propiedad_etiquetas (pivot — usos sugeridos de la propiedad, mismo catálogo
  que cliente_intereses; es lo que compara el motor de match)
  id, propiedad_id, etiqueta_id

propiedad_agentes (pivot — co-listers, modelo "los tres amigos")
  id, propiedad_id, agente_id, porcentaje_comision (nullable)

propiedad_fotos
  id, propiedad_id, url, url_con_marca_agua, orden

matches
  id, cliente_id, propiedad_id, estado (pendiente|notificado|descartado), created_at

notas_seguimiento
  id, cliente_id, agente_id, texto, created_at
```

**Nota sobre el teléfono**: normalizar antes de guardar/comparar (quitar espacios, guiones, asumir código de país +504 si no viene incluido). Esto evita duplicados por formato.

## 5. Funcionalidades por módulo

### Módulo Clientes
- Alta de cliente con validación de teléfono único por equipo (si ya existe, mostrar quién lo registró y cuándo, en vez de bloquear silenciosamente)
- Agregar etiquetas de interés a un cliente ya existente (con zona y presupuesto por etiqueta, ya que un cliente puede buscar casa Y terreno con criterios distintos)
- Cambiar estado del cliente en el pipeline
- Agregar notas de seguimiento con fecha
- Vista de "clientes sin seguimiento reciente" (más de X días desde la última nota)

### Módulo Propiedades
- Alta de propiedad con uno o varios agentes asociados (co-listers)
- Captura de tamaño con su unidad (manzana, m², vara² — según cómo se maneje en la zona), precio con moneda (Lempiras por defecto), forma de pago (contado, financiable, negociable)
- Condición legal (escritura pública libre de gravámenes, en trámite, hipotecada) y descripción de acceso (distancia al pavimento, tiempo desde la ciudad más cercana, tipo de vía) como campos propios — son datos que el comprador siempre pregunta y que hoy solo viven en el texto libre de Facebook
- Etiquetas de uso (una propiedad puede tener varias: terreno + ganadero + lotificación, por ejemplo), del mismo catálogo que los intereses de cliente
- Subida de fotos con marca de agua aplicada automáticamente
- Cambiar estado (disponible/reservada/vendida/retirada)
- Botón "generar texto para compartir" → produce descripción lista para pegar en WhatsApp/Facebook, con el mismo formato que ya usa tu papá (tipo, ubicación, contacto, precio, puntos clave numerados)

### Motor de match
- Al crear o reactivar una propiedad: comparar sus etiquetas de uso + zona + precio (dentro del rango de presupuesto) contra los intereses de clientes registrados
- Al agregar un nuevo interés a un cliente: buscar propiedades disponibles cuyas etiquetas coincidan
- Cada coincidencia genera un registro en `matches` con estado `pendiente`
- El agente que ve el match puede marcarlo `notificado` (ya avisó) o `descartado`

### Notificaciones
- Listado in-app de matches pendientes, visible a todos los agentes del equipo relacionados con esa propiedad/cliente
- No se contempla envío automático de WhatsApp en el MVP — el sistema avisa al agente, y el contacto con el cliente lo sigue haciendo la persona directamente

## 6. Roles y permisos

- **Admin**: gestiona usuarios del equipo, ve todos los clientes y propiedades del equipo
- **Agente**: ve y gestiona clientes/propiedades del equipo (no hay restricción entre agentes del mismo equipo — el modelo real es colaborativo, no competitivo)

## 7. Flujos clave

**Registro de cliente nuevo**
1. Agente ingresa teléfono → sistema valida si ya existe en el equipo
2. Si no existe: captura nombre, primer interés (etiqueta + zona + presupuesto)
3. Si existe: muestra cliente existente, permite agregar un nuevo interés (etiqueta adicional)

**Registro de propiedad**
1. Agente captura tipo, zona, precio, descripción
2. Agrega co-listers si aplica (otros agentes del equipo)
3. Sube fotos → sistema aplica marca de agua
4. Sistema corre el match automáticamente y muestra clientes potenciales coincidentes
5. Sistema genera texto sugerido para compartir en redes

**Revisión de matches**
1. Agente ve listado de matches pendientes (propios y de propiedades donde es co-lister)
2. Contacta al cliente por su cuenta (WhatsApp/llamada)
3. Marca el match como notificado o descartado

## 8. Fuera de alcance del MVP (fases futuras)

- Multi-tenancy comercial con planes de pago y facturación
- Importación masiva de contactos (Excel/WhatsApp)
- Página pública por propiedad para compartir en redes (con contacto directo a WhatsApp)
- Métricas de demanda represada (qué tipo de propiedad/zona tiene más clientes esperando)
- Recordatorios automáticos programados (ej. notificación push a los X días sin seguimiento)
- Registro de reparto de comisión entre co-listers

## 9. Consideraciones técnicas adicionales

- **Multi-tenancy**: por columna (`equipo_id` en cada tabla relevante), usando global scopes de Eloquent — no requiere bases de datos separadas para el volumen esperado
- **Fotos**: almacenamiento en disco compatible con S3 (Laravel Filesystem), marca de agua aplicada en el momento de la subida (vía Intervention Image o similar)
- **Normalización de teléfono**: implementar como un cast/mutator en el modelo `Cliente`, o un trait reutilizable, para no repetir la lógica en cada lugar donde se compara