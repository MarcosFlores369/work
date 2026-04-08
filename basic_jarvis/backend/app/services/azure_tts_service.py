import base64
import tempfile
import edge_tts

VOICE = "es-AR-TomasNeural"


async def synthesize_speech(text: str) -> str:
    """Convert text to speech using edge-tts. Returns base64 data URL (mp3)."""
    communicate = edge_tts.Communicate(text, VOICE)

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        tmp_path = tmp.name

    await communicate.save(tmp_path)

    with open(tmp_path, "rb") as f:
        audio_b64 = base64.b64encode(f.read()).decode()

    import os
    os.unlink(tmp_path)

    return f"data:audio/mp3;base64,{audio_b64}"
