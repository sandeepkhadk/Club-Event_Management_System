"""
Service layer for Club operations using raw SQL.
Handles business logic and database operations.
"""
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from clubs.models import Club
from clubs.database import get_db_connection
from typing import List, Optional, Dict, Any
from datetime import datetime


class ClubService:
    """
    Service class for Club-related operations.
    Uses raw SQL queries instead of ORM.
    """
    
    @staticmethod
    def get_all_clubs(skip: int = 0, limit: int = 100) -> List[Club]:
        """
        Retrieve all clubs with pagination using raw SQL.
        
        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of Club objects
        """
        sql = text("""
            SELECT club_id, club_name, description, founded_date, created_by, created_at
            FROM clubs
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :skip
        """)
        
        try:
            with get_db_connection() as conn:
                result = conn.execute(sql, {'skip': skip, 'limit': limit})
                rows = result.fetchall()
                return [Club.from_db_row(row) for row in rows]
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def get_club_by_id(club_id: int) -> Optional[Club]:
        """
        Retrieve a single club by ID using raw SQL.
        
        Args:
            club_id: ID of the club to retrieve
            
        Returns:
            Club object or None if not found
        """
        sql = text("""
            SELECT club_id, club_name, description, founded_date, created_by, created_at
            FROM clubs
            WHERE club_id = :club_id
        """)
        
        try:
            with get_db_connection() as conn:
                result = conn.execute(sql, {'club_id': club_id})
                row = result.fetchone()
                return Club.from_db_row(row) if row else None
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def get_club_by_name(club_name: str) -> Optional[Club]:
        """
        Retrieve a club by name using raw SQL.
        
        Args:
            club_name: Name of the club
            
        Returns:
            Club object or None if not found
        """
        sql = text("""
            SELECT club_id, club_name, description, founded_date, created_by, created_at
            FROM clubs
            WHERE club_name = :club_name
        """)
        
        try:
            with get_db_connection() as conn:
                result = conn.execute(sql, {'club_name': club_name})
                row = result.fetchone()
                return Club.from_db_row(row) if row else None
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def create_club(club_data: Dict[str, Any]) -> Club:
        """
        Create a new club using raw SQL INSERT.
        
        Args:
            club_data: Dictionary containing club information
            
        Returns:
            Created Club object
            
        Raises:
            ValueError: If club name already exists
            Exception: For database errors
        """
        # Check if club name already exists
        existing_club = ClubService.get_club_by_name(club_data.get('club_name'))
        if existing_club:
            raise ValueError(f"Club with name '{club_data.get('club_name')}' already exists")
        
        sql = text("""
            INSERT INTO clubs (club_name, description, founded_date, created_by, created_at)
            VALUES (:club_name, :description, :founded_date, :created_by, :created_at)
            RETURNING club_id, club_name, description, founded_date, created_by, created_at
        """)
        
        try:
            # Prepare data
            params = {
                'club_name': club_data.get('club_name'),
                'description': club_data.get('description'),
                'founded_date': club_data.get('founded_date'),
                'created_by': club_data.get('created_by'),
                'created_at': datetime.now(),
            }
            
            with get_db_connection() as conn:
                result = conn.execute(sql, params)
                row = result.fetchone()
                return Club.from_db_row(row)
                
        except IntegrityError as e:
            # Handle unique constraint violations, foreign key errors
            error_msg = str(e.orig) if hasattr(e, 'orig') else str(e)
            
            if 'unique constraint' in error_msg.lower() or 'duplicate key' in error_msg.lower():
                raise ValueError(f"Club with name '{club_data.get('club_name')}' already exists")
            elif 'foreign key' in error_msg.lower():
                raise ValueError(f"User with ID {club_data.get('created_by')} does not exist")
            else:
                raise ValueError(f"Data integrity error: {error_msg}")
                
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def update_club(club_id: int, club_data: Dict[str, Any]) -> Optional[Club]:
        """
        Update an existing club using raw SQL UPDATE.
        
        Args:
            club_id: ID of the club to update
            club_data: Dictionary containing updated club information
            
        Returns:
            Updated Club object or None if not found
            
        Raises:
            ValueError: If new club name already exists
            Exception: For database errors
        """
        # Check if club exists
        existing_club = ClubService.get_club_by_id(club_id)
        if not existing_club:
            return None
        
        # Check if new club name conflicts with existing clubs
        if 'club_name' in club_data and club_data['club_name'] != existing_club.club_name:
            name_conflict = ClubService.get_club_by_name(club_data['club_name'])
            if name_conflict:
                raise ValueError(f"Club with name '{club_data['club_name']}' already exists")
        
        # Build dynamic UPDATE query based on provided fields
        update_fields = []
        params = {'club_id': club_id}
        
        # Only update fields that are provided
        if 'club_name' in club_data:
            update_fields.append("club_name = :club_name")
            params['club_name'] = club_data['club_name']
        
        if 'description' in club_data:
            update_fields.append("description = :description")
            params['description'] = club_data['description']
        
        if 'founded_date' in club_data:
            update_fields.append("founded_date = :founded_date")
            params['founded_date'] = club_data['founded_date']
        
        # If no fields to update, return existing club
        if not update_fields:
            return existing_club
        
        sql = text(f"""
            UPDATE clubs
            SET {', '.join(update_fields)}
            WHERE club_id = :club_id
            RETURNING club_id, club_name, description, founded_date, created_by, created_at
        """)
        
        try:
            with get_db_connection() as conn:
                result = conn.execute(sql, params)
                row = result.fetchone()
                return Club.from_db_row(row) if row else None
                
        except IntegrityError as e:
            error_msg = str(e.orig) if hasattr(e, 'orig') else str(e)
            
            if 'unique constraint' in error_msg.lower() or 'duplicate key' in error_msg.lower():
                raise ValueError(f"Club with name '{club_data.get('club_name')}' already exists")
            else:
                raise ValueError(f"Data integrity error: {error_msg}")
                
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def delete_club(club_id: int) -> bool:
        """
        Delete a club by ID using raw SQL DELETE.
        
        Args:
            club_id: ID of the club to delete
            
        Returns:
            True if deleted, False if not found
            
        Raises:
            Exception: For database errors
        """
        # First check if club exists
        existing_club = ClubService.get_club_by_id(club_id)
        if not existing_club:
            return False
        
        sql = text("""
            DELETE FROM clubs
            WHERE club_id = :club_id
        """)
        
        try:
            with get_db_connection() as conn:
                result = conn.execute(sql, {'club_id': club_id})
                # rowcount tells us how many rows were affected
                return result.rowcount > 0
                
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def get_clubs_by_creator(user_id: int) -> List[Club]:
        """
        Get all clubs created by a specific user using raw SQL.
        
        Args:
            user_id: ID of the user
            
        Returns:
            List of Club objects
        """
        sql = text("""
            SELECT club_id, club_name, description, founded_date, created_by, created_at
            FROM clubs
            WHERE created_by = :user_id
            ORDER BY created_at DESC
        """)
        
        try:
            with get_db_connection() as conn:
                result = conn.execute(sql, {'user_id': user_id})
                rows = result.fetchall()
                return [Club.from_db_row(row) for row in rows]
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def search_clubs(search_term: str) -> List[Club]:
        """
        Search clubs by name or description using raw SQL with ILIKE.
        
        Args:
            search_term: Search term to match against name or description
            
        Returns:
            List of matching Club objects
        """
        sql = text("""
            SELECT club_id, club_name, description, founded_date, created_by, created_at
            FROM clubs
            WHERE club_name ILIKE :search_pattern
               OR description ILIKE :search_pattern
            ORDER BY created_at DESC
        """)
        
        try:
            search_pattern = f"%{search_term}%"
            with get_db_connection() as conn:
                result = conn.execute(sql, {'search_pattern': search_pattern})
                rows = result.fetchall()
                return [Club.from_db_row(row) for row in rows]
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def get_clubs_count() -> int:
        """
        Get total count of clubs using raw SQL COUNT.
        
        Returns:
            Total number of clubs
        """
        sql = text("""
            SELECT COUNT(*) as total
            FROM clubs
        """)
        
        try:
            with get_db_connection() as conn:
                result = conn.execute(sql)
                row = result.fetchone()
                return row.total if row else 0
        except SQLAlchemyError as e:
            raise Exception(f"Database error: {str(e)}")