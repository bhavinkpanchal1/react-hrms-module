from django.core.validators import MinValueValidator
from django.db import models


class Employee(models.Model):
    class EmploymentType(models.TextChoices):
        FULL_TIME = "full_time", "Full-time"
        PART_TIME = "part_time", "Part-time"
        CONTRACT = "contract", "Contract"
        INTERN = "intern", "Intern"

    employee_code = models.CharField(max_length=20, unique=True, null=True, blank=True, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    marital_status = models.CharField(max_length=20, blank=True)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    country_id = models.PositiveIntegerField(null=True, blank=True)
    state_id = models.PositiveIntegerField(null=True, blank=True)
    city_id = models.PositiveIntegerField(null=True, blank=True)
    pincode = models.CharField(max_length=12, blank=True)
    department = models.CharField(max_length=100, db_index=True)
    designation = models.CharField(max_length=150)
    reporting_manager = models.CharField(max_length=150, blank=True)
    work_location = models.CharField(max_length=150)
    employment_type = models.CharField(max_length=20, choices=EmploymentType.choices)
    date_of_joining = models.DateField()
    annual_salary = models.DecimalField(max_digits=14, decimal_places=2, validators=[MinValueValidator(1)])
    source_candidate = models.OneToOneField(
        "recruitment.Candidate",
        on_delete=models.PROTECT,
        related_name="employee_record",
        null=True,
        blank=True,
    )
    source_offer = models.OneToOneField(
        "recruitment.Offer",
        on_delete=models.PROTECT,
        related_name="employee_record",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.employee_code:
            self.employee_code = f"EMP-{self.pk:04d}"
            type(self).objects.filter(pk=self.pk).update(employee_code=self.employee_code)

    def __str__(self):
        return f"{self.employee_code or 'New'} - {self.first_name} {self.last_name}"
