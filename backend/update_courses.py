import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

courses = Course.objects.all()
for c in courses:
    # Update description if empty or generic
    if not c.course_description:
        c.course_description = f"A comprehensive program in {c.course_name} designed to prepare students for top industry opportunities."
    
    # Update duration for agriculture
    if c.category == 'agriculture':
        c.duration = '4 Years'
        
    c.save()

print(f"Updated {courses.count()} courses.")
