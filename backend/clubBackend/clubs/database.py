# # """
# # SQLAlchemy database configuration for raw SQL queries (Django-safe).
# # """
# # from sqlalchemy import create_engine, text, MetaData, Table, Column, Integer, String, Text, Date, DateTime, ForeignKey
# # from sqlalchemy.pool import QueuePool
# # from contextlib import contextmanager

# # # --- Table definitions for reflection (optional, for structure reference) ---
# # metadata = MetaData()

# # # Define table structure (for reference, not ORM)
# # clubs_table = Table(
# #     'clubs',
# #     metadata,
# #     Column('club_id', Integer, primary_key=True, autoincrement=True),
# #     Column('club_name', String(100), unique=True, nullable=False),
# #     Column('description', Text, nullable=False),
# #     Column('founded_date', Date, nullable=True),
# #     Column('created_by', Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False),
# #     Column('created_at', DateTime, nullable=False, server_default='CURRENT_TIMESTAMP'),
# # )

# # users_table = Table(
# #     'users',
# #     metadata,
# #     Column('user_id', Integer, primary_key=True, autoincrement=True),
# #     Column('name', String(100), nullable=False),
# #     Column('email', String(150), unique=True, nullable=False),
# #     Column('password', String(255), nullable=False),
# #     Column('created_at', DateTime, server_default='CURRENT_TIMESTAMP'),
# # )

# # # --- Lazy engine creation (prevents crash at Django startup) ---
# # _engine = None


# # def get_engine():
# #     """Lazy initialization of engine."""
# #     global _engine
# #     if _engine is None:
# #         from django.conf import settings  # Import here, not at top
# #         _engine = create_engine(
# #             settings.SQLALCHEMY_DATABASE_URL,
# #             poolclass=QueuePool,
# #             pool_pre_ping=True,
# #             pool_size=5,
# #             max_overflow=10,
# #             echo=settings.DEBUG,
# #         )
# #     return _engine


# # def get_connection():
# #     """
# #     Get a raw database connection.
# #     Remember to close it after use!
# #     """
# #     engine = get_engine()
# #     return engine.connect()


# # @contextmanager
# # def get_db_connection():
# #     """
# #     Context-managed database connection for raw SQL.
# #     Automatically handles commit/rollback and cleanup.
# #     """
# #     conn = get_connection()
# #     trans = conn.begin()
# #     try:
# #         yield conn
# #         trans.commit()
# #     except Exception:
# #         trans.rollback()
# #         raise
# #     finally:
# #         conn.close()


# # def init_db():
# #     """
# #     Create tables using raw SQL.
# #     Run this once to set up the database.
# #     """
# #     engine = get_engine()
    
# #     # SQL to create clubs table
# #     create_clubs_sql = text("""
# #         CREATE TABLE IF NOT EXISTS clubs (
# #             club_id SERIAL PRIMARY KEY,
# #             club_name VARCHAR(100) UNIQUE NOT NULL,
# #             description TEXT NOT NULL,
# #             founded_date DATE,
# #             created_by INTEGER NOT NULL,
# #             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
# #             FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
# #         )
# #     """)
    
# #     # SQL to create users table (if not exists from Users app)
# #     create_users_sql = text("""
# #         CREATE TABLE IF NOT EXISTS users (
# #             user_id SERIAL PRIMARY KEY,
# #             name VARCHAR(100) NOT NULL,
# #             email VARCHAR(150) UNIQUE NOT NULL,
# #             password VARCHAR(255) NOT NULL,
# #             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# #         )
# #     """)
    
# #     with engine.connect() as conn:
# #         trans = conn.begin()
# #         try:
# #             # Create users table first (foreign key dependency)
# #             conn.execute(create_users_sql)
# #             # Then create clubs table
# #             conn.execute(create_clubs_sql)
# #             trans.commit()
# #             print("✓ Tables created successfully")
# #         except Exception as e:
# #             trans.rollback()
# #             print(f"✗ Error creating tables: {e}")
# #             raise


# # def drop_db():
# #     """
# #     Drop all tables using raw SQL (DANGEROUS - only for development).
# #     """
# #     engine = get_engine()
    
# #     drop_sql = text("""
# #         DROP TABLE IF EXISTS clubs CASCADE;
# #         -- Don't drop users table if it's managed by Users app
# #         -- DROP TABLE IF EXISTS users CASCADE;
# #     """)
    
# #     with engine.connect() as conn:
# #         trans = conn.begin()
# #         try:
# #             conn.execute(drop_sql)
# #             trans.commit()
# #             print("✓ Tables dropped successfully")
# #         except Exception as e:
# #             trans.rollback()
# #             print(f"✗ Error dropping tables: {e}")
# #             raise


# # def execute_query(sql, params=None):
# #     """
# #     Execute a raw SQL query and return results.
    
# #     Args:
# #         sql: SQL query string (use :param_name for parameters)
# #         params: Dictionary of parameters
        
# #     Returns:
# #         List of Row objects
# #     """
# #     engine = get_engine()
# #     with engine.connect() as conn:
# #         if params:
# #             result = conn.execute(text(sql), params)
# #         else:
# #             result = conn.execute(text(sql))
# #         return result.fetchall()


# # def execute_write(sql, params=None):
# #     """
# #     Execute a write operation (INSERT, UPDATE, DELETE).
    
# #     Args:
# #         sql: SQL query string
# #         params: Dictionary of parameters
        
# #     Returns:
# #         Number of affected rows
# #     """
# #     engine = get_engine()
# #     with engine.connect() as conn:
# #         trans = conn.begin()
# #         try:
# #             if params:
# #                 result = conn.execute(text(sql), params)
# #             else:
# #                 result = conn.execute(text(sql))
# #             trans.commit()
# #             return result.rowcount
# #         except Exception:
# #             trans.rollback()
# #             raise

# from sqlalchemy import create_engine, MetaData, Table
# from contextlib import contextmanager

# # Update with your PostgreSQL credentials
# DATABASE_URL = "postgresql+psycopg2://username:password@localhost:5432/yourdb"

# engine = create_engine(DATABASE_URL)
# metadata = MetaData()

# # Define clubs table
# clubs_table = Table(
#     'clubs', metadata,
#     autoload_with=engine
# )

# @contextmanager
# def get_db_connection():
#     conn = engine.connect()
#     trans = conn.begin()
#     try:
#         yield conn
#         trans.commit()
#     except:
#         trans.rollback()
#         raise
#     finally:
#         conn.close()
