import os
import django
from django.core.management import call_command

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "met_project.settings")
django.setup()

from colleges.models import College

def load_initial_data():
    if College.objects.exists():
        print("Database already has data (Colleges found). Skipping datadump import.")
    else:
        if os.path.exists('datadump.json'):
            print("Loading data from datadump.json...")
            call_command('loaddata', 'datadump.json')
            print("Data loaded successfully.")
        else:
            print("datadump.json not found.")

if __name__ == "__main__":
    load_initial_data()
