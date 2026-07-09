from django.db import models


class College(models.Model):
    COLLEGE_TYPE_CHOICES = [
        ('autonomous', 'Autonomous'),
        ('affiliated', 'Affiliated'),
        ('government', 'Government Aided'),
        ('private',    'Private Unaided'),
    ]

    college_name          = models.CharField(max_length=300)
    short_name            = models.CharField(max_length=20, unique=True, db_index=True)
    location_city         = models.CharField(max_length=100, blank=True)
    location_state        = models.CharField(max_length=100, default='Tamil Nadu')
    university_affiliation= models.CharField(max_length=200, blank=True)
    college_type          = models.CharField(max_length=20, choices=COLLEGE_TYPE_CHOICES, default='affiliated')
    accreditation         = models.CharField(max_length=100, blank=True)
    established           = models.IntegerField(null=True, blank=True)
    description           = models.TextField(blank=True)
    courses_offered       = models.JSONField(default=list, blank=True)
    primary_image         = models.ImageField(upload_to='colleges/images/', null=True, blank=True)
    banner_image          = models.ImageField(upload_to='colleges/banners/', null=True, blank=True)
    phone                 = models.CharField(max_length=20, blank=True)
    email                 = models.EmailField(blank=True)
    website               = models.URLField(blank=True)
    address               = models.TextField(blank=True)
    is_active             = models.BooleanField(default=True)
    created_at            = models.DateTimeField(auto_now_add=True)
    updated_at            = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['college_name']
        verbose_name = 'College'
        verbose_name_plural = 'Colleges'

    def __str__(self):
        return f'{self.college_name} ({self.short_name})'

    @property
    def courses_offered_display(self):
        return self.courses_offered


# ── Category display labels (slug → human label) ──────────────────────────────
CATEGORY_DISPLAY = {
    'engineering':           'Engineering and Technology',
    'polytechnic':           'Engineering and Technology',
    'computer_applications': 'Computer Applications',
    'management':            'Management',
    'arts_science':          'Arts and Science',
    'pharmacy':              'Pharmacy',
    'allied_health_science': 'Allied Health Science',
    'physiotherapy':         'Allied Health Science',
    'occupational_therapy':  'Allied Health Science',
    'nursing':               'Nursing',
    'architecture':          'Architecture',
    'agriculture':           'Agricultural Science',
    'education':             'Education',
    'law':                   'Law',
    'medical':               'Medical',
}

DEGREE_TYPE_DISPLAY = {
    'ug':      'UG',
    'pg':      'PG',
    'diploma': 'Diploma',
    'phd':     'PhD',
}


class Course(models.Model):
    DEGREE_TYPE_CHOICES = [
        ('ug',      'UG'),
        ('pg',      'PG'),
        ('diploma', 'Diploma'),
        ('phd',     'PhD'),
    ]

    # ── Core fields (matching remote API structure) ────────────────────────────
    course_code = models.CharField(max_length=50, blank=True, db_index=True)
    course_name = models.CharField(max_length=300)
    category    = models.CharField(max_length=100, db_index=True)   # slug e.g. "engineering"
    degree_type = models.CharField(
        max_length=20, choices=DEGREE_TYPE_CHOICES, default='ug', db_index=True
    )
    duration    = models.CharField(max_length=50, blank=True, default='3 Years')
    college     = models.ForeignKey(
        College, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='courses'
    )
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'course_name']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

    def __str__(self):
        return f'{self.course_name} ({self.degree_type.upper()})'

    # ── Computed display helpers ───────────────────────────────────────────────
    @property
    def category_display(self):
        return CATEGORY_DISPLAY.get(self.category, self.category.replace('_', ' ').title())

    @property
    def degree_type_display(self):
        return DEGREE_TYPE_DISPLAY.get(self.degree_type, self.degree_type.upper())

    @property
    def course_name_display(self):
        return self.course_name

    @property
    def course_code_display(self):
        return self.course_name  # display the full name (same as remote API)
