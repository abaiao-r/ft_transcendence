from channels.consumer import SyncConsumer, AsyncConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync, sync_to_async
from django.contrib.auth.models import User
from trans_app.models import UserSetting
from django.core.exceptions import ObjectDoesNotExist


import json
from rich.console import Console


console = Console(style='bold green')
