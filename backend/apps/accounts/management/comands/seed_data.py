

"""
Management command to seed the database with sample data.
Run with: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.experiences.models import Category, Experience, ExperienceImage
from apps.bookings.models import Booking
from apps.reviews.models import Review
import datetime

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with sample Explore Kigezi data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('🌍 Seeding Explore Kigezi database...'))
        self.create_categories()
        self.create_hosts()
        self.create_experiences()
        self.create_tourists()
        self.create_bookings_and_reviews()
        self.stdout.write(self.style.SUCCESS('✅ Database seeded successfully!'))

    def create_categories(self):
        categories = [
            {'name': 'Traditional Dance', 'slug': 'dance', 'icon': '💃',
             'description': 'Experience vibrant Kiga dance traditions passed down through generations'},
            {'name': 'Traditional Food', 'slug': 'food', 'icon': '🍲',
             'description': 'Cook and taste authentic Bakiga cuisine in a family homestead'},
            {'name': 'Crafts & Artisan', 'slug': 'crafts', 'icon': '🎨',
             'description': 'Learn traditional Kiga basket weaving, pottery and crafts'},
            {'name': 'Village Visits', 'slug': 'village', 'icon': '🏘️',
             'description': 'Immerse yourself in authentic Bakiga village life'},
            {'name': 'Storytelling', 'slug': 'storytelling', 'icon': '📖',
             'description': 'Hear ancient Kiga legends, proverbs and oral traditions'},
            {'name': 'Music & Instruments', 'slug': 'music', 'icon': '🎶',
             'description': 'Learn traditional Kiga instruments like the engoma drum'},
        ]
        for cat in categories:
            Category.objects.get_or_create(slug=cat['slug'], defaults=cat)
        self.stdout.write('  ✓ Categories created')

    def create_hosts(self):
        hosts_data = [
            {
                'email': 'amara@explorekigezi.com',
                'first_name': 'Amara', 'last_name': 'Byamukama',
                'phone': '0772123456',
                'bio': 'Master Kiga dancer and cultural custodian with over 20 years of experience performing and teaching Ekizino dance. Born and raised in Kabale, I am passionate about sharing our rich Bakiga heritage with the world.',
                'location': 'Kabale Town',
                'profile_photo': 'https://i.pravatar.cc/150?img=47',
                'is_verified': True,
            },
            {
                'email': 'grace@explorekigezi.com',
                'first_name': 'Grace', 'last_name': 'Komuhangi',
                'phone': '0701234567',
                'bio': 'Traditional Bakiga chef and food historian. I have spent 15 years documenting and teaching authentic Kiga recipes. My grandmother taught me every dish, and now I share these treasures with visitors.',
                'location': 'Rubanda District',
                'profile_photo': 'https://i.pravatar.cc/150?img=25',
                'is_verified': True,
            },
            {
                'email': 'robert@explorekigezi.com',
                'first_name': 'Robert', 'last_name': 'Tukahirwa',
                'phone': '0782345678',
                'bio': 'Master craftsman and cultural guide specialising in traditional Kiga weaving, pottery and village experiences. I lead immersive cultural tours across Kisoro and Kabale districts.',
                'location': 'Kisoro District',
                'profile_photo': 'https://i.pravatar.cc/150?img=52',
                'is_verified': True,
            },
        ]
        self.hosts = []
        for h in hosts_data:
            user, created = User.objects.get_or_create(
                email=h['email'],
                defaults={
                    'username': h['email'].split('@')[0],
                    'role': 'host',
                    **{k: v for k, v in h.items() if k != 'email'},
                }
            )
            if created:
                user.set_password('host123456')
                user.save()
            self.hosts.append(user)
        self.stdout.write('  ✓ Hosts created')

    def create_experiences(self):
        categories = {c.slug: c for c in Category.objects.all()}
        experiences_data = [
            {
                'host': self.hosts[0],
                'category': categories['dance'],
                'title': 'Kiga Dance & Drumming Workshop',
                'description': 'Immerse yourself in the energetic world of Kiga traditional dance. Learn the iconic Ekizino dance performed during celebrations and ceremonies, accompanied by live drumming on the engoma. Our master dancer Amara has been performing since age 7 and will guide you through the steps with infectious joy at his family homestead overlooking the rolling Kabale hills. No experience needed — just an open heart!',
                'location': 'Kabale Town, near Kabale Golf Course',
                'district': 'kabale',
                'duration_hours': 3.0,
                'price_per_person': 120000,
                'min_group_size': 1,
                'max_group_size': 15,
                'meeting_point': 'Kabale Golf Course main gate — look for the orange Explore Kigezi flag',
                'whats_included': ['Welcome drink (local millet beer or juice)', 'Dance instruction (2 hours)', 'Live drumming session', 'Cultural storytelling', 'Group photo in traditional attire'],
                'what_to_bring': ['Comfortable clothes you can move in', 'Closed shoes', 'Camera', 'Small cash for tips (optional)'],
                'available_days': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
                'cover_image': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
                'is_approved': True, 'is_featured': True,
                'average_rating': 4.9, 'total_reviews': 23, 'total_bookings': 47,
            },
            {
                'host': self.hosts[1],
                'category': categories['food'],
                'title': 'Bakiga Traditional Cooking Experience',
                'description': 'Step into Grace\'s family kitchen and discover the soul of Bakiga cuisine. You will cook authentic dishes including roasted groundnuts, sweet potato stew, millet bread (kalo), and the famous Kigezi bean soup. Grace will share the stories and traditions behind each dish — food is culture, and every meal tells a story. End with a feast together around the fire.',
                'location': 'Rubanda Town, Rubanda District',
                'district': 'rubanda',
                'duration_hours': 4.0,
                'price_per_person': 95000,
                'min_group_size': 1,
                'max_group_size': 10,
                'meeting_point': 'Rubanda Market main entrance — Grace will meet you wearing a blue kitenge',
                'whats_included': ['All cooking ingredients', 'Full traditional meal', 'Recipe booklet to take home', 'Cooking apron', 'Local juice welcome drink'],
                'what_to_bring': ['Appetite!', 'Camera', 'Notebook (if you want to take extra notes)'],
                'available_days': ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                'cover_image': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
                'is_approved': True, 'is_featured': True,
                'average_rating': 4.8, 'total_reviews': 17, 'total_bookings': 31,
            },
            {
                'host': self.hosts[2],
                'category': categories['crafts'],
                'title': 'Traditional Basket Weaving & Kiga Crafts',
                'description': 'Learn the ancient art of Kiga basket weaving from master craftsman Robert. Using locally sourced papyrus and natural dyes, you will create your own small basket to take home as a unique souvenir. Robert will also demonstrate traditional pottery and show you his collection of handcrafted Kiga artefacts. A wonderful hands-on experience connecting you to centuries of tradition.',
                'location': 'Kisoro Town Centre',
                'district': 'kisoro',
                'duration_hours': 3.0,
                'price_per_person': 85000,
                'min_group_size': 1,
                'max_group_size': 12,
                'meeting_point': 'Kisoro Town Hall front steps',
                'whats_included': ['All weaving materials', 'Your finished basket to keep', 'Tea and snacks', 'Cultural history talk', 'Certificate of participation'],
                'what_to_bring': ['Patience (weaving takes focus!)', 'Camera'],
                'available_days': ['monday', 'wednesday', 'friday', 'saturday'],
                'cover_image': 'https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?w=800&q=80',
                'is_approved': True, 'is_featured': True,
                'average_rating': 4.7, 'total_reviews': 14, 'total_bookings': 28,
            },
            {
                'host': self.hosts[2],
                'category': categories['village'],
                'title': 'Authentic Kiga Village Homestead Tour',
                'description': 'Walk through a living Bakiga village and experience daily life as it has been for generations. Visit a traditional homestead, meet the elders, learn about Kiga architecture, agricultural practices, and the social structure of the community. Robert leads this intimate tour with deep respect for the community and genuine storytelling that brings history to life.',
                'location': 'Nyakabande Village, Kisoro',
                'district': 'kisoro',
                'duration_hours': 4.0,
                'price_per_person': 110000,
                'min_group_size': 2,
                'max_group_size': 10,
                'meeting_point': 'Kisoro District offices parking lot',
                'whats_included': ['Guided village walk', 'Elder storytelling session', 'Traditional homestead visit', 'Local lunch with a family', 'Cultural souvenir'],
                'what_to_bring': ['Respectful clothing (cover shoulders and knees)', 'Camera', 'Small gift for the host family (optional)'],
                'available_days': ['monday', 'tuesday', 'thursday', 'saturday', 'sunday'],
                'cover_image': 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80',
                'is_approved': True,
                'average_rating': 4.9, 'total_reviews': 11, 'total_bookings': 19,
            },
            {
                'host': self.hosts[0],
                'category': categories['storytelling'],
                'title': 'Kiga Legends & Oral Traditions Evening',
                'description': 'As the sun sets over the Kabale hills, gather around the fire for an evening of ancient Kiga storytelling. Amara will share legends of the Bakiga kings, the origin of Lake Bunyonyi, tales of the Gorilla guardians, and the wisdom encoded in traditional Kiga proverbs. This deeply moving experience is perfect for curious minds and culture lovers.',
                'location': 'Amara\'s Homestead, Kabale Hills',
                'district': 'kabale',
                'duration_hours': 2.0,
                'price_per_person': 70000,
                'min_group_size': 1,
                'max_group_size': 20,
                'meeting_point': 'White Hill Hotel Kabale — shuttle provided',
                'whats_included': ['Fireside storytelling session', 'Traditional snacks', 'Roasted groundnuts', 'Local herbal tea', 'Story booklet'],
                'what_to_bring': ['Light jacket (evenings are cool in Kabale)', 'Open mind'],
                'available_days': ['tuesday', 'thursday', 'friday', 'saturday'],
                'cover_image': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
                'is_approved': True,
                'average_rating': 4.8, 'total_reviews': 9, 'total_bookings': 15,
            },
            {
                'host': self.hosts[0],
                'category': categories['music'],
                'title': 'Engoma Drum & Kiga Music Workshop',
                'description': 'Learn to play the engoma — the sacred drum at the heart of Kiga culture. Every rhythm tells a story: there are rhythms for celebration, for harvest, for welcome, and for healing. Amara will teach you basic rhythms, introduce you to other traditional Kiga instruments, and together you will perform a short piece by the end of the session. Pure joy!',
                'location': 'Kabale Cultural Centre',
                'district': 'kabale',
                'duration_hours': 2.0,
                'price_per_person': 90000,
                'min_group_size': 1,
                'max_group_size': 10,
                'meeting_point': 'Kabale Cultural Centre main door — opposite the post office',
                'whats_included': ['Drum instruction', 'All instruments provided', 'Cultural music history talk', 'Performance at end of session', 'Drumming certificate'],
                'what_to_bring': ['Enthusiasm!', 'Camera to record your performance'],
                'available_days': ['monday', 'wednesday', 'friday', 'saturday'],
                'cover_image': 'https://images.unsplash.com/photo-1545579133-99bb5ad189be?w=800&q=80',
                'is_approved': True,
                'average_rating': 4.6, 'total_reviews': 8, 'total_bookings': 12,
            },
            {
                'host': self.hosts[1],
                'category': categories['food'],
                'title': 'Kigezi Farm-to-Table Harvest Experience',
                'description': 'Begin at dawn on Grace\'s family farm in the green hills of Rubanda. Harvest fresh vegetables, sweet potatoes and beans with the family, then transform your harvest into a beautiful feast using traditional Kiga methods. Learn about the agricultural traditions of the Bakiga and how food connects community, seasons, and spirit.',
                'location': 'Grace\'s Family Farm, Rubanda Hills',
                'district': 'rubanda',
                'duration_hours': 6.0,
                'price_per_person': 150000,
                'min_group_size': 2,
                'max_group_size': 8,
                'meeting_point': 'Rubanda Town Stage — 7:00 AM sharp',
                'whats_included': ['Farm tour and harvest activity', 'All meals (breakfast + lunch)', 'Cooking session', 'Farm produce gift pack', 'Transport from Rubanda Town'],
                'what_to_bring': ['Old clothes (farm work!)', 'Gumboots or sturdy shoes', 'Sun protection'],
                'available_days': ['wednesday', 'saturday', 'sunday'],
                'cover_image': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
                'is_approved': True,
                'average_rating': 5.0, 'total_reviews': 6, 'total_bookings': 10,
            },
            {
                'host': self.hosts[2],
                'category': categories['village'],
                'title': 'Virunga Foothills Community Walk',
                'description': 'Trek through the dramatic foothills of the Virunga volcanoes on this guided community walk through Kisoro villages. Stop at traditional homesteads, greet community elders, see the terraced hillside farms that define the Kigezi landscape, and learn about the unique position of the Bakiga at the crossroads of Uganda, Rwanda and DR Congo.',
                'location': 'Kisoro, Virunga Foothills',
                'district': 'kisoro',
                'duration_hours': 4.0,
                'price_per_person': 130000,
                'min_group_size': 2,
                'max_group_size': 12,
                'meeting_point': 'Travellers Rest Hotel Kisoro — 8:00 AM',
                'whats_included': ['Expert cultural guide', 'Community donations included', 'Packed lunch', 'Bottled water', 'Walking stick'],
                'what_to_bring': ['Hiking shoes', 'Rain jacket', 'Sunscreen', 'Camera'],
                'available_days': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                'cover_image': 'https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800&q=80',
                'is_approved': True,
                'average_rating': 4.7, 'total_reviews': 13, 'total_bookings': 22,
            },
        ]

        self.experiences = []
        for exp_data in experiences_data:
            exp, created = Experience.objects.get_or_create(
                title=exp_data['title'],
                defaults=exp_data,
            )
            self.experiences.append(exp)
        self.stdout.write('  ✓ Experiences created')

    def create_tourists(self):
        tourists_data = [
            {
                'email': 'sarah@example.com',
                'first_name': 'Sarah', 'last_name': 'Johnson',
                'phone': '+447700900123',
                'nationality': 'British',
                'profile_photo': 'https://i.pravatar.cc/150?img=5',
            },
            {
                'email': 'james@example.com',
                'first_name': 'James', 'last_name': 'Omondi',
                'phone': '+254712345678',
                'nationality': 'Kenyan',
                'profile_photo': 'https://i.pravatar.cc/150?img=33',
            },
        ]
        self.tourists = []
        for t in tourists_data:
            user, created = User.objects.get_or_create(
                email=t['email'],
                defaults={
                    'username': t['email'].split('@')[0],
                    'role': 'tourist',
                    **{k: v for k, v in t.items() if k != 'email'},
                }
            )
            if created:
                user.set_password('tourist123456')
                user.save()
            self.tourists.append(user)
        self.stdout.write('  ✓ Tourists created')

    def create_bookings_and_reviews(self):
        today = datetime.date.today()

        bookings_data = [
            {
                'tourist': self.tourists[0],
                'experience': self.experiences[0],
                'booking_date': today + datetime.timedelta(days=7),
                'group_size': 2,
                'tourist_name': 'Sarah Johnson',
                'tourist_email': 'sarah@example.com',
                'tourist_phone': '+447700900123',
                'tourist_nationality': 'British',
                'total_price': 240000,
                'status': 'confirmed',
                'payment_status': 'paid',
                'payment_method': 'card',
            },
            {
                'tourist': self.tourists[1],
                'experience': self.experiences[1],
                'booking_date': today - datetime.timedelta(days=10),
                'group_size': 3,
                'tourist_name': 'James Omondi',
                'tourist_email': 'james@example.com',
                'tourist_phone': '+254712345678',
                'tourist_nationality': 'Kenyan',
                'total_price': 285000,
                'status': 'completed',
                'payment_status': 'paid',
                'payment_method': 'mtn',
            },
            {
                'tourist': self.tourists[0],
                'experience': self.experiences[2],
                'booking_date': today - datetime.timedelta(days=20),
                'group_size': 2,
                'tourist_name': 'Sarah Johnson',
                'tourist_email': 'sarah@example.com',
                'tourist_phone': '+447700900123',
                'tourist_nationality': 'British',
                'total_price': 170000,
                'status': 'completed',
                'payment_status': 'paid',
                'payment_method': 'card',
            },
        ]

        self.bookings = []
        for b_data in bookings_data:
            existing = Booking.objects.filter(
                tourist=b_data['tourist'],
                experience=b_data['experience'],
            ).first()
            if not existing:
                b = Booking(**b_data)
                b.save()
                self.bookings.append(b)
            else:
                self.bookings.append(existing)

        # Reviews for completed bookings
        reviews_data = [
            {
                'booking': self.bookings[1],
                'tourist': self.tourists[1],
                'experience': self.experiences[1],
                'overall_rating': 5,
                'authenticity_rating': 5,
                'value_rating': 5,
                'host_friendliness_rating': 5,
                'comment': 'Absolutely incredible experience! Grace is a wonderful host and the food was the most authentic Ugandan meal I have ever had. Her stories about each dish made it even more special. I will never forget this experience.',
                'would_recommend': True,
            },
            {
                'booking': self.bookings[2],
                'tourist': self.tourists[0],
                'experience': self.experiences[2],
                'overall_rating': 5,
                'authenticity_rating': 5,
                'value_rating': 4,
                'host_friendliness_rating': 5,
                'comment': 'Robert is a true master of his craft. I learned so much about Kiga weaving traditions and even made my own small basket! It is now my most treasured souvenir. Highly recommend for anyone visiting Kisoro.',
                'would_recommend': True,
            },
        ]

        for r_data in reviews_data:
            if not Review.objects.filter(booking=r_data['booking']).exists():
                Review.objects.create(**r_data)

        self.stdout.write('  ✓ Bookings & Reviews created')