from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'application_id',
            'first_name', 'last_name', 'full_name', 'gender', 'dob', 'mobile', 'email',
            'blood_group', 'community', 'aadhar_number',
            'father_name', 'father_mobile', 'mother_name', 'mother_mobile',
            'address_line1', 'address_line2', 'city', 'pincode',
            'tenth_percentage', 'twelfth_percentage',
            'has_diploma', 'diploma_percentage',
            'has_ug', 'ug_percentage',
            'college', 'college_name', 'category', 'degree_type', 'course_name', 'department_name',
            'reference_name',
            'status', 'status_display', 'rejection_reason',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'application_id', 'status', 'rejection_reason',
            'status_display', 'created_at', 'updated_at',
        ]

    def validate_mobile(self, value):
        cleaned = ''.join(filter(str.isdigit, value))
        if len(cleaned) < 10:
            raise serializers.ValidationError('Enter a valid 10-digit mobile number.')
        return cleaned

    def validate_email(self, value):
        return value.lower().strip()


class ApplicationCreateSerializer(ApplicationSerializer):
    """Accepts file uploads too."""
    class Meta(ApplicationSerializer.Meta):
        fields = ApplicationSerializer.Meta.fields + [
            'photo', 'tenth_marksheet', 'twelfth_marksheet', 'aadhar',
        ]


class ApplicationListSerializer(serializers.ModelSerializer):
    """Slim serializer for the email-lookup list."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'application_id',
            'full_name', 'email', 'mobile',
            'college_name', 'category', 'degree_type', 'course_name', 'department_name',
            'status', 'status_display',
            'created_at',
        ]

