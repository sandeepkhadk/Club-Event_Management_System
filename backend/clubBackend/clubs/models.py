"""
SQLAlchemy models for the club management system.
"""
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from clubs.database import Base


class Club(Base):
    """
    Club model representing the clubs table.
    
    Stores details of each club including name, description, and creator information.
    """
    __tablename__ = "clubs"
    
    # Primary Key
    club_id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        comment="Unique club ID"
    )
    
    # Club Information
    club_name = Column(
        String(100),
        unique=True,
        nullable=False,
        comment="Club name"
    )
    
    description = Column(
        Text,
        nullable=False,
        comment="Club description"
    )
    
    founded_date = Column(
        Date,
        nullable=True,
        comment="Establishment date"
    )
    
    # Foreign Key to Users table (creator/admin)
    created_by = Column(
        Integer,
        ForeignKey('users.user_id', ondelete='CASCADE'),
        nullable=False,
        comment="Club creator/admin"
    )
    
    # Timestamp
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
        comment="Record timestamp"
    )
    
    # Relationships
    # Uncomment when User model is created
    # creator = relationship("User", back_populates="created_clubs")
    
    def __repr__(self):
        return f"<Club(club_id={self.club_id}, club_name='{self.club_name}')>"
    
    def to_dict(self):
        """
        Convert model instance to dictionary.
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
    def from_dict(cls, data):
        """
        Create a Club instance from dictionary.
        Useful for creating models from request data.
        """
        return cls(
            club_name=data.get('club_name'),
            description=data.get('description'),
            founded_date=data.get('founded_date'),
            created_by=data.get('created_by'),
        )


# Placeholder for User model (for reference)
# This should be in a separate users app
class User(Base):
    """
    User model representing the users table.
    This is a placeholder - you should create a proper users app.
    """
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, server_default=func.current_timestamp())
    
    # Relationship
    # created_clubs = relationship("Club", back_populates="creator")
    
    def __repr__(self):
        return f"<User(user_id={self.user_id}, username='{self.username}')>"