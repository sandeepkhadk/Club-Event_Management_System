from sqlalchemy import Table, Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint, text, func
from core.db.base import metadata

users_table = Table(
    'users',
    metadata,
    Column('user_id', Integer, primary_key=True, autoincrement=True),
    Column('name', String(100), nullable=False),
    Column('email', String(150), unique=True, nullable=False),
    Column('password', String(255), nullable=False),
    Column('created_at', DateTime, server_default=text('CURRENT_TIMESTAMP')),
    extend_existing=True
)
members = Table(
    "members",
    metadata,
    Column("id", Integer, primary_key=True),

    Column("user_id", Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False),
    Column("club_id", Integer, ForeignKey("clubs.club_id", ondelete="CASCADE"), nullable=False),

    Column("role", String(50), nullable=False),
    Column("joined_at", DateTime, server_default=text('CURRENT_TIMESTAMP')),



    UniqueConstraint("user_id", "club_id", name="uq_user_club"),
     extend_existing=True,
)
from sqlalchemy import Table, Column, Integer, ForeignKey, String, DateTime, func


member_requests = Table(
    "member_requests",
    metadata,
    Column("id", Integer, primary_key=True),

    Column(
        "user_id",
        Integer,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    ),

    Column(
        "club_id",
        Integer,
        ForeignKey("clubs.club_id", ondelete="CASCADE"),
        nullable=False
    ),

    Column("role", String(50), default="member"),
    Column("status", String(20), default="pending"),
    Column("requested_at", DateTime, server_default=text('CURRENT_TIMESTAMP')),
     extend_existing=True,
)
