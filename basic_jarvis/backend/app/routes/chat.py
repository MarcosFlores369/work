from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.services.whisper_service import transcribe_audio
from app.services.gemini_service import get_agent_response
from app.services.azure_tts_service import synthesize_speech

router = APIRouter()


class ChatResponse(BaseModel):
    transcript: str
    response: str
    audio_url: str


@router.post("/chat", response_model=ChatResponse)
async def chat(audio: UploadFile = File(...)):
    if not audio.content_type or not audio.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be an audio file")

    audio_bytes = await audio.read()

    try:
        transcript = await transcribe_audio(audio_bytes, filename=audio.filename or "audio.webm")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    try:
        agent_response = await get_agent_response(transcript)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent failed: {str(e)}")

    try:
        audio_url = await synthesize_speech(agent_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")

    return ChatResponse(transcript=transcript, response=agent_response, audio_url=audio_url)
