"""
Service layer for Club operations.
Handles business logic and database operations.
hi my name is santosh khadka . i am styding in thapathali campus also i am a backend developer and data scientist with the great experience of the ml and ai. i have also a great experience of finance. i do nto have any hobby.
"""

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from clubs.models import Club
from typing import List, Optional, Dict, Any
from datetime import datetime


class ClubService:
    """
    Service class for Club-related operations.
    Encapsulates business logic and database queries.
    """
    
    @staticmethod
    def get_all_clubs(db: Session, skip: int = 0, limit: int = 100) -> List[Club]:
        """
        Retrieve all clubs with pagination.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of Club objects
        """
        try:
            return db.query(Club).offset(skip).limit(limit).all()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def get_club_by_id(db: Session, club_id: int) -> Optional[Club]:
        """
        Retrieve a single club by ID.
        
        Args:
            db: Database session
            club_id: ID of the club to retrieve
            
        Returns:
            Club object or None if not found
        """
        try:
            return db.query(Club).filter(Club.club_id == club_id).first()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def get_club_by_name(db: Session, club_name: str) -> Optional[Club]:
        """
        Retrieve a club by name.
        
        Args:
            db: Database session
            club_name: Name of the club
            
        Returns:
            Club object or None if not found
        """
        try:
            return db.query(Club).filter(Club.club_name == club_name).first()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def create_club(db: Session, club_data: Dict[str, Any]) -> Club:
        """
        Create a new club.
        
        Args:
            db: Database session
            club_data: Dictionary containing club information
            
        Returns:
            Created Club object
            
        Raises:
            ValueError: If club name already exists
            Exception: For database errors
        """
        try:
            # Check if club name already exists
            existing_club = ClubService.get_club_by_name(db, club_data.get('club_name'))
            if existing_club:
                raise ValueError(f"Club with name '{club_data.get('club_name')}' already exists")
            
            # Create new club
            new_club = Club.from_dict(club_data)
            db.add(new_club)
            db.commit()
            db.refresh(new_club)
            return new_club
            
        except IntegrityError as e:
            db.rollback()
            raise ValueError(f"Data integrity error: {str(e)}")
        except SQLAlchemyError as e:
            db.rollback()
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def update_club(db: Session, club_id: int, club_data: Dict[str, Any]) -> Optional[Club]:
        """
        Update an existing club.
        
        Args:
            db: Database session
            club_id: ID of the club to update
            club_data: Dictionary containing updated club information
            
        Returns:
            Updated Club object or None if not found
            
        Raises:
            ValueError: If new club name already exists
            Exception: For database errors
        """
        try:
            club = ClubService.get_club_by_id(db, club_id)
            if not club:
                return None
            
            # Check if new club name conflicts with existing clubs
            if 'club_name' in club_data and club_data['club_name'] != club.club_name:
                existing_club = ClubService.get_club_by_name(db, club_data['club_name'])
                if existing_club:
                    raise ValueError(f"Club with name '{club_data['club_name']}' already exists")
            
            # Update club fields
            for key, value in club_data.items():
                if hasattr(club, key) and key not in ['club_id', 'created_at', 'created_by']:
                    setattr(club, key, value)
            
            db.commit()
            db.refresh(club)
            return club
            
        except IntegrityError as e:
            db.rollback()
            raise ValueError(f"Data integrity error: {str(e)}")
        except SQLAlchemyError as e:
            db.rollback()
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def delete_club(db: Session, club_id: int) -> bool:
        """
        Delete a club by ID.
        
        Args:
            db: Database session
            club_id: ID of the club to delete
            
        Returns:
            True if deleted, False if not found
            
        Raises:
            Exception: For database errors
        """
        try:
            club = ClubService.get_club_by_id(db, club_id)
            if not club:
                return False
            
            db.delete(club)
            db.commit()
            return True
            
        except SQLAlchemyError as e:
            db.rollback()
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def get_clubs_by_creator(db: Session, user_id: int) -> List[Club]:
        """
        Get all clubs created by a specific user.
        
        Args:
            db: Database session
            user_id: ID of the user
            
        Returns:
            List of Club objects
        """
        try:
            return db.query(Club).filter(Club.created_by == user_id).all()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def search_clubs(db: Session, search_term: str) -> List[Club]:
        """
        Search clubs by name or description.
        
        Args:
            db: Database session
            search_term: Search term to match against name or description
            
        Returns:
            List of matching Club objects
        """
        try:
            search_pattern = f"%{search_term}%"
            return db.query(Club).filter(
                (Club.club_name.ilike(search_pattern)) | 
                (Club.description.ilike(search_pattern))
            ).all()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def get_clubs_count(db: Session) -> int:
        """
        Get total count of clubs.
        
        Args:
            db: Database session
            
        Returns:
            Total number of clubs
        """
        try:
            return db.query(Club).count()
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")