"""
Serializers for Event model.
Handles data validation and serialization for API requests/responses.
"""
from rest_framework import serializers
from datetime import datetime

class EventSerializer(serializers.Serializer):
    """
    Serializer for Event model.
    """
    event_id = serializers.IntegerField(read_only=True)
    club_id = serializers.IntegerField(
        required=True,
        help_text="ID of the organizing club"
    )
    handler_id = serializers.IntegerField(
        required=True,
        help_text="User ID of the person managing the event"
    )
    title = serializers.CharField(
        max_length=200,
        required=True,
        help_text="Title of the event"
    )
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Detailed description of the event"
    )
    start_datetime = serializers.DateTimeField(
        required=True,
        help_text="Starting date and time"
    )
    end_datetime = serializers.DateTimeField(
        required=True,
        help_text="Ending date and time"
    )
    status = serializers.ChoiceField(
        choices=['pending', 'approved', 'completed', 'cancelled'],
        default='pending',
        help_text="Current status of the event"
    )
    created_at = serializers.DateTimeField(read_only=True)

    def validate(self, data):
        """
        Object-level validation to check start vs end time.
        """
        if data['start_datetime'] >= data['end_datetime']:
            raise serializers.ValidationError({
                "end_datetime": "End time must be after the start time."
            })
        return data

    def validate_title(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Event title must be at least 5 characters long")
        return value.strip()


class EventUpdateSerializer(serializers.Serializer):
    """
    Serializer for updating Event model.
    """
    title = serializers.CharField(max_length=200, required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    start_datetime = serializers.DateTimeField(required=False)
    end_datetime = serializers.DateTimeField(required=False)
    status = serializers.ChoiceField(
        choices=['pending', 'approved', 'completed', 'cancelled'],
        required=False
    )
    handler_id = serializers.IntegerField(required=False)

    def validate(self, data):
        """
        Logic for checking dates during partial updates.
        """
        start = data.get('start_datetime')
        end = data.get('end_datetime')

        # If both are being updated, check them against each other
        if start and end and start >= end:
            raise serializers.ValidationError("End time must be after start time.")
        
        return data