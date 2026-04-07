# Challenge Tecnico - Desarrollador Junior

## Contexto

Una empresa necesita una aplicacion web que permita grabar un audio y la API se encarga de hacer un transcript del audio provisto usando Whisper, luego el texto es utilizado por un agente con Gemini que realiza la tarea solicitada por el usuario, y finalmente debe responder con audio utilizando Microsoft Azure TTS.

## Tareas del Agente

El agente debe ser capaz de realizar las siguientes tres tareas basicas:

1. **Responder preguntas generales** - El usuario puede hacer preguntas de conocimiento general (ej: "Que es la fotosintesis?", "Cual es la capital de Japon?") y el agente responde con una explicacion clara y concisa.

2. **Gestionar una lista de tareas** - El usuario puede agregar, listar y eliminar tareas de una lista en memoria (ej: "Agrega comprar leche a mi lista", "Que tareas tengo pendientes?", "Elimina la tarea numero 2"). La lista persiste durante la sesion del servidor.

3. **Traducir texto** - El usuario puede pedir traducciones entre idiomas (ej: "Como se dice buenos dias en ingles?", "Traduce 'hello world' al frances"). El agente detecta el idioma de origen y traduce al idioma solicitado.

La aplicacion esta compuesta por **dos servicios** orquestados con Docker Compose:

| Servicio | Tecnologia |
|---|---|
| **Frontend** | React + TypeScript + Vite + Tailwind |
| **Backend Python** | FastAPI + Uvicorn |

---

## Arquitectura

```
Frontend (React) --> Backend Python (FastAPI)
                          |
                          |--> Whisper (Speech-to-Text)
                          |--> Gemini (Agente IA)
                          |--> Azure TTS (Text-to-Speech)
```

### Flujo de una solicitud

1. El usuario presiona un boton en el frontend para grabar audio desde el microfono.
2. Al detener la grabacion, el audio se envia al backend como archivo (formato `webm` o `wav`).
3. El backend transcribe el audio a texto usando **Whisper** (modelo local o API).
4. El texto se envia a **Gemini** como prompt del agente, quien determina la tarea a realizar y genera una respuesta en texto.
5. La respuesta en texto se convierte a audio usando **Microsoft Azure TTS**.
6. El backend retorna al frontend: el texto transcrito, la respuesta del agente en texto y el audio de respuesta.
7. El frontend muestra la conversacion y reproduce el audio de respuesta automaticamente.

---

## Requerimientos

### Backend Python (FastAPI)

- [ ] Endpoint `POST /api/chat` que reciba un archivo de audio (`multipart/form-data`).
- [ ] Integracion con **Whisper** para transcripcion de audio a texto (puede usarse `openai-whisper` local o la API de OpenAI).
- [ ] Integracion con **Google Gemini** (`google-generativeai`) para procesar el texto y generar respuestas.
- [ ] Implementar un system prompt que instruya al agente sobre las 3 tareas disponibles.
- [ ] Mantener un historial de conversacion por sesion para dar contexto al agente.
- [ ] Implementar la lista de tareas en memoria (puede ser un diccionario o lista global).
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
- [ ] `Dockerfile` para el backend (Python 3.11, con las dependencias necesarias para Whisper).
- [ ] `docker-compose.yml` que levante ambos servicios con las variables de entorno necesarias.

---

## Variables de Entorno

| Variable | Servicio | Descripcion |
|---|---|---|
| `GEMINI_API_KEY` | Backend | API key de Google Gemini |
| `AZURE_SPEECH_KEY` | Backend | API key de Azure Cognitive Services Speech |
| `AZURE_SPEECH_REGION` | Backend | Region del servicio Azure Speech (ej: `eastus`) |
| `OPENAI_API_KEY` | Backend | *(Opcional)* Solo si se usa la API de OpenAI para Whisper en vez del modelo local |

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
        │   └── azure_tts_service.py
        └── routes/
            ├── __init__.py
            └── chat.py
```

---

## Criterios de Evaluacion

| Criterio | Peso |
|---|---|
| Funcionalidad completa del flujo audio -> texto -> agente -> audio | 30% |
| Implementacion correcta de las 3 tareas del agente | 20% |
| Calidad del codigo (estructura, tipado, manejo de errores) | 20% |
| Dockerizacion funcional con `docker compose up` | 15% |
| UI/UX del frontend (responsivo, estados de carga, feedback visual) | 15% |

---

## Bonus (Opcional)

- [ ] Streaming de la respuesta del agente (mostrar texto mientras se genera).
- [ ] Indicador de nivel de audio en tiempo real mientras se graba.
- [ ] Soporte para multiples sesiones concurrentes (identificar sesiones con un ID).
- [ ] Tests unitarios para los servicios del backend.
- [ ] Animacion de onda de audio durante la reproduccion de la respuesta.

---

## Notas

- Las API keys no deben estar hardcodeadas en el codigo. Usar variables de entorno y un archivo `.env` (no commiteado).
- Se recomienda usar el modelo `base` o `small` de Whisper para mantener tiempos de respuesta rapidos.
- El candidato puede elegir entre usar Whisper localmente (`openai-whisper`) o a traves de la API de OpenAI. Documentar la decision en el codigo.
- El agente debe responder en el mismo idioma en que el usuario habla (si el usuario habla en espanol, responder en espanol).
