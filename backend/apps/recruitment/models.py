from django.core.validators import MinValueValidator
from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Job(TimestampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        OPEN = "open", "Open"
        CLOSED = "closed", "Closed"
        ON_HOLD = "on_hold", "On hold"

    title = models.CharField(max_length=100)
    department = models.CharField(max_length=100, db_index=True)
    description = models.TextField()
    experience = models.PositiveSmallIntegerField(default=0)
    location = models.CharField(max_length=150)
    openings = models.PositiveSmallIntegerField(default=1, validators=[MinValueValidator(1)])
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True)
    closing_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Candidate(TimestampedModel):
    class Status(models.TextChoices):
        APPLIED = "applied", "Applied"
        SCREENING = "screening", "Screening"
        INTERVIEW = "interview", "Interview"
        OFFER = "offer", "Offer"
        ONBOARDING = "onboarding", "Onboarding"
        HIRED = "hired", "Hired"
        REJECTED = "rejected", "Rejected"

    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        OTHER = "other", "Other"

    class MaritalStatus(models.TextChoices):
        SINGLE = "single", "Single"
        MARRIED = "married", "Married"

    job = models.ForeignKey(Job, on_delete=models.PROTECT, related_name="candidates")
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    source = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=True)
    marital_status = models.CharField(max_length=10, choices=MaritalStatus.choices, blank=True)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    country_id = models.PositiveIntegerField(null=True, blank=True)
    state_id = models.PositiveIntegerField(null=True, blank=True)
    city_id = models.PositiveIntegerField(null=True, blank=True)
    pincode = models.CharField(max_length=12, blank=True)
    current_position = models.CharField(max_length=150, blank=True)
    current_company = models.CharField(max_length=150, blank=True)
    current_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    expected_salary = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    notice_period = models.PositiveSmallIntegerField(null=True, blank=True, help_text="Days")
    total_experience = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    highest_education = models.CharField(max_length=200, blank=True)
    institution = models.CharField(max_length=200, blank=True)
    graduation_year = models.PositiveSmallIntegerField(null=True, blank=True)
    resume_url = models.URLField(max_length=500, null=True, blank=True)
    referenced_by = models.CharField(max_length=150, blank=True)
    linkedin_url = models.URLField(max_length=500, null=True, blank=True)
    github_url = models.URLField(max_length=500, null=True, blank=True)
    portfolio_url = models.URLField(max_length=500, null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.APPLIED, db_index=True)
    converted_to_employee = models.BooleanField(default=False)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-applied_at"]
        constraints = [
            models.UniqueConstraint(fields=["job", "email"], name="unique_candidate_email_per_job")
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Interview(TimestampedModel):
    class Round(models.TextChoices):
        HR = "hr_round", "HR round"
        TECHNICAL = "technical_round", "Technical round"
        MANAGERIAL = "managerial_round", "Managerial round"

    class Mode(models.TextChoices):
        ONLINE = "online", "Online"
        IN_PERSON = "in_person", "In person"

    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Scheduled"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"
        NO_SHOW = "no_show", "No show"

    class Result(models.TextChoices):
        PENDING = "pending", "Pending"
        PASS = "pass", "Pass"
        FAIL = "fail", "Fail"

    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="interviews")
    round = models.CharField(max_length=30, choices=Round.choices)
    interviewer = models.CharField(max_length=150)
    scheduled_at = models.DateTimeField(db_index=True)
    duration_minutes = models.PositiveSmallIntegerField(default=60, validators=[MinValueValidator(1)])
    mode = models.CharField(max_length=20, choices=Mode.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED, db_index=True)
    result = models.CharField(max_length=20, choices=Result.choices, default=Result.PENDING)
    feedback = models.TextField(blank=True)

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self):
        return f"{self.candidate} - {self.get_round_display()}"


class Offer(TimestampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"
        EXPIRED = "expired", "Expired"
        WITHDRAWN = "withdrawn", "Withdrawn"

    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="offers")
    offered_salary = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(1)])
    joining_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-issued_at"]

    def __str__(self):
        return f"Offer for {self.candidate}"
