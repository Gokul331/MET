import os
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'met_project.settings')
django.setup()

from colleges.models import Course

mappings = [
    ('Diploma in Electrical & Electronics Engineering', 'http://i.pinimg.com/736x/91/1e/bd/911ebd68d19586771811dbd7cd9c3c8a.jpg'),
    ('Electrical and Electronics Engineering', 'http://i.pinimg.com/736x/91/1e/bd/911ebd68d19586771811dbd7cd9c3c8a.jpg'),
    ('Electrical and Computer Engineering', 'https://i.pinimg.com/1200x/02/5a/f8/025af82baa5245cc363b219598b88b08.jpg'),
    ('Electronics and Communication Engineering', 'https://i.pinimg.com/736x/0e/b7/ca/0eb7cafc92d81777fb781044ad47344f.jpg'),
    ('Computer Science and Engineering (Cyber Security)', 'https://i.pinimg.com/1200x/52/83/26/52832607a13ba329450096e4fbbfdb9f.jpg'),
    ('Computer Science and Engineering', 'https://i.pinimg.com/736x/32/d0/74/32d0743c03e661f7d78ce29ccd449b7c.jpg'),
    ('Diploma in Computer Engineering', 'https://i.pinimg.com/736x/32/d0/74/32d0743c03e661f7d78ce29ccd449b7c.jpg'),
    ('Computer Science Engineering with IOT', 'https://i.pinimg.com/1200x/ed/ff/13/edff13992a5698d7563222f2c3660546.jpg'),
    ('Civil Engineering', 'https://i.pinimg.com/1200x/02/ce/6f/02ce6f30d6ced63d7b8444bb05cd7601.jpg'),
    ('Biomedical Engineering', 'https://i.pinimg.com/736x/0e/ec/36/0eec3677193a510d5e0804d9cb2ff8b9.jpg'),
    ('Bio Technology', 'https://i.pinimg.com/736x/eb/49/f6/eb49f6c96485e3424981909964f269de.jpg'),
    ('Artificial Intelligence and Machine Learning', 'https://i.pinimg.com/736x/5d/3e/0e/5d3e0ec0dd6cdd5a3e41d470245b0c86.jpg'),
    ('Artificial Intelligence and Data Science', 'https://i.pinimg.com/736x/53/51/4a/53514ae0f66d0c335c392d397e5f866f.jpg'),
    ('Aeronautical Engineering', 'https://i.pinimg.com/1200x/8d/03/71/8d037134a1c7f343a8a56e5441e8de7b.jpg'),
    ('Environmental Science and Technology', 'https://i.pinimg.com/736x/49/cd/22/49cd22ba60c07429fadb3ee2875df2c0.jpg'),
    ('Food Technology', 'https://i.pinimg.com/1200x/19/62/70/1962705d245e2c826d98df98574cacbb.jpg'),
    ('Information Technology', 'https://i.pinimg.com/1200x/8d/be/92/8dbe9208cb116c61cacb7ea2e7b2dc9d.jpg'),
    ('Mechanical Engineering', 'https://i.pinimg.com/736x/42/10/6b/42106b933ba8a4bc46576d14ef966233.jpg'),
    ('Diploma in Mechanical Engineering', 'https://i.pinimg.com/736x/42/10/6b/42106b933ba8a4bc46576d14ef966233.jpg'),
    ('Mechatronics Engineering', 'https://i.pinimg.com/736x/ec/42/91/ec4291114575722b4d9eda166c8458b6.jpg'),
    ('Robotics and Artificial Intelligence', 'https://i.pinimg.com/736x/1f/05/58/1f0558b5e9044faef7c4d5de63621c00.jpg')
]

for name, url in mappings:
    print(f"Downloading image for {name}...")
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            courses = Course.objects.filter(course_name=name)
            for c in courses:
                c.image.save(f'eng_{c.id}.jpg', ContentFile(r.content), save=True)
            print(f"Updated {courses.count()} courses for {name}.")
        else:
            print(f"Failed to download image for {name}. Status: {r.status_code}")
    except Exception as e:
        print(f"Error downloading image for {name}: {e}")
