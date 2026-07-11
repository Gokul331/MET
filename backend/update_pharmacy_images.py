import os
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

mappings = [
    ('D.Pharm - Diploma in Pharmacy', 'https://i.pinimg.com/1200x/e8/2b/13/e82b13c778d6176543ed5a73afdfcc56.jpg'),
    ('M.Pharm - Pharmaceutical Analysis', 'https://i.pinimg.com/736x/25/cf/ae/25cfaee51c2ee3b155dfdf3a9a0eae3e.jpg'),
    ('M.Pharm - Pharmaceuticals', 'https://i.pinimg.com/236x/2e/49/c7/2e49c761e91e16ccbd3afc85e757f3df.jpg'),
    ('M.Pharm - Pharmacognosy', 'https://i.pinimg.com/1200x/e9/3a/75/e93a7511b5ca88a9ef157b59fd981b4d.jpg'),
    ('Pharm.D', 'https://i.pinimg.com/236x/91/2c/3d/912c3d8e35c13a0f3205bf099f3e534b.jpg')
]

for name, url in mappings:
    print(f"Downloading image for {name}...")
    r = requests.get(url)
    if r.status_code == 200:
        courses = Course.objects.filter(course_name=name)
        for c in courses:
            c.image.save(f'pharm_{c.id}.jpg', ContentFile(r.content), save=True)
        print(f"Updated {courses.count()} courses for {name}.")
    else:
        print(f"Failed to download image for {name}.")

