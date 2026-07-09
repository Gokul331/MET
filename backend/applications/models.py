import uuid
from django.db import models
from colleges.models import College


def application_id_default():
    from django.utils import timezone
    # Generate timestamp format APP-YYYYMMDDHHMMSS
    return f"APP-{timezone.now().strftime('%Y%m%d%H%M%S')}"


class Application(models.Model):
    STATUS_CHOICES = [
        ('submitted',    'Submitted'),
        ('under_review', 'Under Review'),
        ('approved',     'Approved'),
        ('rejected',     'Rejected'),
    ]

    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    # Application ID
    application_id   = models.CharField(max_length=30, unique=True, default=application_id_default, db_index=True)

    # Bio-data
    first_name       = models.CharField(max_length=100)
    last_name        = models.CharField(max_length=100)
    full_name        = models.CharField(max_length=200, blank=True) # auto-computed from first + last name
    gender           = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    dob              = models.DateField(null=True, blank=True)
    mobile           = models.CharField(max_length=15)
    email            = models.EmailField(db_index=True)
    blood_group      = models.CharField(max_length=10, blank=True)
    community        = models.CharField(max_length=50, blank=True)
    aadhar_number    = models.CharField(max_length=20, blank=True)

    # Parent's Details
    father_name      = models.CharField(max_length=150, blank=True)
    father_mobile    = models.CharField(max_length=15, blank=True)
    mother_name      = models.CharField(max_length=150, blank=True)
    mother_mobile    = models.CharField(max_length=15, blank=True)

    # Address
    address_line1    = models.CharField(max_length=255, blank=True)
    address_line2    = models.CharField(max_length=255, blank=True)
    city             = models.CharField(max_length=100, blank=True)
    pincode          = models.CharField(max_length=15, blank=True)

    # Education Details
    tenth_percentage  = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    twelfth_percentage= models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    has_diploma       = models.BooleanField(default=False)
    diploma_percentage= models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    has_ug            = models.BooleanField(default=False)
    ug_percentage     = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # College & Course Preferences
    college          = models.ForeignKey(College, null=True, blank=True, on_delete=models.SET_NULL, related_name='applications')
    college_name     = models.CharField(max_length=300, blank=True)
    category         = models.CharField(max_length=100, blank=True)
    degree_type      = models.CharField(max_length=50, blank=True)
    course_name      = models.CharField(max_length=200, blank=True)
    department_name  = models.CharField(max_length=200, blank=True)

    # Reference Info
    reference_name   = models.CharField(max_length=150, blank=True)

    # Documents (optional)
    photo            = models.ImageField(upload_to='applications/photos/', null=True, blank=True)
    tenth_marksheet  = models.FileField(upload_to='applications/docs/', null=True, blank=True)
    twelfth_marksheet= models.FileField(upload_to='applications/docs/', null=True, blank=True)
    aadhar           = models.FileField(upload_to='applications/docs/', null=True, blank=True)

    # Status
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    rejection_reason = models.TextField(blank=True)
    counselor_notes  = models.TextField(blank=True)

    # Timestamps
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'

    def __str__(self):
        return f'{self.application_id} — {self.first_name} {self.last_name} ({self.email})'

    def save(self, *args, **kwargs):
        # Auto-compute full name
        self.full_name = f"{self.first_name} {self.last_name}".strip()
        # Auto-fill college_name from FK if present and not set
        if self.college and not self.college_name:
            self.college_name = self.college.college_name
        super().save(*args, **kwargs)

