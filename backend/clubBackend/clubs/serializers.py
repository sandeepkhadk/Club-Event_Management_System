# """
# Serializers for Club model.
# Handles data validation and serialization for API requests/responses.
# """
# from rest_framework import serializers
# from datetime import date


# class ClubSerializer(serializers.Serializer):
#     """
#     Serializer for Club model.
#     Validates input data and serializes output data.
#     """
#     club_id = serializers.IntegerField(read_only=True)
#     name = serializers.CharField(
#         max_length=150,
#         required=True,
#         help_text="Unique name of the club"
#     )
#     description = serializers.CharField(
#         required=True,
#         help_text="Detailed description of the club"
#     )
#     founded_date = serializers.DateField(
#         required=False,
#         allow_null=True,
#         help_text="Date when the club was founded"
#     )
#     created_by = serializers.IntegerField(
#         required=True,
#         help_text="User ID of the club creator/admin"
#     )
#     created_at = serializers.DateTimeField(read_only=True)
    
#     def validate_name(self, value):
#         """
#         Validate that name is not empty and has reasonable length.
#         """
#         if not value or len(value.strip()) == 0:
#             raise serializers.ValidationError("Club name cannot be empty")
#         if len(value) < 3:
#             raise serializers.ValidationError("Club name must be at least 3 characters long")
#         return value.strip()
    
#     def validate_description(self, value):
#         """
#         Validate that description is not empty.
#         """
#         if not value or len(value.strip()) == 0:
#             raise serializers.ValidationError("Description cannot be empty")
#         if len(value) < 10:
#             raise serializers.ValidationError("Description must be at least 10 characters long")
#         return value.strip()
    
#     def validate_founded_date(self, value):
#         """
#         Validate that founded date is not in the future.
#         """
#         if value and value > date.today():
#             raise serializers.ValidationError("Founded date cannot be in the future")
#         return value
    
#     def validate_created_by(self, value):
#         """
#         Validate that created_by is a positive integer.
#         """
#         if value <= 0:
#             raise serializers.ValidationError("Invalid user ID")
#         return value


# class ClubUpdateSerializer(serializers.Serializer):
#     """
#     Serializer for updating Club model.
#     All fields are optional for partial updates.
#     """
#     name = serializers.CharField(
#         max_length=150,
#         required=False,
#         help_text="Unique name of the club"
#     )
#     description = serializers.CharField(
#         required=False,
#         help_text="Detailed description of the club"
#     )
#     founded_date = serializers.DateField(
#         required=False,
#         allow_null=True,
#         help_text="Date when the club was founded"
#     )
    
#     def validate_name(self, value):
#         """Validate club name if provided."""
#         if value and len(value.strip()) < 3:
#             raise serializers.ValidationError("Club name must be at least 3 characters long")
#         return value.strip() if value else value
    
#     def validate_description(self, value):
#         """Validate description if provided."""
#         if value and len(value.strip()) < 10:
#             raise serializers.ValidationError("Description must be at least 10 characters long")
#         return value.strip() if value else value
    
#     def validate_founded_date(self, value):
#         """Validate founded date if provided."""
#         if value and value > date.today():
#             raise serializers.ValidationError("Founded date cannot be in the future")
#         return value
