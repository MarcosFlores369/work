# Challenge Técnico — Desarrollador Junior

## Contexto

Una empresa necesita una aplicación web que consuma datos de la API pública **JSONPlaceholder** (`https://jsonplaceholder.typicode.com`) y los presente al usuario de forma clara y navegable.

La aplicación está compuesta por **tres servicios** orquestados con Docker Compose:

| Servicio | Tecnología |
|---|---|
| **Frontend** | React + TypeScript + Vite + Tailwind + React Router |
| **Backend Node.js** | Fastify + Zod + fetch |
| **Backend Python** | FastAPI + Uvicorn |

---

## Objetivo

Construir un sistema donde:

1. El **Backend Node.js** actúe como **BFF (Backend for Frontend)**: recibe las peticiones del frontend, las valida con Zod y las redirige al backend Python.
2. El **Backend Python** actúe como **capa de datos**: consume la API de JSONPlaceholder y devuelve los resultados al BFF.
3. El **Frontend** muestre la información al usuario consumiendo únicamente el BFF.

```
┌───────────┐       ┌────────────────┐       ┌────────────────┐       ┌─────────────────────┐
│  Usuario  │──────>│   Frontend     │──────>│  Backend Node  │──────>│   Backend Python    │
│           │<──────│  React + Vite  │<──────│  Fastify (BFF) │<──────│   FastAPI (Data)    │
└───────────┘       └────────────────┘       └────────────────┘       └──────────┬──────────┘
                                                                                 │
                                                                                 v
                                                                      ┌─────────────────────┐
                                                                      │  JSONPlaceholder API │
                                                                      └─────────────────────┘
```

---

## Requerimientos funcionales

### Pantalla 1 — Lista de usuarios

- Ruta: `/`
- Mostrar una lista de usuarios obtenidos de `/users`.
- Cada tarjeta debe mostrar: **nombre**, **email** y **ciudad**.
- Al hacer clic en un usuario, navegar a su detalle.

### Pantalla 2 — Detalle de usuario

- Ruta: `/users/:id`
- Mostrar la información completa del usuario.
- Listar los **posts** del usuario obtenidos de `/users/:id/posts`.
- Incluir un botón para volver a la lista.

### Pantalla 3 — Detalle de post

- Ruta: `/posts/:id`
- Mostrar el título y cuerpo del post.
- Listar los **comentarios** del post obtenidos de `/posts/:id/comments`.

---

## Requerimientos técnicos

### Frontend

- Usar **React Router** para la navegación entre pantallas.
- Usar **Tailwind** para los estilos (no se requiere un diseño elaborado, se valora orden y claridad).
- Tipar correctamente las respuestas de la API con **TypeScript**.
- Manejar estados de **carga** y **error** en cada pantalla.

### Backend Node.js (BFF)

- Exponer los endpoints que el frontend necesita.
- Validar los parámetros de entrada con **Zod** (por ejemplo, que `id` sea un número entero positivo).
- Usar **fetch** para comunicarse con el backend Python.
- Devolver errores claros cuando la validación falle o el backend Python no responda.

### Backend Python (capa de datos)

- Exponer endpoints que consuman JSONPlaceholder con `httpx` o `requests`.
- Devolver los datos en formato JSON al BFF.

### Docker

- Cada servicio debe tener su propio **Dockerfile**.
- El archivo **docker-compose.yml** debe levantar los tres servicios y permitir que se comuniquen entre sí.
- El frontend debe ser accesible desde `http://localhost:3000`.

---

## Estructura esperada

```
/
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── backend-node/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── backend-python/
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

---

## Criterios de evaluación

| Criterio | Peso |
|---|---|
| La aplicación levanta correctamente con `docker compose up` | Alto |
| Comunicación correcta entre los tres servicios | Alto |
| Uso adecuado de TypeScript y tipado | Medio |
| Validación con Zod en el BFF | Medio |
| Navegación funcional con React Router | Medio |
| Manejo de estados de carga y error | Medio |
| Código limpio y organizado | Medio |
| Estilos claros con Tailwind | Bajo |

---

## Bonus (opcional)

- Agregar un **buscador** de usuarios por nombre en la pantalla principal.
- Implementar **paginación** en la lista de posts.
- Agregar **tests unitarios** en cualquiera de los servicios.
- Configurar **variables de entorno** para las URLs de comunicación entre servicios.

---

## Instrucciones de entrega

1. Hacer un **fork** de este repositorio.
2. Desarrollar la solución en una rama `feature/solution`.
3. Abrir un **Pull Request** hacia `main` con una descripción breve de las decisiones tomadas.
4. Asegurarse de que `docker compose up --build` levante todo correctamente.

---

## Tiempo estimado

**4 a 6 horas**.

> No se espera perfección. Se valora que el candidato demuestre comprensión de la arquitectura, buenas prácticas y capacidad de resolver problemas.
