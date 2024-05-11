from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.utils.translation import gettext as _

class CustomPasswordValidator:
    """
    Validate whether the password meets the required format.
    """
    def __init__(self):
        self.regex_validator = RegexValidator(
            regex=r'(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).*',
            message=_("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")
        )

    def validate(self, password, user=None):
        self.regex_validator(password)

    def get_help_text(self):
        return _(
            "Your password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
        )
