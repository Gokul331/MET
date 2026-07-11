import os
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

ag_url = 'https://i.pinimg.com/736x/06/e7/65/06e765a03d33b72411eee6c18564e224.jpg'
ho_url = 'https://i.pinimg.com/1200x/f3/f0/30/f3f030b0522a17a5e452b0ba3af759df.jpg'

print("Downloading agriculture image...")
r_ag = requests.get(ag_url)
if r_ag.status_code == 200:
    ag_courses = Course.objects.filter(course_name__icontains='agriculture')
    for c in ag_courses:
        c.image.save(f'agri_{c.id}.jpg', ContentFile(r_ag.content), save=True)
    print(f"Updated {ag_courses.count()} agriculture courses.")
else:
    print("Failed to download agriculture image.")

print("Downloading horticulture image...")
r_ho = requests.get(ho_url)
if r_ho.status_code == 200:
    ho_courses = Course.objects.filter(course_name__icontains='horticulture')
    for c in ho_courses:
        c.image.save(f'horti_{c.id}.jpg', ContentFile(r_ho.content), save=True)
    print(f"Updated {ho_courses.count()} horticulture courses.")
else:
    print("Failed to download horticulture image.")
