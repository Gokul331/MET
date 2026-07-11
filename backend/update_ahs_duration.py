import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

courses = Course.objects.filter(category='allied_health_science')
updated_count = 0
for c in courses:
    name_lower = c.course_name.lower()
    if 'optometry' in name_lower:
        c.duration = '4 Years + 1 Year Internship'
    else:
        c.duration = '3 Years + 1 Year Internship'
    c.save()
    updated_count += 1

print(f"Updated {updated_count} allied health science courses.")
