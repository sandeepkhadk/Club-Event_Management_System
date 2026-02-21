from sqlalchemy import Table, Column, Integer, String, DateTime, Text, ForeignKey, text
from core.db.base import metadata

clubs_table = Table(
    'clubs',
    metadata,
    Column('club_id', Integer, primary_key=True, autoincrement=True),
    Column('club_name', String(100), nullable=False, unique=True),
    Column('description', Text, nullable=False),
    Column('founded_date', DateTime),
    Column('created_by', Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False),
    Column('created_at', DateTime, server_default=text('CURRENT_TIMESTAMP')),
       extend_existing=True,  # ✅ fix here
)


announcements_table = Table(
    'announcements',
    metadata,
    Column('announcement_id', Integer, primary_key=True, autoincrement=True),
    Column('club_id', Integer, ForeignKey('clubs.club_id', ondelete='CASCADE'), nullable=False),
    Column('posted_by_id', Integer, ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False),
    Column('message', Text, nullable=False),
    Column('created_at', DateTime, server_default=text('CURRENT_TIMESTAMP')),
    extend_existing=True,
)