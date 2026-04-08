# Challenge Tecnico - Desarrollador Junior

## Contexto

Una empresa necesita una aplicacion web que permita grabar un audio y la API se encarga de hacer un transcript del audio provisto usando Whisper, luego el texto es utilizado por un agente con Gemini que realiza la tarea solicitada por el usuario, y finalmente debe responder con audio utilizando Microsoft Azure TTS.

## Tareas del Agente

El agente debe ser capaz de realizar las siguientes tres tareas basicas:

1. **Responder preguntas generales** - El usuario puede hacer preguntas de conocimiento general (ej: "Que es la fotosintesis?", "Cual es la capital de Japon?") y el agente responde con una explicacion clara y concisa.

2. **Gestionar una lista de tareas** - El usuario puede agregar, listar y eliminar tareas de una lista en memoria (ej: "Agrega comprar leche a mi lista", "Que tareas tengo pendientes?", "Elimina la tarea numero 2"). La lista persiste durante la sesion del servidor.

3. **Traducir texto** - El usuario puede pedir traducciones entre idiomas (ej: "Como se dice buenos dias en ingles?", "Traduce 'hello world' al frances"). El agente detecta el idioma de origen y traduce al idioma solicitado.

4. **Consultar precio del Dolar MEP** - El usuario puede preguntar el precio actual del Dolar MEP (ej: "A cuanto esta el dolar MEP?", "Cual es el precio del MEP hoy?"). El agente realiza web scraping del sitio `dolarhoy.com` para obtener la cotizacion de compra y venta vigente.

5. **Crear archivos Markdown** - El usuario puede pedir que se cree un archivo Markdown con el contenido que desee (ej: "Crea un archivo con un resumen de la reunion de hoy", "Genera un documento con una lista de compras"). El agente genera el archivo `.md` y lo guarda en la carpeta `storage/` en el root del proyecto.

### Patrones de integracion del Agente

Las tareas del agente deben implementarse usando dos patrones de integracion distintos:

#### Tool (Function Calling)

Al menos una tarea debe implementarse como un **Tool** usando el mecanismo de function calling nativo de Gemini. El candidato debe definir la funcion con su esquema (nombre, descripcion, parametros) y registrarla en el agente para que Gemini pueda invocarla automaticamente cuando lo considere necesario.

**Tarea sugerida:** Consultar precio del Dolar MEP (tarea 4). El agente declara un tool `get_dolar_mep` que Gemini invoca cuando el usuario pregunta por la cotizacion.

```python
# Ejemplo conceptual de definicion de Tool
get_dolar_mep = {
    "name": "get_dolar_mep",
    "description": "Obtiene la cotizacion actual del Dolar MEP (compra y venta) desde dolarhoy.com",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": []
    }
}
```

#### MCP (Model Context Protocol)

Al menos una tarea debe implementarse mediante un **servidor MCP** que exponga herramientas a traves del protocolo estandar. El candidato debe crear un servidor MCP independiente y conectar el agente como cliente MCP para consumir las herramientas expuestas.

**Tarea sugerida:** Crear archivos Markdown (tarea 5). Se implementa un servidor MCP que expone un tool `create_markdown_file` con parametros `filename` y `content`. El agente se conecta al servidor MCP y utiliza esta herramienta cuando el usuario solicita crear un archivo.

```python
# Ejemplo conceptual de un MCP server con mcp library
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("storage-server")

@mcp.tool()
def create_markdown_file(filename: str, content: str) -> str:
    """Crea un archivo Markdown en la carpeta storage/"""
    # ... logica de creacion del archivo
    return f"Archivo {filename}.md creado exitosamente"
```

La aplicacion esta compuesta por **tres servicios** orquestados con Docker Compose:

| Servicio | Tecnologia |
|---|---|
| **Frontend** | React + TypeScript + Vite + Tailwind |
| **Backend Python** | FastAPI + Uvicorn |
| **MCP Server** | Python + `mcp` library |

---

## Arquitectura

```
Frontend (React) --> Backend Python (FastAPI)
                          |
                          |--> Whisper via Fal.ai (Speech-to-Text)
                          |--> Gemini (Agente IA)
                          |       |
                          |       |--> Tools (Function Calling) --> ej: get_dolar_mep
                          |       |--> MCP Client --> MCP Server --> ej: create_markdown_file
                          |
                          |--> Azure TTS (Text-to-Speech)
```

### Flujo de una solicitud

1. El usuario presiona un boton en el frontend para grabar audio desde el microfono.
2. Al detener la grabacion, el audio se envia al backend como archivo (formato `webm` o `wav`).
3. El backend transcribe el audio a texto usando **Whisper** a traves de la API de **Fal.ai**.
4. El texto se envia a **Gemini** como prompt del agente, quien determina la tarea a realizar y genera una respuesta en texto.
5. La respuesta en texto se convierte a audio usando **Microsoft Azure TTS**.
6. El backend retorna al frontend: el texto transcrito, la respuesta del agente en texto y el audio de respuesta.
7. El frontend muestra la conversacion y reproduce el audio de respuesta automaticamente.

---

## Requerimientos

### Backend Python (FastAPI)

- [ ] Endpoint `POST /api/chat` que reciba un archivo de audio (`multipart/form-data`).
- [ ] Integracion con **Whisper** via **Fal.ai** (`fal-client`) para transcripcion de audio a texto.
- [ ] Integracion con **Google Gemini** (`google-generativeai`) para procesar el texto y generar respuestas.
- [ ] Implementar un system prompt que instruya al agente sobre las 5 tareas disponibles.
- [ ] Mantener un historial de conversacion por sesion para dar contexto al agente.
- [ ] Implementar la lista de tareas en memoria (puede ser un diccionario o lista global).
- [ ] Implementar al menos un **Tool (Function Calling)** registrado en Gemini. Ej: `get_dolar_mep` que realiza web scraping de `dolarhoy.com` para obtener la cotizacion del Dolar MEP.
- [ ] Implementar un **servidor MCP** independiente que exponga al menos un tool. Ej: `create_markdown_file` para crear archivos `.md` en `storage/`.
- [ ] Conectar el agente como **cliente MCP** al servidor MCP para consumir las herramientas expuestas.
- [ ] Integracion con **Microsoft Azure TTS** (`azure-cognitiveservices-speech`) para convertir la respuesta a audio.
- [ ] Retornar un JSON con `{ transcript, response, audio_url }` o retornar el audio como stream.
- [ ] Manejo de errores con codigos HTTP apropiados (400, 500).

### Frontend (React + TypeScript)

- [ ] Interfaz con un boton para iniciar/detener grabacion de audio usando `MediaRecorder` API.
- [ ] Indicador visual de que se esta grabando (animacion o cambio de color).
- [ ] Enviar el audio grabado al backend y mostrar un estado de carga mientras se procesa.
- [ ] Mostrar el historial de la conversacion: lo que dijo el usuario (transcripcion) y la respuesta del agente.
- [ ] Reproducir automaticamente el audio de respuesta del agente.
- [ ] Estilo limpio y responsivo con Tailwind CSS.

### Docker

- [ ] `Dockerfile` para el frontend (Node 20 Alpine, build multi-stage para produccion).
- [ ] `Dockerfile` para el backend (Python 3.11).
- [ ] `docker-compose.yml` que levante los tres servicios (frontend, backend, mcp-server) con las variables de entorno necesarias.

---

## Variables de Entorno

| Variable | Servicio | Descripcion |
|---|---|---|
| `GEMINI_API_KEY` | Backend | API key de Google Gemini |
| `AZURE_SPEECH_KEY` | Backend | API key de Azure Cognitive Services Speech |
| `AZURE_SPEECH_REGION` | Backend | Region del servicio Azure Speech (ej: `eastus`) |
| `FAL_KEY` | Backend | API key de Fal.ai para Whisper |

---

## Estructura Esperada

```
basic_jarvis/
├── docker-compose.yml
├── README.md
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── hooks/
│       │   └── useAudioRecorder.ts
│       ├── components/
│       │   ├── RecordButton.tsx
│       │   ├── ChatMessage.tsx
│       │   └── ChatHistory.tsx
│       └── api/
│           └── client.ts
└── backend/
    ├── Dockerfile
    ├── requirements.txt
    └── app/
        ├── __init__.py
        ├── main.py
        ├── services/
        │   ├── __init__.py
        │   ├── whisper_service.py
        │   ├── gemini_service.py
        │   ├── azure_tts_service.py
        │   ├── dolar_service.py
        │   └── markdown_service.py
        ├── tools/
        │   ├── __init__.py
        │   └── dolar_tool.py     # Tool definition para Gemini function calling
        └── routes/
            ├── __init__.py
            └── chat.py
├── mcp-server/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── server.py                 # MCP server que expone tools (ej: create_markdown_file)
│   └── storage/                  # Archivos Markdown generados por el agente
```

---

## Criterios de Evaluacion

| Criterio | Peso |
|---|---|
| Funcionalidad completa del flujo audio -> texto -> agente -> audio | 25% |
| Implementacion correcta de las 5 tareas del agente | 20% |
| Uso correcto de Tool (function calling) y MCP | 15% |
| Calidad del codigo (estructura, tipado, manejo de errores) | 15% |
| Dockerizacion funcional con `docker compose up` | 15% |
| UI/UX del frontend (responsivo, estados de carga, feedback visual) | 10% |

---

## Bonus (Opcional)

- [ ] Indicador de nivel de audio en tiempo real mientras se graba.
- [ ] Soporte para multiples sesiones concurrentes (identificar sesiones con un ID).
- [ ] Animacion de onda de audio durante la reproduccion de la respuesta.

---

## Notas

- Las API keys no deben estar hardcodeadas en el codigo. Usar variables de entorno y un archivo `.env` (no commiteado).
- Para Whisper se debe usar la API de Fal.ai (`fal-client`). Consultar la documentacion de Fal.ai para el endpoint de Whisper disponible.
- El agente debe responder en el mismo idioma en que el usuario habla (si el usuario habla en espanol, responder en espanol).
