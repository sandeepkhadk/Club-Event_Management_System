from .db import metadata, engine

metadata.create_all(engine)
print("Tables created!")
