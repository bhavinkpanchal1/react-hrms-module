from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.recruitment.models import Candidate, Interview, Job, Offer


class Command(BaseCommand):
    help = "Create idempotent demo data for the HRMS frontend"

    def handle(self, *args, **options):
        job, _ = Job.objects.update_or_create(
            title="Frontend Developer",
            department="Engineering",
            defaults={
                "description": "Build the HRMS user interface with React and TypeScript.",
                "experience": 2,
                "location": "Vadodara, Gujarat",
                "openings": 2,
                "status": Job.Status.OPEN,
                "closing_date": date.today() + timedelta(days=60),
            },
        )
        candidate, _ = Candidate.objects.update_or_create(
            job=job,
            email="ravi@example.com",
            defaults={
                "first_name": "Ravi",
                "last_name": "Sharma",
                "phone": "9876543210",
                "source": "LinkedIn",
                "address_line1": "Alkapuri",
                "country_id": 1,
                "state_id": 101,
                "city_id": 1001,
                "pincode": "390007",
                "current_position": "Frontend Developer",
                "current_company": "TechNova Solutions",
                "current_salary": 850000,
                "expected_salary": 1100000,
                "notice_period": 30,
                "total_experience": 4,
                "highest_education": "B.E. Computer Engineering",
                "institution": "GTU",
                "graduation_year": 2020,
                "skills": ["React", "TypeScript", "Tailwind CSS"],
                "certifications": ["AWS Cloud Practitioner"],
                "status": Candidate.Status.INTERVIEW,
            },
        )
        Interview.objects.get_or_create(
            candidate=candidate,
            round=Interview.Round.TECHNICAL,
            defaults={
                "interviewer": "Bhavin Panchal",
                "scheduled_at": timezone.now() + timedelta(days=7),
                "duration_minutes": 60,
                "mode": Interview.Mode.ONLINE,
            },
        )
        Offer.objects.get_or_create(
            candidate=candidate,
            defaults={
                "offered_salary": 1100000,
                "joining_date": date.today() + timedelta(days=45),
                "expires_at": date.today() + timedelta(days=14),
                "status": Offer.Status.PENDING,
            },
        )
        self.stdout.write(self.style.SUCCESS("Demo HRMS data is ready."))
