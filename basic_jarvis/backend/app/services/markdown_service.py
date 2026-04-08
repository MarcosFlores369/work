import os
import httpx

MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:8001")


async def create_markdown_file(filename: str, content: str) -> str:
    """Call the MCP server to create a markdown file."""
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{MCP_SERVER_URL}/tools/create_markdown_file",
            json={"filename": filename, "content": content},
            timeout=10,
        )
        res.raise_for_status()
        return res.json().get("result", f"Archivo {filename}.md creado.")
