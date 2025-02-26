# Travel Agency API

Este proyecto es una API RESTful que gestiona una agencia de viajes. Permite realizar operaciones sobre los registros de viajes, ciudades y países, así como gestionar usuarios con autenticación JWT.

## Estructura de la Base de Datos
El modelo de datos contiene las siguientes tablas:

1. Countries (Países): Información sobre los países.
2. Cities (Ciudades): Información sobre las ciudades, que pertenecen a un país.
3. Travel (Viajes): Información sobre los viajes disponibles, que están relacionados con las ciudades y países.
4. Usuarios: Información sobre los usuarios, necesaria para la autenticación y registro de nuevos usuarios.

### Relaciones entre las Tablas:

- Countries - Cities: Relación de uno a muchos (1:n), un país tiene muchas ciudades.
- Cities - Travel: Relación de uno a muchos (1:n), una ciudad tiene muchos viajes.
- Countries - Travel: Relación de uno a muchos (1:n), un país tiene muchos viajes.
- Usuarios - Travel: Los usuarios pueden interactuar con los registros de viajes, pero no existe una relación directa en la base de datos.

## Funcionalidades

#### CRUD sobre la entidad ```Travel```
La API permite realizar operaciones CRUD sobre los viajes disponibles en la agencia. Los endpoints disponibles son:

1. GET /travel
Obtiene todos los viajes registrados.

2. POST /travel
Añade un nuevo viaje a la base de datos.

3. PUT /travel/:id
Modifica un viaje existente.

4. DELETE /travel/:id
Elimina un viaje específico.

#### Autenticación de Usuarios con JWT

He implementado autenticación de usuarios mediante JSON Web Tokens (JWT). Los usuarios deben registrarse y hacer login para acceder a ciertos endpoints.

1. POST /register
Permite registrar un nuevo usuario en la plataforma.

2. POST /login
Permite a los usuarios existentes iniciar sesión, devolviendo un token JWT que debe ser utilizado en las solicitud de información de la tabla Usuarios.

##### Middleware de Autenticación
Se ha implementado un middleware para verificar el JWT en las solicitudes que requieren autenticación. El token se debe incluir en los encabezados Authorization de la solicitud como tipo Bearer.

## Variables de Entorno

Para la configuración de la base de datos y otros parámetros sensibles, se utilizan variables de entorno. Crea un archivo .env en la raíz del proyecto con la siguiente estructura:

~~~
HOST_DB= nombre_host
USER_DB= nombre_usuario
PASS_DB= contraseña_usuario
NAME_DB= nombre_base_datos
URL_SERVER= http://localhost:5005 || https://modulo-4-evaluacion-final-bpw-mjgarreq.onrender.com
PORT_DB= nombre_puerto
~~~

## Tecnologías Utilizadas

- Node.js / Express para el desarrollo del servidor.
- JSON Web Tokens (JWT) para la autenticación de usuarios.
- MySQL para la base de datos.
- dotenv para la creación y uso de variables de entorno.

## Despliegue

El servidor de la API ha sido desplegado en Render. Puedes acceder a la API pública en el siguiente enlace: 
~~~
https://modulo-4-evaluacion-final-bpw-mjgarreq.onrender.com/
~~~

Además, se ha configurado un servidor de estáticos que incluye una pequeña aplicación de frontend. Esta aplicación permite probar el endpoint de login de usuarios y el endpoint de listado de viajes.

## Instalación

1. Clona el repositorio.
2. Instala las dependencias con ```npm install```.
3. Configura tu base de datos y las variables de entorno en el archivo .env.
4. Ejecuta el servidor: ```npm run dev```.

El servidor estará corriendo en http://localhost:5005.


## AUTORA
María José García Requena (mjgarreq)
