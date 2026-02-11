"""
SQLAlchemy database configuration for raw SQL queries (Django-safe).
"""
from sqlalchemy import create_engine, text, MetaData, Table, Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager

# --- Table definitions for reflection (Metadata) ---
metadata = MetaData()

users_table = Table(
    'users',
    metadata,
    Column('user_id', Integer, primary_key=True, autoincrement=True),
    Column('name', String(100), nullable=False),
    Column('email', String(150), unique=True, nullable=False),
    Column('password', String(255), nullable=False),
    Column('created_at', DateTime, server_default='CURRENT_TIMESTAMP'),
)

clubs_table = Table(
    'clubs',
    metadata,
    Column('club_id', Integer, primary_key=True, autoincrement=True),
    Column('club_name', String(100), unique=True, nullable=False),
    Column('description', Text, nullable=False),
    Column('founded_date', Date, nullable=True),
    Column('created_by', Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False),
    Column('created_at', DateTime, nullable=False, server_default='CURRENT_TIMESTAMP'),
)

events_table = Table(
    'events',
    metadata,
    Column('event_id', Integer, primary_key=True, autoincrement=True),
    Column('club_id', Integer, ForeignKey('clubs.club_id', ondelete='CASCADE'), nullable=False),
    Column('handler_id', Integer, ForeignKey('users.user_id'), nullable=False),
    Column('title', String(200), nullable=False),
    Column('description', Text),
    Column('start_datetime', DateTime, nullable=False),
    Column('end_datetime', DateTime, nullable=False),
    Column('status', String(20)), 
    Column('created_at', DateTime, server_default='CURRENT_TIMESTAMP'),
)

# --- Engine Configuration ---
_engine = None

def get_engine():
    global _engine
    if _engine is None:
        from django.conf import settings
        _engine = create_engine(
            settings.SQLALCHEMY_DATABASE_URL,
            poolclass=QueuePool,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            echo=settings.DEBUG,
        )
    return _engine

# --- Database Operations ---

def init_db():
    """Create tables in correct order using raw SQL."""
    engine = get_engine()
    
    create_users_sql = text("""
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    create_clubs_sql = text("""
        CREATE TABLE IF NOT EXISTS clubs (
            club_id SERIAL PRIMARY KEY,
            club_name VARCHAR(100) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            founded_date DATE,
            created_by INTEGER NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
        )
    """)

    create_events_sql = text("""
        CREATE TABLE IF NOT EXISTS events (
            event_id SERIAL PRIMARY KEY,
            club_id INTEGER NOT NULL,
            handler_id INTEGER NOT NULL,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            start_datetime TIMESTAMP NOT NULL,
            end_datetime TIMESTAMP NOT NULL,
            status VARCHAR(20) DEFAULT 'pending', 
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (club_id) REFERENCES clubs(club_id) ON DELETE CASCADE,
            FOREIGN KEY (handler_id) REFERENCES users(user_id)
        )
    """)
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            conn.execute(create_users_sql)
            conn.execute(create_clubs_sql)
            conn.execute(create_events_sql)
            trans.commit()
            print("✓ All tables created successfully")
        except Exception as e:
            trans.rollback()
            print(f"✗ Error creating tables: {e}")
            raise

def drop_db():
    """Drop tables in reverse order of dependency."""
    engine = get_engine()
    drop_sql = text("""
        DROP TABLE IF EXISTS events CASCADE;
        DROP TABLE IF EXISTS clubs CASCADE;
        -- DROP TABLE IF EXISTS users CASCADE; 
    """)
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            conn.execute(drop_sql)
            trans.commit()
            print("✓ Tables dropped successfully")
        except Exception as e:
            trans.rollback()
            print(f"✗ Error dropping tables: {e}")
            raise

# --- Helper Methods ---

@contextmanager
def get_db_connection():
    engine = get_engine()
    conn = engine.connect()
    trans = conn.begin()
    try:
        yield conn
        trans.commit()
    except Exception:
        trans.rollback()
        raise
    finally:
        conn.close()

def execute_query(sql, params=None):
    engine = get_engine()
    with engine.connect() as conn:
        result = conn.execute(text(sql), params or {})
        return result.fetchall()

def execute_write(sql, params=None):
    engine = get_engine()
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            result = conn.execute(text(sql), params or {})
            trans.commit()
            return result.rowcount
        except Exception:
            trans.rollback()
            raise