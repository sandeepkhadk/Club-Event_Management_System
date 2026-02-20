from sqlalchemy import Table, Column, Integer, String, Text, DateTime, ForeignKey, text
from core.db.base import metadata

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
    # Column('status', String(20)),
    Column('created_at', DateTime, server_default=text('CURRENT_TIMESTAMP')), 
    Column('visibility', String(20), nullable=False, default='Public'),  # New column for visibility
    Column('max_capacity', Integer, nullable=True),  # New column for max capacity
    extend_existing=True
)

events_participants = Table(
    'event_participants',
    metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('user_id', Integer, ForeignKey("users.user_id", ondelete='CASCADE'), nullable=False),
    Column('event_id', Integer, ForeignKey("events.event_id", ondelete='CASCADE'), nullable=False),
    extend_existing=True
)
