from datetime import date

from django.db import transaction
from rest_framework import serializers

from .models import Candidate, Interview, Job, Offer


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "department",
            "description",
            "experience",
            "location",
            "openings",
            "status",
            "created_at",
            "closing_date",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Description must be at least 10 characters.")
        return value.strip()


class CandidateSerializer(serializers.ModelSerializer):
    jobId = serializers.PrimaryKeyRelatedField(source="job", queryset=Job.objects.all())
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = Candidate
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "jobId",
            "job_title",
            "source",
            "notes",
            "dob",
            "gender",
            "marital_status",
            "address_line1",
            "address_line2",
            "country_id",
            "state_id",
            "city_id",
            "pincode",
            "current_position",
            "current_company",
            "current_salary",
            "expected_salary",
            "notice_period",
            "total_experience",
            "highest_education",
            "institution",
            "graduation_year",
            "resume_url",
            "referenced_by",
            "linkedin_url",
            "github_url",
            "portfolio_url",
            "skills",
            "certifications",
            "status",
            "converted_to_employee",
            "applied_at",
        ]
        read_only_fields = ["id", "job_title", "converted_to_employee", "applied_at"]

    def validate_dob(self, value):
        if value:
            today = date.today()
            age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
            if age < 18:
                raise serializers.ValidationError("Candidate must be at least 18 years old.")
        return value

    def validate_skills(self, value):
        if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
            raise serializers.ValidationError("Skills must be a list of strings.")
        return value

    def validate_certifications(self, value):
        if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
            raise serializers.ValidationError("Certifications must be a list of strings.")
        return value


class InterviewSerializer(serializers.ModelSerializer):
    candidateId = serializers.PrimaryKeyRelatedField(
        source="candidate", queryset=Candidate.objects.select_related("job").all()
    )
    candidate_name = serializers.SerializerMethodField()
    job_title = serializers.CharField(source="candidate.job.title", read_only=True)

    class Meta:
        model = Interview
        fields = [
            "id",
            "candidateId",
            "round",
            "candidate_name",
            "job_title",
            "interviewer",
            "scheduled_at",
            "duration_minutes",
            "mode",
            "status",
            "result",
            "feedback",
        ]
        read_only_fields = ["id", "candidate_name", "job_title"]

    def get_candidate_name(self, obj) -> str:
        return f"{obj.candidate.first_name} {obj.candidate.last_name}"

    def validate(self, attrs):
        status = attrs.get("status", getattr(self.instance, "status", Interview.Status.SCHEDULED))
        result = attrs.get("result", getattr(self.instance, "result", Interview.Result.PENDING))
        feedback = attrs.get("feedback", getattr(self.instance, "feedback", ""))
        if status == Interview.Status.COMPLETED and not feedback.strip():
            raise serializers.ValidationError({"feedback": "Feedback is required for a completed interview."})
        if status != Interview.Status.COMPLETED and result != Interview.Result.PENDING:
            raise serializers.ValidationError({"result": "Only completed interviews can have a pass or fail result."})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        interview = super().create(validated_data)
        candidate = interview.candidate
        if candidate.status not in {Candidate.Status.HIRED, Candidate.Status.REJECTED}:
            candidate.status = Candidate.Status.INTERVIEW
            candidate.save(update_fields=["status", "updated_at"])
        return interview


class OfferSerializer(serializers.ModelSerializer):
    candidateId = serializers.PrimaryKeyRelatedField(
        source="candidate", queryset=Candidate.objects.select_related("job").all()
    )
    candidate_name = serializers.SerializerMethodField()
    job_title = serializers.CharField(source="candidate.job.title", read_only=True)

    class Meta:
        model = Offer
        fields = [
            "id",
            "candidateId",
            "candidate_name",
            "job_title",
            "offered_salary",
            "joining_date",
            "status",
            "issued_at",
            "expires_at",
            "notes",
        ]
        read_only_fields = ["id", "candidate_name", "job_title", "issued_at"]

    def get_candidate_name(self, obj) -> str:
        return f"{obj.candidate.first_name} {obj.candidate.last_name}"

    def validate(self, attrs):
        joining_date = attrs.get("joining_date", getattr(self.instance, "joining_date", None))
        expires_at = attrs.get("expires_at", getattr(self.instance, "expires_at", None))
        if joining_date and expires_at and expires_at > joining_date:
            raise serializers.ValidationError(
                {"expires_at": "Offer expiry cannot be after the joining date."}
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        offer = super().create(validated_data)
        candidate = offer.candidate
        if candidate.status not in {Candidate.Status.HIRED, Candidate.Status.REJECTED}:
            candidate.status = (
                Candidate.Status.ONBOARDING
                if offer.status == Offer.Status.ACCEPTED
                else Candidate.Status.OFFER
            )
            candidate.save(update_fields=["status", "updated_at"])
        return offer

    @transaction.atomic
    def update(self, instance, validated_data):
        offer = super().update(instance, validated_data)
        if "status" in validated_data:
            candidate = offer.candidate
            if offer.status == Offer.Status.ACCEPTED:
                candidate.status = Candidate.Status.ONBOARDING
            elif offer.status == Offer.Status.REJECTED and candidate.status == Candidate.Status.OFFER:
                candidate.status = Candidate.Status.REJECTED
            candidate.save(update_fields=["status", "updated_at"])
        return offer


class PipelineStageSerializer(serializers.Serializer):
    status = serializers.CharField()
    label = serializers.CharField()
    count = serializers.IntegerField()
    candidates = CandidateSerializer(many=True)


class PipelineSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    stages = PipelineStageSerializer(many=True)
