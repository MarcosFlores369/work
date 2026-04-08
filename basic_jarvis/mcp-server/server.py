import os
import re
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

STORAGE_DIR = Path(__file__).parent / "storage"
STORAGE_DIR.mkdir(exist_ok=True)

app = FastAPI(title="MCP Server — Storage Tools")


class CreateMarkdownRequest(BaseModel):
    filename: str
    content: str


class ToolResult(BaseModel):
    result: str


@app.post("/tools/create_markdown_file", response_model=ToolResult)
def create_markdown_file(req: CreateMarkdownRequest) -> ToolResult:
    """MCP tool: create a Markdown file in the storage/ directory."""
    # Sanitize filename: only alphanumeric, hyphens, underscores
    safe_name = re.sub(r"[^\w\-]", "_", req.filename.replace(" ", "_"))
    if not safe_name:
        raise HTTPException(status_code=400, detail="Invalid filename")

    file_path = STORAGE_DIR / f"{safe_name}.md"

    # Prevent path traversal
    try:
        file_path.resolve().relative_to(STORAGE_DIR.resolve())
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid filename")

    file_path.write_text(req.content, encoding="utf-8")
    return ToolResult(result=f"Archivo {safe_name}.md creado exitosamente en storage/.")


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
