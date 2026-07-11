from rest_framework import serializers
from .models import College, Course


# ── College serializers ────────────────────────────────────────────────────────

class CollegeListSerializer(serializers.ModelSerializer):
    courses_offered_display = serializers.ReadOnlyField()
    primary_image_url = serializers.SerializerMethodField()
    banner_image_url  = serializers.SerializerMethodField()

    class Meta:
        model = College
        fields = [
            'id', 'college_name', 'short_name', 'slug',
            'location_city', 'location_state',
            'university_affiliation', 'college_type', 'accreditation',
            'established', 'rating', 'courses_offered', 'courses_offered_display',
            'primary_image_url', 'banner_image_url',
            'college_images', 'campus_images',
            'phone', 'email', 'website',
            'facilities', 'why_choose_us',
            'is_active', 'created_at', 'updated_at',
        ]

    def get_primary_image_url(self, obj):
        request = self.context.get('request')
        if obj.primary_image and request:
            return request.build_absolute_uri(obj.primary_image.url)
        return None

    def get_banner_image_url(self, obj):
        request = self.context.get('request')
        if obj.banner_image and request:
            return request.build_absolute_uri(obj.banner_image.url)
        return None


class CollegeDetailSerializer(CollegeListSerializer):
    class Meta(CollegeListSerializer.Meta):
        fields = CollegeListSerializer.Meta.fields + [
            'description', 'address',
        ]


# ── Course serializers (matching remote API format exactly) ───────────────────

class CourseCollegeDetailSerializer(serializers.ModelSerializer):
    """Nested college info embedded in each course response."""
    college_id    = serializers.IntegerField(source='id', read_only=True)
    banner_image  = serializers.SerializerMethodField()
    primary_image_url = serializers.SerializerMethodField()

    class Meta:
        model = College
        fields = [
            'college_id', 'college_name', 'short_name',
            'banner_image', 'primary_image_url', 'location_city', 'location_state',
        ]

    def get_banner_image(self, obj):
        request = self.context.get('request')
        if obj.banner_image and request:
            return request.build_absolute_uri(obj.banner_image.url)
        # Fall back to stored URL string if it is a plain URL (not a file)
        return None

    def get_primary_image_url(self, obj):
        request = self.context.get('request')
        if obj.primary_image and request:
            return request.build_absolute_uri(obj.primary_image.url)
        return None


class CourseSerializer(serializers.ModelSerializer):
    # ── top-level display fields ──────────────────────────────────────────────
    course_id            = serializers.IntegerField(source='id',                   read_only=True)
    category_display     = serializers.ReadOnlyField()
    course_code_display  = serializers.ReadOnlyField()
    course_name_display  = serializers.ReadOnlyField()
    degree_type_display  = serializers.ReadOnlyField()

    # ── nested college details ────────────────────────────────────────────────
    college_details = serializers.SerializerMethodField()

    class Meta:
        model  = Course
        fields = [
            # display / computed
            'course_id',
            'category_display',
            'course_code_display',
            'course_name_display',
            'degree_type_display',
            'college_details',
            # raw / writable
            'category',
            'course_code',
            'course_name',
            'degree_type',
            'duration',
            'is_active',
            'created_at',
            'updated_at',
            'college',
        ]

    def get_college_details(self, obj):
        if not obj.college:
            return None
        return CourseCollegeDetailSerializer(
            obj.college,
            context=self.context,
        ).data


class CourseDetailSerializer(CourseSerializer):
    """Alias — same as CourseSerializer (all fields already included)."""
    pass
