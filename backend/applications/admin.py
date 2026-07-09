from django.contrib import admin
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display  = [
        'application_id', 'full_name', 'email', 'mobile',
        'category', 'degree_type', 'course_name', 'college_name',
        'status', 'created_at',
    ]
    list_filter   = ['status', 'category', 'degree_type', 'course_name', 'college_name', 'created_at']
    search_fields = ['first_name', 'last_name', 'full_name', 'email', 'mobile', 'application_id', 'college_name']
    list_editable = ['status']
    ordering      = ['-created_at']
    readonly_fields = ['application_id', 'full_name', 'created_at', 'updated_at']

    fieldsets = [
        ('Application Status', {
            'fields': ('application_id', 'status', 'rejection_reason', 'counselor_notes'),
        }),
        ('Bio-data', {
            'fields': (
                ('first_name', 'last_name'),
                'full_name',
                ('gender', 'dob'),
                ('mobile', 'email'),
                ('blood_group', 'community', 'aadhar_number'),
            ),
        }),
        ("Parent's Details", {
            'fields': (
                ('father_name', 'father_mobile'),
                ('mother_name', 'mother_mobile'),
            ),
        }),
        ('Address', {
            'fields': (
                'address_line1',
                'address_line2',
                ('city', 'pincode'),
            ),
        }),
        ('Academic Details', {
            'fields': (
                ('tenth_percentage', 'twelfth_percentage'),
                ('has_diploma', 'diploma_percentage'),
                ('has_ug', 'ug_percentage'),
            ),
        }),
        ('College & Course Preference', {
            'fields': (
                'college',
                'college_name',
                'category',
                'degree_type',
                'course_name',
                'department_name',
                'reference_name',
            ),
        }),
        ('Uploaded Documents', {
            'fields': ('photo', 'tenth_marksheet', 'twelfth_marksheet', 'aadhar'),
            'classes': ('collapse',),
        }),
        ('System Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    ]

