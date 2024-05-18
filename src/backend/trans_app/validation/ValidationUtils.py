from rest_framework import serializers

class ValidationUtils():
    @staticmethod
    def getErrors(serializer):
        errors = [{'field': field, 'message': ' '.join(error_messages)} for field, error_messages in serializer.errors.items()]
        return errors
