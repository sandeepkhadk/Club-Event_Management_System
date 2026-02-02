"""
SQLAlchemy database configuration and session management (Django-safe).
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
from contextlib import contextmanager

Base = declarative_base()

# --- Lazy engine creation (prevents crash at Django startup) ---
_engine = None
_SessionLocal = None


def get_engine():
    """Lazy initialization of engine."""
    global _engine
    if _engine is None:
        from django.conf import settings  # Import here, not at top
        _engine = create_engine(
            settings.SQLALCHEMY_DATABASE_URL,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            echo=settings.DEBUG,
        )
    return _engine


def get_session_factory():
    """Lazy initialization of session factory."""
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = scoped_session(
            sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=get_engine()
            )
        )
    return _SessionLocal


def get_db():
    """Get a database session (manual control)."""
    db = get_session_factory()()
    return db


@contextmanager
def get_db_context():
    """Context-managed DB session."""
    db = get_session_factory()()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db():
    """Create tables (run manually once)."""
    Base.metadata.create_all(bind=get_engine())


def drop_db():
    """Drop all tables (DANGEROUS)."""
    Base.metadata.drop_all(bind=get_engine())