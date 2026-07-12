import os
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

mappings = [
    ('M.E - Power Electronics and Drives', 'https://i.pinimg.com/1200x/8e/d5/58/8ed558051409ff67b9e328acbd63faf5.jpg'),
    ('M.E - Computer Science and Engineering', 'https://i.pinimg.com/736x/84/48/49/8448495442c3645538dd52a55853930a.jpg'),
    ('M.E - Communication Systems', 'https://i.pinimg.com/736x/97/17/f6/9717f6f5029f4b5f197a78ee9e90dce3.jpg'),
    ('M.E - CAD/CAM', 'https://i.pinimg.com/736x/be/99/00/be99009e053ba3d1b7a6f684771c83f5.jpg'),
]

for name, url in mappings:
    print(f"Downloading image for {name}...")
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            courses = Course.objects.filter(course_name=name)
            for c in courses:
                c.image.save(f'me_{c.id}.jpg', ContentFile(r.content), save=True)
            print(f"Updated {courses.count()} courses for {name}.")
        else:
            print(f"Failed to download image for {name}. Status: {r.status_code}")
    except Exception as e:
        print(f"Error downloading image for {name}: {e}")
