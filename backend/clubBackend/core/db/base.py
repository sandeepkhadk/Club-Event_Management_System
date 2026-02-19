import os

from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from django.conf import settings

SQLALCHEMY_DATABASE_URL = os.environ.get('DATABASE_URL')

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)

metadata = MetaData()