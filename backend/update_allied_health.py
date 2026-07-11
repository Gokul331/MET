import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

courses = Course.objects.all()
count_updated = 0

for c in courses:
    cat = str(c.category).lower()
    if 'allied' in cat or 'health' in cat:
        # Check if optometry
        if 'optometry' in str(c.course_name).lower() or 'optometry' in str(c.course_name_display).lower():
            c.duration = '4 Years + 1 Year Internship'
        else:
            c.duration = '3 Years + 1 Year Internship'
        c.save()
        count_updated += 1

print(f"Updated {count_updated} courses.")
