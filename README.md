# SimpleCRM Frontend

**SimpleCRM Frontend** es la **aplicación web** del ecosistema **SimpleCRM**, construida con **Angular 20** y **Tailwind CSS 4**, que consume los microservicios a través del **SimpleCRM Gateway**.

---

## 🚀 Funcionalidades principales

- UI SPA con **Angular 20** (standalone, signals-ready).
- Estilos con **Tailwind CSS v4** (sin PostCSS manual).
- Gestión de clientes, contactos, oportunidades (módulos CRM).
- Integración con **Microsoft Entra ID** (via Gateway).
- Configuración por **ambientes** (`environment.ts` / variables).
- Preparado para **Docker** y despliegues en contenedor.

---

## 📂 Estructura del proyecto

```text
simplecrm-frontend/
├─ src/
│  ├─ app/
│  │  ├─ features/        # páginas/modulos (CRM, etc.)
│  │  ├─ shared/          # componentes/servicios compartidos
│  │  └─ core/            # http, interceptores, auth guards
│  ├─ assets/
│  ├─ environments/
│  │  ├─ environment.ts
│  │  └─ environment.development.ts
│  └─ styles.css          # punto de entrada Tailwind
├─ angular.json
├─ package.json
├─ Dockerfile
└─ README.md
```

---

## ⚙️ Requisitos previos

- Node.js 20+ (recomendado LTS)
- npm 10+
- Angular CLI global: npm i -g @angular/cli
- Backend accesible vía SimpleCRM Gateway (URLs en variables de entorno)

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

Edita `src/environments/environment.development.ts` y `src/environments/environment.ts`:

```ts
// src/environments/environment.development.ts
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
// src/environments/environment.ts
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

El proyecto usa Tailwind 4 (gestión automática). El punto de entrada está en src/styles.css:

```css
@import 'tailwindcss';
```

Clases utilitarias disponibles en componentes y templates HTML.

> Si el diseño no aparece, verifica que styles.css esté referenciado en angular.json y que no existan configuraciones previas de PostCSS que interfieran.

---

## 🔐 Autenticación (Entra ID via Gateway)

La validación de tokens se realiza en el Gateway. Este frontend:

- Adjunta credenciales (por ejemplo, `Authorization: Bearer ...`) cuando corresponda.
- Consume APIs a través de `gatewayBaseUrl + crmApiBase` / `authApiBase`.

  > Implementación concreta (MSAL/interceptor) depende de tu flujo; se documentará en una sección propia cuando lo integremos.

---

## 🐳 Ejecución con Docker

Construir y ejecutar la imagen

```bash
docker build -t simplecrm-frontend .
docker run -p 4200:80 \
  -e NG_ENV_GATEWAY_BASE_URL=http://host.docker.internal:5000 \
  -e NG_ENV_CRM_API_BASE=/crm \
  -e NG_ENV_AUTH_API_BASE=/auth \
  simplecrm-frontend
```

> El Dockerfile está preparado para un build de producción y un Nginx minimal. Las variables `NG_ENV_*` pueden inyectarse en tiempo de arranque (entrypoint sobrescribe `environment.*` o expone un `config.json`). Ajustaremos esto según tu preferencia (config JSON vs. variables).

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
npm run lint        # lint
npm run test        # unit tests
```

> Ver `package.json` para el listado completo.

---

## ✨ Autor

[Jonathan Navarro](https://github.com/JonathanNavarroV)
