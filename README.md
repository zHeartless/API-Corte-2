¡Claro\! Aquí tienes el `README.md` para tu proyecto, combinando las instrucciones para la API y la descripción del funcionamiento del frontend, basado en los archivos que me has proporcionado.

```markdown
# Sistema de Banca en Línea BDV

Esta es una plantilla lista para usar de una **API REST** de banca en línea, desarrollada con **Node.js y Express**, que incluye un robusto sistema de **autenticación JWT con refresh tokens**, gestión de roles de usuario, y un CRUD completo para la entidad `products`. Se integra con una base de datos **MySQL** utilizando **Sequelize** como ORM, y cuenta con un frontend básico para demostrar las funcionalidades de autenticación y navegación.

## Características Principales

### Backend (API REST)
* **Autenticación y Autorización:**
    * Registro de nuevos usuarios.
    * Inicio de sesión con generación de `access tokens` (corta duración) y `refresh tokens` (larga duración).
    * Renovación de `access tokens` utilizando `refresh tokens` almacenados en la base de datos.
    * Cambio de contraseña para usuarios autenticados.
    * **Roles de Usuario:** `admin` y `user` con diferentes niveles de acceso.
    * **Middlewares de Protección:** Para verificar JWT y autorizar según el rol.
* **Gestión de Datos (CRUD):**
    * **Entidad `Products`:** CRUD completo (Crear, Leer, Actualizar, Eliminar) protegido por autenticación y roles.
* **Base de Datos:**
    * **MySQL** con **Sequelize** como Object-Relational Mapper (ORM).
* **Estructura del Código:** Organizada modularmente en `controllers`, `routes`, `middlewares`, `models` y `config`.

### Frontend (Páginas Web)
* **Páginas Informativas:** Inicio, Servicios, Contacto.
* **Flujo de Autenticación:** Páginas dedicadas para Registro, Inicio de Sesión y Recuperación de Contraseña (demo).
* **Panel de Bienvenida:** Página accesible tras el inicio de sesión.
* **Estilos:** Diseño básico y responsivo con CSS.

## Tecnologías Utilizadas

### Backend
* **Node.js:** Entorno de ejecución JavaScript.
* **Express.js:** Framework web para Node.js.
* **MySQL:** Sistema de gestión de bases de datos relacionales.
* **Sequelize:** ORM para Node.js que facilita la interacción con bases de datos relacionales.
* **JWT (JSON Web Tokens):** Para la autenticación sin estado. (`jsonwebtoken`)
* **Bcrypt.js:** Para el hashing seguro de contraseñas. (`bcryptjs`)
* **Dotenv:** Para la gestión de variables de entorno. (`dotenv`)
* **UUID:** Para la generación de tokens únicos. (`uuid`)

### Frontend
* **HTML5:** Estructura de las páginas web.
* **CSS3:** Estilos y diseño de la interfaz de usuario.
* **JavaScript (ES6+):** Lógica del lado del cliente para interactuar con la API (usando `fetch`).

## Estructura de Carpetas

```

bdv-api-template/
├── package.json
├── package-lock.json
├── .env.example          \# Plantilla para variables de entorno
├── README.md             \# Este archivo
├── src/
│   ├── app.js            \# Archivo principal de la aplicación Express
│   ├── config/
│   │   └── db.js         \# Configuración de la conexión a la base de datos con Sequelize
│   ├── controllers/
│   │   ├── auth.controller.js  \# Lógica de negocio para autenticación
│   │   └── product.controller.js \# Lógica de negocio para productos
│   ├── middlewares/
│   │   └── auth.middleware.js  \# Middlewares para verificación de token y roles
│   ├── models/
│   │   ├── index.js            \# Exporta todos los modelos de Sequelize
│   │   ├── user.model.js       \# Modelo de usuario (Sequelize)
│   │   ├── refreshToken.model.js \# Modelo para refresh tokens (Sequelize)
│   │   └── product.model.js    \# Modelo de producto (Sequelize)
│   └── routes/
│       ├── auth.routes.js      \# Rutas de autenticación
│       └── product.routes.js   \# Rutas de productos
└── public/                 \# Archivos estáticos del frontend
├── css/
│   └── estilo.css      \# Hoja de estilos principal
├── img/                \# Imágenes (logo.png, banco.png, etc.)
├── js/
│   └── app.js          \# Lógica JavaScript del lado del cliente
├── index.html          \# Página de inicio
├── banca-en-linea.html \# Página de inicio de sesión
├── registro.html       \# Página de registro de usuarios
├── welcome.html        \# Página de bienvenida/dashboard del usuario
├── forgot-password.html\# Página para recuperación de contraseña
├── servicios.html      \# Página de servicios
└── contacto.html       \# Página de contacto

````

## Instalación y Ejecución

### Prerrequisitos

Asegúrate de tener instalados los siguientes componentes en tu sistema:
* [Node.js](https://nodejs.org/en/) (incluye npm)
* Un servidor de base de datos [MySQL](https://www.mysql.com/)

### Pasos de Instalación

1.  **Descarga el Proyecto:**
    * Si lo tienes en un archivo ZIP, descomprímelo.
    * Si es un repositorio Git, clónalo:
        ```bash
        git clone <URL_DEL_REPOSITORIO>
        cd <nombre_del_proyecto>
        ```

2.  **Configura las Variables de Entorno:**
    * Crea un archivo `.env` en la raíz del proyecto (al mismo nivel que `package.json`) copiando el contenido de `.env.example`.
        ```bash
        cp .env.example .env
        ```
    * Edita el archivo `.env` con tus credenciales de MySQL y las claves JWT:
        ```
        DB_HOST=localhost
        DB_USER=root
        DB_PASS=tu_contraseña_mysql
        DB_NAME=bdv_api_db
        JWT_SECRET=una_clave_secreta_muy_larga_y_compleja_para_jwt
        REFRESH_TOKEN_SECRET=otra_clave_secreta_muy_larga_y_compleja_para_refresh_jwt
        ACCESS_TOKEN_EXPIRES_IN=900s # 15 minutos
        ```
        > **Importante:** Cambia `tu_contraseña_mysql`, `una_clave_secreta_muy_larga_y_compleja_para_jwt` y `otra_clave_secreta_muy_larga_y_compleja_para_refresh_jwt` por valores seguros y únicos.

3.  **Instala las Dependencias:**
    ```bash
    npm install
    ```

### Configuración de la Base de Datos (MySQL)

* Asegúrate de que tu servidor MySQL esté en ejecución.
* El script `db.js` está configurado para conectarse a la base de datos especificada en `.env`.
* **Al iniciar el servidor por primera vez**, Sequelize intentará sincronizar los modelos con la base de datos, lo que creará las tablas `users`, `products` y `refresh_tokens` si no existen.

### Ejecución del Servidor

1.  **Inicia la API en modo desarrollo** (con recarga automática usando Nodemon):
    ```bash
    npm run dev
    ```
    O para modo producción:
    ```bash
    npm start
    ```
    El servidor se iniciará en `http://localhost:4000`.

## Endpoints Principales de la API

| Método | Ruta                      | Protegido | Rol           | Descripción                                         |
| :----- | :------------------------ | :-------- | :------------ | :-------------------------------------------------- |
| `POST` | `/api/auth/register`      | No        | —             | Registra un nuevo usuario.                          |
| `POST` | `/api/auth/login`         | No        | —             | Inicia sesión, retorna access y refresh token.      |
| `POST` | `/api/auth/refresh`       | No        | —             | Renueva el access token a partir del refresh token. |
| `POST` | `/api/auth/change-password` | Sí        | `user`/`admin` | Cambia la contraseña del usuario autenticado.       |
| `GET`  | `/api/products`           | Sí        | `user`/`admin` | Lista todos los productos.                          |
| `POST` | `/api/products`           | Sí        | `admin`       | Crea un nuevo producto.                             |
| `GET`  | `/api/products/:id`       | Sí        | `user`/`admin` | Obtiene los detalles de un producto por ID.         |
| `PUT`  | `/api/products/:id`       | Sí        | `admin`       | Actualiza un producto existente.                    |
| `DELETE`| `/api/products/:id`       | Sí        | `admin`       | Elimina un producto.                                |

> **Nota de Seguridad:** La ruta `/api/auth/retrieve-password` (GET) en `auth.controller.js` está presente solo para **fines de demostración INSEGURA** y **NO debe ser utilizada en un entorno de producción**. En un sistema real, la recuperación de contraseña se haría a través de un proceso seguro (ej. envío de email con enlace de un solo uso).

## Funcionamiento de la Página Web (Frontend)

Una vez que el backend esté en ejecución, puedes acceder a la aplicación en tu navegador: `http://localhost:4000`.

* **`index.html` (Inicio):** Página de bienvenida general.
* **`servicios.html` (Servicios):** Muestra los servicios que ofrece el banco.
* **`contacto.html` (Contacto):** Un formulario de contacto simple (sin funcionalidad de envío al backend en esta versión).
* **`banca-en-linea.html` (Acceso Usuario):**
    * Formulario de **Inicio de Sesión**.
    * Contiene un enlace a la página de Registro (`registro.html`) y a la de Recuperación de Contraseña (`forgot-password.html`).
    * La lógica de login (`loginUser()` en `public/js/app.js` - **Nota: no me proporcionaste app.js, pero asumo que existe y maneja la lógica frontend** ) interactúa con el endpoint `/api/auth/login`.
* **`registro.html` (Registro de Usuario):**
    * Formulario para que nuevos usuarios creen una cuenta.
    * La lógica de registro (`registerUser()` en `public/js/app.js`) interactúa con el endpoint `/api/auth/register`.
* **`forgot-password.html` (Recuperar Contraseña):**
    * Formulario para intentar "recuperar" la contraseña.
    * **Advertencia:** Utiliza la función `retrievePasswordInsecurely` en el backend, la cual es solo para **demostración** y **altamente insegura**.
* **`welcome.html` (Bienvenida/Dashboard):**
    * Página a la que el usuario es redirigido después de iniciar sesión exitosamente.
    * Contiene un botón de "Cerrar Sesión".

### Interacción Frontend-Backend

El archivo `public/js/app.js` (siendo el principal script del frontend) es el encargado de manejar las interacciones con la API. Debería contener funciones como:
* `registerUser()`: Envía datos de registro a `/api/auth/register`.
* `loginUser()`: Envía credenciales a `/api/auth/login` y almacena los tokens (access y refresh) localmente (ej. en `localStorage`).
* `logoutUser()`: Borra los tokens almacenados y redirige al login.
* Manejo de headers `Authorization: Bearer <access_token>` para solicitudes a rutas protegidas.
* Manejo de la ruta `/api/auth/refresh` para renovar el `access token` cuando sea necesario (ej. si el access token expira).

## Notas Importantes de Seguridad

* **Función `retrievePasswordInsecurely`:**  esta función en el controlador de autenticación es **extremadamente insegura y no debe ser usada en producción**. Su único propósito  es demostrar el flujo de una manera simplificada para la demo.
* **Almacenamiento de Tokens:** En esta implementación, los JWT se almacenan en `localStorage` en el frontend. Si bien es común para demos, para aplicaciones en producción, se recomienda usar métodos más seguros como `HttpOnly cookies` para los `refresh tokens` para mitigar ataques XSS.
* **Validación de Entradas:** La validación de entradas tanto en el frontend como en el backend es fundamental. Asegúrate de que todas las entradas de usuario sean validadas y desinfectadas exhaustivamente para prevenir vulnerabilidades de seguridad.

---

