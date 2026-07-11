import json

# Data mapping for the 7 colleges
data_map = {
    "DSCET": {
        "slug": "dscet-chennai",
        "location_city": "Chennai",
        "location_state": "Tamil Nadu",
        "university_affiliation": "Anna University",
        "college_type": "affiliated",
        "accreditation": "NAAC 'A' Grade, AICTE Approved",
        "established": 2001,
        "rating": 4.2,
        "description": "Dhanalakshmi Srinivasan College of Engineering and Technology (DSCET) is located in Mamallapuram, Chennai. It offers various undergraduate and postgraduate courses in engineering and technology.",
        "phone": "044-27442844",
        "email": "dscet@yahoo.co.in",
        "website": "http://www.dscet.ac.in",
        "address": "East Coast Road, Mamallapuram, Chennai - 603104",
        "facilities": ["Library", "Hostel", "Transport", "Cafeteria", "Sports"],
        "why_choose_us": "We provide excellent placement opportunities and a state-of-the-art campus."
    },
    "DSCE": {
        "slug": "dsce-coimbatore",
        "location_city": "Coimbatore",
        "location_state": "Tamil Nadu",
        "university_affiliation": "Anna University",
        "college_type": "autonomous",
        "accreditation": "NAAC A+ Grade, NBA, AICTE Approved",
        "established": 2008,
        "rating": 4.5,
        "description": "Dhanalakshmi Srinivasan College of Engineering (DSCE) is an autonomous institution located in Coimbatore. It is known for its excellent infrastructure and academic records.",
        "phone": "0422-2935353",
        "email": "dscecbe@dsce.ac.in",
        "website": "https://dsce.ac.in/",
        "address": "NH-47, Palakkad Main Road, Navakkarai Post, Coimbatore - 641 105, Tamil Nadu",
        "facilities": ["Smart Classrooms", "Labs", "Hostel", "Transport", "Sports Complex"],
        "why_choose_us": "Autonomous status with industry-oriented curriculum and high placement rates."
    },
    "DSGI": {
        "slug": "dsgi",
        "location_city": "Perambalur",
        "location_state": "Tamil Nadu",
        "university_affiliation": "Anna University",
        "college_type": "affiliated",
        "accreditation": "AICTE Approved",
        "established": 2001,
        "rating": 4.0,
        "description": "Dhanalakshmi Srinivasan Group of Institutions offers a diverse range of technical and management programs.",
        "phone": "04328-220444",
        "email": "info@dsgroups.org",
        "website": "https://www.dsgroups.org",
        "address": "Thuraiyur Road, Perambalur - 621212",
        "facilities": ["Library", "Hostel", "Transport", "Gym", "Auditorium"],
        "why_choose_us": "A hub of excellence in multidisciplinary education."
    },
    "DSMCH": {
        "slug": "dsmch-perambalur",
        "location_city": "Perambalur",
        "location_state": "Tamil Nadu",
        "university_affiliation": "The Tamil Nadu Dr. M.G.R. Medical University",
        "college_type": "private",
        "accreditation": "NMC Approved",
        "established": 2011,
        "rating": 4.4,
        "description": "Dhanalakshmi Srinivasan Medical College and Hospital provides top-notch medical education and healthcare services.",
        "phone": "04328-220555",
        "email": "dean@dsmch.org",
        "website": "https://www.dsmch.org",
        "address": "Siruvachur, Perambalur - 621113",
        "facilities": ["Hospital", "Library", "Hostel", "Laboratories", "Blood Bank"],
        "why_choose_us": "World-class healthcare training and a 1200-bed multi-specialty hospital."
    },
    "DSUC": {
        "slug": "dsuc-chennai",
        "location_city": "Chennai",
        "location_state": "Tamil Nadu",
        "university_affiliation": "Private University",
        "college_type": "private",
        "accreditation": "UGC Recognized",
        "established": 2021,
        "rating": 4.3,
        "description": "Dhanalakshmi Srinivasan University, Chennai Campus.",
        "phone": "044-22222222",
        "email": "admission@dsuniversity.ac.in",
        "website": "https://www.dsuniversity.ac.in",
        "address": "Chennai, Tamil Nadu",
        "facilities": ["Modern Classrooms", "Wi-Fi Campus", "Hostel", "Library"],
        "why_choose_us": "Innovative learning methods and excellent infrastructure."
    },
    "DSUP": {
        "slug": "dsup-perambalur",
        "location_city": "Perambalur",
        "location_state": "Tamil Nadu",
        "university_affiliation": "Private University",
        "college_type": "private",
        "accreditation": "UGC Recognized",
        "established": 2021,
        "rating": 4.3,
        "description": "Dhanalakshmi Srinivasan University, Perambalur Campus.",
        "phone": "04328-220333",
        "email": "admission@dsuniversity.ac.in",
        "website": "https://www.dsuniversity.ac.in",
        "address": "Perambalur, Tamil Nadu",
        "facilities": ["Modern Classrooms", "Wi-Fi Campus", "Hostel", "Library"],
        "why_choose_us": "A vibrant academic environment."
    },
    "DSUT": {
        "slug": "dsut-trichy",
        "location_city": "Tiruchirappalli",
        "location_state": "Tamil Nadu",
        "university_affiliation": "Private University",
        "college_type": "private",
        "accreditation": "UGC Recognized",
        "established": 2021,
        "rating": 4.6,
        "description": "Dhanalakshmi Srinivasan University, Trichy Campus is a state private university offering multi-disciplinary programs.",
        "phone": "0431-2555555",
        "email": "info@dsuniversity.ac.in",
        "website": "https://www.dsuniversity.ac.in",
        "address": "Samayapuram, Tiruchirappalli - 621112",
        "facilities": ["Advanced Labs", "Auditorium", "Sports Facilities", "Hostel", "Cafeteria"],
        "why_choose_us": "Empowering students with knowledge, skills, and values."
    }
}

with open('colleges.txt', 'r') as f:
    colleges = json.load(f)

for c in colleges:
    short_name = c.get('short_name')
    if short_name in data_map:
        info = data_map[short_name]
        for k, v in info.items():
            c[k] = v

with open('colleges.txt', 'w') as f:
    json.dump(colleges, f, indent=2)

print("colleges.txt updated successfully.")
