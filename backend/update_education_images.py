import os
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

mappings = [
    ('B.P.Ed - Bachelor of Physical Education', 'http://i.pinimg.com/1200x/ff/f9/82/fff9828802db77c150c64b08b4b4efad.jpg'),
    ('B.P.E.S - Bachelor of Physical Education and Sports', 'https://i.pinimg.com/1200x/39/4a/85/394a8514c21be4c0fc80e3d2a9879019.jpg'),
    ('B.Ed - Bachelor of Education', 'https://i.pinimg.com/736x/b4/5e/2f/b45e2fb4dcf90920d1a527439afa2f96.jpg'),
    ('M.Ed - Master of Education', 'https://i.pinimg.com/736x/84/48/49/8448495442c3645538dd52a55853930a.jpg')
]

for name, url in mappings:
    print(f"Downloading image for {name}...")
    r = requests.get(url)
    if r.status_code == 200:
        courses = Course.objects.filter(course_name=name)
        for c in courses:
            c.image.save(f'edu_{c.id}.jpg', ContentFile(r.content), save=True)
        print(f"Updated {courses.count()} courses for {name}.")
    else:
        print(f"Failed to download image for {name}.")
