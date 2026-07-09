import os
import json
import base64
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings
from colleges.models import College, Course

# Helper function to find base64 image in keys
def find_base64_image(item, keys):
    for key in keys:
        val = item.get(key)
        if not val:
            continue
        if isinstance(val, str) and val.startswith('data:image/'):
            return val
        if isinstance(val, list):
            for v in val:
                if isinstance(v, str) and v.startswith('data:image/'):
                    return v
    return None

# Helper to save base64 string as file to image field
def save_base64_image(field, base64_str, filename_prefix):
    if not base64_str or not base64_str.startswith('data:image/'):
        return False
    try:
        header, base64_data = base64_str.split(';base64,', 1)
        ext = header.split('/')[-1]
        # Clean extension if it contains extra parameters
        if '+' in ext:
            ext = ext.split('+')[0]
        if ';' in ext:
            ext = ext.split(';')[0]
        # Map some common formats
        if ext == 'jpeg':
            ext = 'jpg'
        filename = f"{filename_prefix}.{ext}"
        decoded_file = base64.b64decode(base64_data)
        field.save(filename, ContentFile(decoded_file), save=True)
        return True
    except Exception as e:
        print(f"Error decoding image: {e}")
        return False

# Mapping of categories for Courses to align with frontend filter values
CATEGORY_MAP = {
    'engineering': 'Engineering',
    'polytechnic': 'Engineering',
    'allied_health_science': 'Allied Health',
    'physiotherapy': 'Allied Health',
    'occupational_therapy': 'Allied Health',
    'architecture': 'Architecture',
    'arts_science': 'Arts & Science',
    'computer_applications': 'Management',
    'management': 'Management',
    'nursing': 'Nursing',
    'pharmacy': 'Pharmacy',
    'law': 'Law',
    'agriculture': 'Engineering',
    'education': 'Arts & Science',
}

# Helper to get course icon based on category/title
def get_icon(category, title):
    title_lower = title.lower()
    cat_lower = category.lower()
    if 'computer' in title_lower or 'information' in title_lower or 'software' in title_lower:
        return '💻'
    if 'engineering' in cat_lower or 'polytechnic' in cat_lower:
        return '⚙️'
    if 'agriculture' in cat_lower:
        return '🌾'
    if 'architecture' in cat_lower:
        return '🏛️'
    if 'arts' in cat_lower or 'science' in cat_lower:
        return '📖'
    if 'allied' in cat_lower or 'physio' in cat_lower or 'occupational' in cat_lower:
        return '🏥'
    if 'pharmacy' in cat_lower:
        return '💊'
    if 'law' in cat_lower:
        return '⚖️'
    if 'nursing' in cat_lower:
        return '💉'
    if 'management' in cat_lower or 'business' in cat_lower:
        return '💼'
    return '📚'


class Command(BaseCommand):
    help = 'Seeds colleges and courses from local text files (colleges.txt and courses.txt)'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data from local text files...')

        colleges_file_path = os.path.join(settings.BASE_DIR, '..', 'colleges.txt')
        courses_file_path = os.path.join(settings.BASE_DIR, '..', 'courses.txt')

        if not os.path.exists(colleges_file_path):
            self.stdout.write(self.style.ERROR(f'Colleges file not found at: {colleges_file_path}'))
            return
        
        if not os.path.exists(courses_file_path):
            self.stdout.write(self.style.ERROR(f'Courses file not found at: {courses_file_path}'))
            return

        # 1. Load Colleges Data
        try:
            with open(colleges_file_path, 'r', encoding='utf-8') as f:
                colleges_data = json.load(f)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to parse colleges.txt: {e}'))
            return

        # 2. Load Courses Data
        try:
            with open(courses_file_path, 'r', encoding='utf-8') as f:
                courses_data = json.load(f)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to parse courses.txt: {e}'))
            return

        college_map = {}  # maps original JSON college_id/id to local College instance

        # Delete existing data to avoid PK conflicts
        self.stdout.write('Clearing existing data from courses and colleges tables...')
        Course.objects.all().delete()
        College.objects.all().delete()
        self.stdout.write('Existing data deleted successfully.')

        # 3. Import Colleges
        for col_item in colleges_data:
            live_id = col_item.get('college_id') or col_item.get('id')
            short_name = col_item.get('short_name')
            college_name = col_item.get('college_name')

            # Default description, type, phone, etc.
            is_university = 'university' in college_name.lower() or short_name.lower() in ['dsut', 'dsuc', 'dsup']
            univ_affil = 'Self-Affiliated' if is_university else 'Anna University'
            col_type = 'private' if is_university else 'affiliated'
            
            # Create College with exact JSON college_id as primary key
            college = College.objects.create(
                id=live_id,
                short_name=short_name,
                college_name=college_name,
                location_city=col_item.get('location_city', ''),
                location_state=col_item.get('location_state', 'Tamil Nadu'),
                university_affiliation=univ_affil,
                college_type=col_type,
                accreditation='Approved by AICTE & UGC' if is_university else 'Approved by AICTE, NBA & NAAC A+',
                established=2001 if not is_university else 2021,
                description=f'{college_name} is a premier educational institution providing state-of-the-art facilities and a modern curriculum.',
                courses_offered=col_item.get('courses_offered_display', []),
                phone='+91 44 2744 3801' if not is_university else '+91 4328 220 300',
                email=f'info@{short_name.lower()}.edu.in',
                website='https://dsuvamshieducare.org',
                address=f"{col_item.get('location_city', '')}, {col_item.get('location_state', 'Tamil Nadu')}, India"
            )

            # Determine base64 candidates for primary and banner images
            primary_b64 = None
            if col_item.get('primary_image') and col_item.get('primary_image').startswith('data:image/'):
                primary_b64 = col_item.get('primary_image')
            else:
                primary_b64 = find_base64_image(col_item, ['college_images', 'campus_images'])

            banner_b64 = None
            if col_item.get('banner_image') and col_item.get('banner_image').startswith('data:image/'):
                banner_b64 = col_item.get('banner_image')
            else:
                # Try to find a base64 image different from primary_b64
                for key in ['campus_images', 'college_images']:
                    val = col_item.get(key)
                    if not val:
                        continue
                    if isinstance(val, str) and val.startswith('data:image/') and val != primary_b64:
                        banner_b64 = val
                        break
                    if isinstance(val, list):
                        for v in val:
                            if isinstance(v, str) and v.startswith('data:image/') and v != primary_b64:
                                banner_b64 = v
                                break
                        if banner_b64:
                            break
                
                # If still None, take any base64
                if not banner_b64:
                    banner_b64 = find_base64_image(col_item, ['campus_images', 'college_images'])

            # Save base64 images to fields if found
            if primary_b64:
                save_base64_image(college.primary_image, primary_b64, f"{short_name.lower()}_primary")
            if banner_b64:
                save_base64_image(college.banner_image, banner_b64, f"{short_name.lower()}_banner")

            college_map[live_id] = college
            self.stdout.write(f'Processed college: {short_name} (ID: {college.id})')

        # 4. Import Courses
        for course_item in courses_data:
            course_id = course_item.get('course_id') or course_item.get('id')
            course_name = course_item.get('course_name') or ''
            course_code = course_item.get('course_code') or ''
            category = course_item.get('category') or ''
            degree_type = (course_item.get('degree_type') or 'ug').lower()
            is_active = course_item.get('is_active', True)

            # Resolve college
            live_col_id = course_item.get('college')
            college_instance = college_map.get(live_col_id) if live_col_id else None

            # Create new Course record with the exact JSON course_id as primary key
            course = Course.objects.create(
                id=course_id,
                course_code=course_code,
                course_name=course_name,
                category=category,
                degree_type=degree_type,
                college=college_instance,
                is_active=is_active
            )

            self.stdout.write(f'Created course record: {course_name} (ID: {course.id})')

        # 5. Create Superuser
        from django.contrib.auth.models import User
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@met.org', 'admin123')
            self.stdout.write('Superuser admin/admin123 created.')

        self.stdout.write(self.style.SUCCESS('Successfully seeded database from local files!'))
