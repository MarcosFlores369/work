from fastapi import FastAPI
from app.routes import users, posts

app = FastAPI(title="Data Layer")

app.include_router(users.router)
app.include_router(posts.router)
