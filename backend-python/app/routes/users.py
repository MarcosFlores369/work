import os
import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter()
JSONPLACEHOLDER_URL = os.getenv("JSONPLACEHOLDER_URL", "https://jsonplaceholder.typicode.com")


@router.get("/users")
async def get_users():
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{JSONPLACEHOLDER_URL}/users")
        res.raise_for_status()
        return res.json()


@router.get("/users/{user_id}")
async def get_user(user_id: int):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{JSONPLACEHOLDER_URL}/users/{user_id}")
        if res.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        res.raise_for_status()
        return res.json()


@router.get("/users/{user_id}/posts")
async def get_user_posts(user_id: int):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{JSONPLACEHOLDER_URL}/users/{user_id}/posts")
        res.raise_for_status()
        return res.json()
