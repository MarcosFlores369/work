import os
import json
from google import genai
from google.genai import types
from app.tools.dolar_tool import DOLAR_MEP_TOOL
from app.services.dolar_service import get_dolar_mep
from app.services.markdown_service import create_markdown_file

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

SYSTEM_PROMPT = """Sos Jarvis, un asistente de voz inteligente. Respondés siempre en el mismo idioma
que el usuario utiliza. Podés realizar las siguientes tareas:

1. Responder preguntas generales con explicaciones claras y concisas.
2. Gestionar una lista de tareas en memoria: agregar, listar y eliminar tareas.
3. Traducir texto entre idiomas.
4. Consultar el precio del Dólar MEP usando la herramienta get_dolar_mep.
5. Crear archivos Markdown usando la herramienta create_markdown_file.

Para las tareas 4 y 5, utilizá las herramientas disponibles. Para el resto, respondé directamente.
Sé breve y natural en tus respuestas, como si fuera una conversación hablada."""

# In-memory task list
task_list: list[str] = []

# Conversation history
conversation_history: list[types.Content] = []

TOOLS = [
    types.Tool(function_declarations=[
        types.FunctionDeclaration(
            name=DOLAR_MEP_TOOL["name"],
            description=DOLAR_MEP_TOOL["description"],
            parameters=types.Schema(type="OBJECT", properties={}),
        ),
        types.FunctionDeclaration(
            name="create_markdown_file",
            description="Crea un archivo Markdown en la carpeta storage/. Usar cuando el usuario pide crear un archivo, documento o nota en markdown.",
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "filename": types.Schema(type="STRING", description="Nombre del archivo sin extensión"),
                    "content": types.Schema(type="STRING", description="Contenido del archivo en formato Markdown"),
                },
                required=["filename", "content"],
            ),
        ),
    ])
]


async def get_agent_response(user_text: str) -> str:
    global conversation_history

    conversation_history.append(
        types.Content(role="user", parts=[types.Part(text=user_text)])
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=conversation_history,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            tools=TOOLS,
        ),
    )

    # Handle function calling
    for part in response.candidates[0].content.parts:
        if part.function_call:
            fn_result = await _dispatch_tool(part.function_call.name, dict(part.function_call.args))

            conversation_history.append(response.candidates[0].content)
            conversation_history.append(
                types.Content(
                    role="user",
                    parts=[types.Part(
                        function_response=types.FunctionResponse(
                            name=part.function_call.name,
                            response={"result": fn_result},
                        )
                    )],
                )
            )

            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=conversation_history,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    tools=TOOLS,
                ),
            )

    text_response = response.text.strip()
    conversation_history.append(
        types.Content(role="model", parts=[types.Part(text=text_response)])
    )
    return text_response


async def _dispatch_tool(name: str, args: dict) -> str:
    if name == "get_dolar_mep":
        data = get_dolar_mep()
        return json.dumps(data, ensure_ascii=False)
    if name == "create_markdown_file":
        return await create_markdown_file(args["filename"], args["content"])
    return "Herramienta no encontrada."
