from django.db import models


class ContactMessage(models.Model):
    name       = models.CharField(max_length=150)
    email      = models.EmailField()
    mobile     = models.CharField(max_length=15, blank=True)
    subject    = models.CharField(max_length=200, blank=True)
    message    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

    def __str__(self):
        return f'{self.name} — {self.subject or "No Subject"}'
