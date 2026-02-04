"""
Data models for clubs (non-ORM, plain Python classes).
These are simple data containers, not database models.
"""
from datetime import datetime, date
from typing import Optional, Dict, Any


class Club:
    """
    Club data class.
    Represents a club record from the database.
    """
    
    def __init__(
        self,
        club_id: Optional[int] = None,
        club_name: str = '',
        description: str = '',
        founded_date: Optional[date] = None,
        created_by: int = 0,
        created_at: Optional[datetime] = None
    ):
        self.club_id = club_id
        self.club_name = club_name
        self.description = description
        self.founded_date = founded_date
        self.created_by = created_by
        self.created_at = created_at
    
    def __repr__(self):
        return f"<Club(club_id={self.club_id}, club_name='{self.club_name}')>"
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert Club instance to dictionary.
        Useful for JSON serialization.
        """
        return {
            'club_id': self.club_id,
            'club_name': self.club_name,
            'description': self.description,
            'founded_date': self.founded_date.isoformat() if self.founded_date else None,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Club':
        """
        Create a Club instance from dictionary.
        """
        return cls(
            club_id=data.get('club_id'),
            club_name=data.get('club_name', ''),
            description=data.get('description', ''),
            founded_date=data.get('founded_date'),
            created_by=data.get('created_by', 0),
            created_at=data.get('created_at'),
        )
    
    @classmethod
    def from_db_row(cls, row) -> 'Club':
        """
        Create a Club instance from a database row.
        
        Args:
            row: SQLAlchemy Row object from raw SQL query
            
        Returns:
            Club instance
        """
        if not row:
            return None
        
        return cls(
            club_id=row.club_id,
            club_name=row.club_name,
            description=row.description,
            founded_date=row.founded_date,
            created_by=row.created_by,
            created_at=row.created_at,
        )


class User:
    """
    User data class (placeholder).
    This should ideally come from the Users app.
    """
    
    def __init__(
        self,
        user_id: Optional[int] = None,
        name: str = '',
        email: str = '',
        password: str = '',
        created_at: Optional[datetime] = None
    ):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.password = password
        self.created_at = created_at
    
    def __repr__(self):
        return f"<User(user_id={self.user_id}, name='{self.name}')>"
    
    @classmethod
    def from_db_row(cls, row) -> 'User':
        """Create User instance from database row."""
        if not row:
            return None
        
        return cls(
            user_id=row.user_id,
            name=row.name,
            email=row.email,
            password=row.password,
            created_at=row.created_at,
        )