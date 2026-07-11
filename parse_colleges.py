import json

with open('colleges.txt', 'r') as f:
    data = json.load(f)

for c in data:
    print(f"College: {c.get('college_name')} ({c.get('short_name')})")
    
