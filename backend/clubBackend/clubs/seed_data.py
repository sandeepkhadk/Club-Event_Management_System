from django.core.management.base import BaseCommand
from clubs.database import get_db_context
from clubs.models import User, Club
from datetime import date, datetime


class Command(BaseCommand):
    help = 'Seed the database with sample data'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=5,
            help='Number of sample users to create (default: 5)',
        )
        parser.add_argument(
            '--clubs',
            type=int,
            default=10,
            help='Number of sample clubs to create (default: 10)',
        )
    
    def handle(self, *args, **options):
        """Execute the command."""
        try:
            num_users = options['users']
            num_clubs = options['clubs']
            
            with get_db_context() as db:
                # Create sample users
                self.stdout.write(f'Creating {num_users} sample users...')
                users = []
                for i in range(1, num_users + 1):
                    user = User(
                        username=f'user{i}',
                        email=f'user{i}@example.com'
                    )
                    db.add(user)
                    users.append(user)
                
                db.flush()  # Get user IDs
                
                # Create sample clubs
                self.stdout.write(f'Creating {num_clubs} sample clubs...')
                club_names = [
                    'Chess Club', 'Drama Society', 'Photography Club',
                    'Debate Team', 'Music Band', 'Coding Club',
                    'Environmental Club', 'Sports Club', 'Art Society',
                    'Book Club', 'Dance Crew', 'Science Club',
                    'Robotics Team', 'Volunteer Club', 'Gaming Society'
                ]
                
                club_descriptions = [
                    'A community for chess enthusiasts',
                    'Performing arts and theater productions',
                    'Capturing moments through the lens',
                    'Sharpening argumentative and public speaking skills',
                    'Creating and performing music together',
                    'Learning programming and software development',
                    'Promoting sustainability and environmental awareness',
                    'Athletic activities and team sports',
                    'Exploring various forms of visual arts',
                    'Discussing literature and books',
                    'Learning and performing various dance styles',
                    'Exploring scientific concepts and experiments',
                    'Building and programming robots',
                    'Making a difference through community service',
                    'Video games and esports competition'
                ]
                
                for i in range(num_clubs):
                    club = Club(
                        club_name=club_names[i % len(club_names)] + f' {i+1}',
                        description=club_descriptions[i % len(club_descriptions)],
                        founded_date=date(2020 + (i % 5), (i % 12) + 1, 1),
                        created_by=users[i % len(users)].user_id
                    )
                    db.add(club)
                
                db.commit()
                
                self.stdout.write(self.style.SUCCESS(
                    f'Successfully created {num_users} users and {num_clubs} clubs'
                ))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
            raise
