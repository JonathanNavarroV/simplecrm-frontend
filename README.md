# SimpleCRM Frontend

**SimpleCRM Frontend** es la aplicación web del ecosistema SimpleCRM: una SPA moderna (Angular 20, standalone y signals-ready) con Tailwind CSS v4, preparada para Docker y diseñada para consumir microservicios a través del SimpleCRM Gateway (autenticación mediante Microsoft Entra ID).

---

## 🚀 Funcionalidades principales

- UI SPA con **Angular 20** (standalone, signals-ready).
- Estilos con **Tailwind CSS v4** (gestión automática).
- Gestión de clientes, contactos y oportunidades (módulos CRM, pensados para lazy-loading).
- Integración con **Microsoft Entra ID** (vía Gateway; tokens gestionados por interceptor).
- Configuración por **ambientes** y overrides en tiempo de ejecución (`environment.ts` y variables Docker `NG_ENV_*`).
- Preparado para **Docker** y despliegues en contenedor (imagen estática + entrypoint para configuración).
- Interceptores HTTP centrales para auth, manejo de errores y logging.
- Preparado para accesibilidad e internacionalización (i18n-ready).

---

## 📂 Estructura del proyecto

```text
simplecrm-frontend/
├─ public/                # archivos estáticos y index.html (producción)
├─ src/
│  ├─ main.ts
│  ├─ index.html
│  ├─ styles.css          # punto de entrada Tailwind
│  ├─ app/
│  │  ├─ features/        # páginas/modulos (CRM, etc.)
│  │  ├─ shared/          # componentes/servicios compartidos
│  │  ├─ core/            # http, interceptores, auth guards
│  │  └─ ui-showcase/     # ejemplos y componentes de demostración
│  ├─ assets/
│  ├─ environments/
│  │  ├─ environment.ts
│  │  └─ environment.prod.ts
├─ angular.json
├─ package.json
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.spec.json
├─ tailwind.config.ts     # (opcional) configuración de Tailwind
├─ Dockerfile
├─ .github/               # (opcional) workflows CI/CD
└─ README.md
```

---

## ⚙️ Requisitos previos

- Node.js 20+ (recomendado LTS).
- npm 10+ (normalmente incluido con Node 20).
- Angular CLI: opcional globalmente; el proyecto incluye `@angular/cli` en `devDependencies` y se puede usar vía `npm run` o `npx ng`.
- Docker (opcional): necesario solo si vas a usar la imagen o ejecutar en contenedor.
- Git (para clonar y trabajar con el repositorio).
- Navegador Chromium/Chrome (recomendado) para ejecutar tests con Karma.
- Variables de entorno: tener disponible la URL del SimpleCRM Gateway para configurar `src/environments/*` o inyectar `NG_ENV_*` en Docker.
- (Opcional) Credenciales de Microsoft Entra ID si vas a probar flujos de autenticación MSAL.

---

## ▶️ Ejecución en desarrollo

### 1. Clona este repositorio

```bash
git clone git@github.com:JonathanNavarroV/simplecrm-frontend.git
cd simplecrm-frontend
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura los ambientes

Edita `src/environments/environment.ts` y `src/environments/environment.prod.ts`:

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  gatewayBaseUrl: 'http://localhost:5000', // URL del SimpleCRM Gateway (dev)
  crmApiBase: '/crm', // prefijo en el gateway para CRM
  authApiBase: '/auth', // prefijo en el gateway para Auth
  // Opcional: scopes/audience si el front los necesita
  // audience: 'api://simplecrm-gateway',
};
```

```ts
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  gatewayBaseUrl: 'https://<tu-dominio-gateway>', // URL en prod
  crmApiBase: '/crm',
  authApiBase: '/auth',
  // audience: 'api://simplecrm-gateway',
};
```

> Si el gateway requiere token, asegúrate de que el front lo obtenga (por ejemplo, usando MSAL a través del gateway o un flujo manejado por el backend).

### 4. Ejecuta en modo desarrollo

```bash
npm run start
```

La app quedará disponible (por defecto) en http://localhost:4200/.

---

## 🎨 Tailwind CSS 4

El proyecto integra Tailwind CSS v4 mediante PostCSS. La configuración actual utiliza el plugin `@tailwindcss/postcss` definido en `.postcssrc.json`, y el punto de entrada es `src/styles.css`:

```css
@import 'tailwindcss';
```

Clases utilitarias disponibles en componentes y templates HTML.

Nota: en el repositorio no existe actualmente un archivo `tailwind.config.*`. Si necesitas personalizar el tema, rutas de contenido o plugins, crea `tailwind.config.ts` o `tailwind.config.cjs` en la raíz (por ejemplo con `npx tailwindcss init`).

Si el diseño no aparece, verifica que `src/styles.css` esté referenciado en `angular.json` y que no existan configuraciones previas de PostCSS que interfieran.

---

## 🔐 Autenticación (Entra ID via Gateway)

La validación de tokens se realiza en el Gateway; este frontend se encarga de obtener/adjuntar tokens y de proteger llamadas HTTP.

- MSAL integrado: la configuración y proveedores están en `src/app/app.config.ts` (se registran `MSAL_INSTANCE`, `MSAL_INTERCEPTOR_CONFIG`, `MsalService`, `MsalGuard`, `MsalBroadcastService` y `MsalInterceptor`).
- Interceptor: `MsalInterceptor` añade automáticamente el header `Authorization: Bearer <token>` para las URLs definidas en `environment.azure.api.baseUrl` (ver `MSALInterceptorConfigFactory` en `app.config.ts`).
- Variables a rellenar: completa en `src/environments/environment.ts` / `environment.prod.ts` las claves `azure.spaClientId`, `azure.authority`, `azure.postLogoutRedirectUri`, y en `azure.api` `baseUrl` y `scopes`.
- Uso desde la UI: revisa `src/app/core/services/auth.service.ts` para ejemplos de `login()` y `logout()`.
- Validación final: el Gateway debe verificar la validez del token y aplicar autorización/roles en backend.

Notas:
- Si despliegas con Docker, asegúrate de inyectar las variables necesarias (`NG_ENV_*`) o construir `environment.prod.ts` apropiadamente.
- Para deshabilitar MSAL temporalmente en entornos locales, ajusta `environment.uiShowcase` o la configuración en `app.config.ts`.

---

## 🐳 Ejecución con Docker

Estado: stand by — se planea añadir `docker-compose.dev.yml` y `docker-compose.qa.yml` próximamente; por ahora no se automatiza el entorno contenedorizado.

Comandos de referencia (usar exclusivamente `docker compose` cuando existan los archivos de composición):

```bash
# Desarrollo (cuando exista docker-compose.dev.yml)
docker compose -f docker-compose.dev.yml up --build

# QA (cuando exista docker-compose.qa.yml)
docker compose -f docker-compose.qa.yml up --build
```

Nota: El `Dockerfile` está preparado para un build de producción y un Nginx minimal. Las variables `NG_ENV_*` pueden inyectarse en tiempo de arranque (el entrypoint puede sobrescribir `environment.*` o exponer un `config.json`).

---

## 🔗 Repositorios relacionados

- [simplecrm-gateway](https://github.com/JonathanNavarroV/simplecrm-gateway)
- [simplecrm-auth-service](https://github.com/JonathanNavarroV/simplecrm-auth-service)
- [simplecrm-crm-service](https://github.com/JonathanNavarroV/simplecrm-crm-service)

---

## 🧪 Scripts útiles

```bash
npm run start       # ng serve
npm run build       # build producción
```

> Ver `package.json` para el listado completo.

---

## ✨ Autor

[Jonathan Navarro](https://github.com/JonathanNavarroV)
