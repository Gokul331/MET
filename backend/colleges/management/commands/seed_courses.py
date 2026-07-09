import os
import json
from django.core.management.base import BaseCommand
from django.conf import settings
from colleges.models import College, Course


class Command(BaseCommand):
    help = 'Clears the Course table and re-seeds it from courses.txt matching the new schema.'

    def handle(self, *args, **options):
        courses_file_path = os.path.join(settings.BASE_DIR, '..', 'courses.txt')

        if not os.path.exists(courses_file_path):
            self.stdout.write(self.style.ERROR(
                f'courses.txt not found at: {courses_file_path}'
            ))
            return

        # Load JSON data
        try:
            with open(courses_file_path, 'r', encoding='utf-8') as f:
                courses_data = json.load(f)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to parse courses.txt: {e}'))
            return

        # ── Step 1: Clear existing courses ──────────────────────────────
        count_before = Course.objects.count()
        Course.objects.all().delete()
        self.stdout.write(self.style.WARNING(
            f'Deleted {count_before} existing course record(s).'
        ))

        # ── Step 2: Build a map of local College PKs ──────────────────────
        college_map = {c.id: c for c in College.objects.all()}

        if not college_map:
            self.stdout.write(self.style.WARNING(
                'Warning: No colleges found in the database. '
                'Courses will be created without college links.'
            ))

        # ── Step 3: Import courses ────────────────────────────────────────
        created = 0
        skipped = 0

        for item in courses_data:
            course_id = item.get('course_id')
            if not course_id:
                self.stdout.write(self.style.WARNING('Skipping course with missing course_id'))
                skipped += 1
                continue

            course_name = item.get('course_name') or ''
            course_code = item.get('course_code') or ''
            category = item.get('category') or ''
            degree_type = (item.get('degree_type') or 'ug').lower()
            is_active = item.get('is_active', True)

            # Resolve college
            col_id = item.get('college')
            college_instance = college_map.get(col_id) if col_id else None

            try:
                Course.objects.create(
                    id=course_id,
                    course_code=course_code,
                    course_name=course_name,
                    category=category,
                    degree_type=degree_type,
                    college=college_instance,
                    is_active=is_active
                )
                self.stdout.write(
                    f'  [OK] [{course_id}] {course_name} ({degree_type.upper()}) -> College ID: {col_id}'
                )
                created += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f'  Failed to create course id={course_id} "{course_name}": {e}'
                ))
                skipped += 1

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'Done! Successfully seeded {created} course(s), skipped {skipped}.'
        ))
