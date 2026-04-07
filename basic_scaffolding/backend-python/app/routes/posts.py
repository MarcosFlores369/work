import os
import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter()
JSONPLACEHOLDER_URL = os.getenv("JSONPLACEHOLDER_URL", "https://jsonplaceholder.typicode.com")


@router.get("/posts/{post_id}")
async def get_post(post_id: int):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{JSONPLACEHOLDER_URL}/posts/{post_id}")
        if res.status_code == 404:
            raise HTTPException(status_code=404, detail="Post not found")
        res.raise_for_status()
        return res.json()


@router.get("/posts/{post_id}/comments")
async def get_post_comments(post_id: int):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{JSONPLACEHOLDER_URL}/posts/{post_id}/comments")
        res.raise_for_status()
        return res.json()
