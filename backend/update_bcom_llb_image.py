import os
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

mappings = [
    ('B.Com. LLB (Hons.)', 'https://i.pinimg.com/736x/a4/b5/2c/a4b52c59539ba2c73e45aa20ce97ac3a.jpg')
]

for name, url in mappings:
    print(f"Downloading image for {name}...")
    r = requests.get(url)
    if r.status_code == 200:
        courses = Course.objects.filter(course_name=name)
        for c in courses:
            c.image.save(f'law_{c.id}_new.jpg', ContentFile(r.content), save=True)
        print(f"Updated {courses.count()} courses for {name}.")
    else:
        print(f"Failed to download image for {name}.")
