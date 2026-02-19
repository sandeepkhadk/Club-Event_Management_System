# core/db/init_db.py
from core.db.base import engine, metadata
import core.db.tables  # ensures all tables are registered

def init_db():
    metadata.create_all(bind=engine)
    print("All tables created successfully")
init_db()
    
