from rest_framework import serializers

class InsightSerializer(serializers.Serializer):
    study = serializers.CharField(max_length=255)
    hobby = serializers.CharField(max_length=255)
    job = serializers.CharField(max_length=255)
    skill = serializers.CharField(max_length=255)
