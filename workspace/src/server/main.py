
"""FastAPI application for JunctionX Uber Challenge."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import db_manager
from app.endpoints import router


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
  """Manage application lifecycle - startup and shutdown."""
  await db_manager.init_redis()
  await db_manager.init_sqlite()
  yield
  await db_manager.close_redis()


app = FastAPI(
  title="JunctionX Uber Challenge API",
  description="ML-powered driver state and zone recommendations",
  version="1.0.0",
  lifespan=lifespan,
)

# Set up CORS middleware to allow requests from the Next.js frontend
# This is crucial for cross-origin communication between Next.js and FastAPI
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],  # Allow all origins for local development
  allow_credentials=True,
  allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
  allow_headers=["*"],  # Allow all headers
)

app.include_router(router, prefix="/api/v1")


@app.get("/health")
async def health_check() -> dict[str, str]:
  """Health check endpoint."""
  return {"status": "healthy"}
