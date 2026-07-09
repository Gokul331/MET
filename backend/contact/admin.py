from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display  = ['name', 'email', 'mobile', 'subject', 'created_at']
    list_filter   = ['created_at']
    search_fields = ['name', 'email', 'mobile', 'subject', 'message']
    readonly_fields = ['created_at']
    ordering      = ['-created_at']
