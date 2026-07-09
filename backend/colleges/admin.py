from django.contrib import admin
from .models import College, Course


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display  = ['college_name', 'short_name', 'location_city', 'college_type', 'is_active', 'created_at']
    list_filter   = ['college_type', 'location_state', 'is_active']
    search_fields = ['college_name', 'short_name', 'location_city']
    list_editable = ['is_active']
    ordering      = ['college_name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display   = ['course_name', 'category', 'degree_type', 'college', 'is_active', 'created_at']
    list_filter    = ['category', 'degree_type', 'is_active', 'college']
    search_fields  = ['course_name', 'course_code', 'category']
    list_editable  = ['is_active']
    autocomplete_fields = ['college']
    readonly_fields = ['created_at', 'updated_at']
