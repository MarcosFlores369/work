import os
import asyncio
import tempfile
import logging
import fal_client

logger = logging.getLogger(__name__)


def _transcribe_sync(audio_bytes: bytes, filename: str) -> str:
    suffix = os.path.splitext(filename)[-1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        with open(tmp_path, "rb") as f:
            audio_url = fal_client.upload(f, content_type="audio/webm")

        logger.info(f"Uploaded audio to: {audio_url}")

        result = fal_client.run(
            "fal-ai/whisper",
            arguments={
                "audio_url": audio_url,
            },
        )
        logger.info(f"Whisper result keys: {list(result.keys())}")
        return result.get("text", "").strip()
    except Exception as e:
        logger.exception(f"Fal.ai error: {e}")
        raise
    finally:
        os.unlink(tmp_path)


async def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    return await asyncio.get_event_loop().run_in_executor(
        None, _transcribe_sync, audio_bytes, filename
    )
