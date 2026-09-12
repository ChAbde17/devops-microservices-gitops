"""
Database session management.

Currently a placeholder — will be wired to PostgreSQL via asyncpg
when the database service is fully integrated in docker-compose.
"""

async def check_db_connection() -> bool:
    """Check if the database is reachable. Returns True if healthy."""
    # TODO: Replace with real asyncpg connection check
    return True
