# Nexo 🏢

Sistema de gestión y coincidencia inmobiliaria desarrollado con **Laravel 12**, **Inertia.js v3 (React 19)**, **Tailwind CSS v4** y **PostgreSQL**.

---

## 📋 Requisitos Previos

- **PHP 8.4** o superior con extensiones activas: `pdo_pgsql`, `fileinfo`, `gd` o `imagick`, `mbstring`, `openssl`.
- **Composer** 2.x
- **Node.js** 20.x o superior & **npm**
- **PostgreSQL** 15 o superior
- **Laravel Herd** (recomendado en Windows/macOS) o servidor local compatible.

---

## 🚀 Guía de Instalación (Primeros pasos tras clonar)

Sigue estos comandos cada vez que clones el proyecto en un nuevo entorno:

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO> nexo
cd nexo
```

### 2. Instalar dependencias de PHP y JavaScript
```bash
composer install
npm install
```

### 3. Configurar variables de entorno
Copia el archivo de ejemplo para crear tu `.env`:

- **Windows (PowerShell):**
  ```powershell
  copy .env.example .env
  ```
- **Linux / macOS:**
  ```bash
  cp .env.example .env
  ```

Edita el archivo `.env` con las credenciales de tu base de datos y la URL de la aplicación:
```env
APP_NAME=Nexo
APP_URL=http://localhost:8000   # O http://nexo.test si usas Laravel Herd

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=nexo
DB_USERNAME=postgres
DB_PASSWORD=tu_password_aqui
```

### 4. Generar la clave de la aplicación
```bash
php artisan key:generate
```

### 5. Crear el enlace simbólico para el almacenamiento (Imágenes)
> **Importante:** Este comando es obligatorio para que las fotos de las propiedades se muestren correctamente en el navegador.
```bash
php artisan storage:link
```

### 6. Ejecutar migraciones y datos iniciales (Seeders)
Asegúrate de que la base de datos `nexo` exista en PostgreSQL antes de ejecutar este comando:
```bash
php artisan migrate --seed
```
*Esto creará la estructura de tablas, etiquetas de interés predefinidas y un usuario de prueba (`test@example.com` / `password`).*

---

## ⚠️ Nota de Configuración en Windows (Subida de fotos)

En entornos Windows / Laravel Herd, para evitar advertencias de archivos temporales al subir fotos (`unable to create a temporary file`), verifica en tu `php.ini`:
```ini
upload_tmp_dir = "C:\Users\<TU_USUARIO>\AppData\Local\Temp"
sys_temp_dir = "C:\Users\<TU_USUARIO>\AppData\Local\Temp"
```
Luego reinicia los servicios con `herd restart`.

---

## 💻 Ejecución en Desarrollo

Puedes iniciar todos los servicios necesarios (servidor local, Vite y cola de trabajos) con un solo comando:

```bash
composer run dev
```

O si prefieres ejecutarlos en terminales separadas:

1. **Servidor HTTP:**
   ```bash
   php artisan serve
   ```
2. **Compilador de Frontend (Vite HMR):**
   ```bash
   npm run dev
   ```
3. **Procesador de colas (Queue Worker):**
   ```bash
   php artisan queue:listen
   ```

---

## 🧪 Pruebas y Calidad de Código

- **Ejecutar suite de tests:**
  ```bash
  php artisan test
  ```
- **Formatear código PHP (Laravel Pint):**
  ```bash
  vendor/bin/pint
  ```
- **Verificar tipos TypeScript y ESLint:**
  ```bash
  npm run types:check
  npm run lint
  ```

---

## 📦 Compilación para Producción

```bash
npm run build
```
