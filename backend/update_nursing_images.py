import os
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

mappings = [
    ('M.Sc - Nursing', 'https://i.pinimg.com/1200x/d8/ad/02/d8ad027e10dad04c438ce05c9c8e9196.jpg'),
    ('Post Basic B.Sc - Nursing', 'https://i.pinimg.com/1200x/a0/fc/3c/a0fc3c60d00cb6db135b8d6b8d71277a.jpg'),
    ('GNM - General Nursing and Midwifery', 'https://i.pinimg.com/1200x/a8/21/5c/a8215cd04d5a9cce559de53f16207bd0.jpg')
]

for name, url in mappings:
    print(f"Downloading image for {name}...")
    r = requests.get(url)
    if r.status_code == 200:
        courses = Course.objects.filter(course_name=name)
        for c in courses:
            c.image.save(f'nursing_{c.id}.jpg', ContentFile(r.content), save=True)
        print(f"Updated {courses.count()} courses for {name}.")
    else:
        print(f"Failed to download image for {name}.")
