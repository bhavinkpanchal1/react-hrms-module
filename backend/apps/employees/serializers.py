from django.db import transaction
from rest_framework import serializers

from apps.recruitment.models import Candidate, Offer

from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    source_candidate_id = serializers.PrimaryKeyRelatedField(
        source="source_candidate",
        queryset=Candidate.objects.all(),
        required=False,
        allow_null=True,
    )
    source_offer_id = serializers.PrimaryKeyRelatedField(
        source="source_offer",
        queryset=Offer.objects.select_related("candidate").all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Employee
        fields = [
            "id",
            "employee_code",
            "first_name",
            "last_name",
            "email",
            "phone",
            "dob",
            "gender",
            "marital_status",
            "address_line1",
            "address_line2",
            "country_id",
            "state_id",
            "city_id",
            "pincode",
            "department",
            "designation",
            "reporting_manager",
            "work_location",
            "employment_type",
            "date_of_joining",
            "annual_salary",
            "source_candidate_id",
            "source_offer_id",
            "created_at",
        ]
        read_only_fields = ["id", "employee_code", "created_at"]

    def validate(self, attrs):
        candidate = attrs.get("source_candidate", getattr(self.instance, "source_candidate", None))
        offer = attrs.get("source_offer", getattr(self.instance, "source_offer", None))
        if offer and not candidate:
            candidate = offer.candidate
            attrs["source_candidate"] = candidate
        if candidate and offer and offer.candidate_id != candidate.id:
            raise serializers.ValidationError(
                {"source_offer_id": "The offer does not belong to the selected candidate."}
            )
        if offer and offer.status != Offer.Status.ACCEPTED:
            raise serializers.ValidationError(
                {"source_offer_id": "Only an accepted offer can be used for onboarding."}
            )
        if candidate and candidate.converted_to_employee and not self.instance:
            raise serializers.ValidationError(
                {"source_candidate_id": "This candidate has already been converted to an employee."}
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        employee = super().create(validated_data)
        if employee.source_candidate:
            candidate = employee.source_candidate
            candidate.status = Candidate.Status.HIRED
            candidate.converted_to_employee = True
            candidate.save(update_fields=["status", "converted_to_employee", "updated_at"])
        return employee
