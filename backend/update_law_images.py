import os
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

mappings = [
    ('B.B.A. LLB (Hons.)', 'https://i.pinimg.com/1200x/fe/fc/94/fefc9413009418fe6b53599f5c9dac11.jpg'),
    ('B.Com. LLB (Hons.)', 'https://i.pinimg.com/1200x/da/46/50/da46500e98ccd993283ee671ece770c4.jpg')
]

for name, url in mappings:
    print(f"Downloading image for {name}...")
    r = requests.get(url)
    if r.status_code == 200:
        courses = Course.objects.filter(course_name=name)
        for c in courses:
            c.image.save(f'law_{c.id}.jpg', ContentFile(r.content), save=True)
        print(f"Updated {courses.count()} courses for {name}.")
    else:
        print(f"Failed to download image for {name}.")
