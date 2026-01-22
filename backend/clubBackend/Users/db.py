from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData, TIMESTAMP
from sqlalchemy.sql import select
from sqlalchemy.exc import NoResultFound

# PostgreSQL connection
engine = create_engine(  'postgresql+psycopg2://postgres:Sandeep%40321@localhost:5432/system')

metadata = MetaData()

# Define the users table (match your uploaded table)
users = Table(
    'users', metadata,
    Column('user_id', Integer, primary_key=True),
    Column('name', String(100), nullable=False),
    Column('email', String(150), nullable=False),
    Column('password', String(255), nullable=False),
    Column('created_at', TIMESTAMP)
)
metadata.create_all(engine)
