from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from django.conf import settings

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)

metadata = MetaData()