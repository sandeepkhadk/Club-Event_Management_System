from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from clubs.services import ClubService
from clubs.serializers import ClubSerializer, ClubUpdateSerializer
 # assuming you have a service to fetch users
import logging

logger = logging.getLogger(__name__)

class ClubListView(APIView):
    """
    API view for listing all clubs and creating new clubs.
    """

    def get(self, request):
        try:
            skip = int(request.query_params.get('skip', 0))
            limit = int(request.query_params.get('limit', 100))
            search = request.query_params.get('search', None)

            if skip < 0:
                skip = 0
            if limit <= 0 or limit > 100:
                limit = 100

            if search:
                clubs = ClubService.search_clubs(search)
            else:
                clubs = ClubService.get_all_clubs(skip=skip, limit=limit)

            total_count = ClubService.get_clubs_count()

            serializer = ClubSerializer([club.to_dict() for club in clubs], many=True)

            return Response({
                'success': True,
                'count': len(clubs),
                'total': total_count,
                'data': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error retrieving clubs: {str(e)}")
            return Response({'success': False, 'error': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        """
        Create a new club with `name` instead of `club_name` and `created_by` as foreign key.
        """
        try:
            # Validate input data
            serializer = ClubSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            # Verify that the user exists for created_by
            user_id = serializer.validated_data.get('created_by')
            if not UserService.get_user_by_id(user_id):
                return Response({
                    'success': False,
                    'error': f'User with id {user_id} does not exist'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create the club
            club = ClubService.create_club(serializer.validated_data)

            response_serializer = ClubSerializer(club.to_dict())

            return Response({
                'success': True,
                'message': 'Club created successfully',
                'data': response_serializer.data
            }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({'success': False, 'error': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating club: {str(e)}")
            return Response({
                'success': False,
                'error': 'An error occurred while creating the club'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
