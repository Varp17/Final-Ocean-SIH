from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from databases import Database
from .config import settings
import asyncpg

# Async database setup
database = Database(settings.DATABASE_URL)
metadata = MetaData()

# SQLAlchemy setup
engine = create_async_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def init_db():
    """Initialize database connection"""
    await database.connect()
    print("✅ Database connected successfully")

async def get_database():
    """Dependency to get database session"""
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def close_db():
    """Close database connection"""
    await database.disconnect()


def get_db():
    return None