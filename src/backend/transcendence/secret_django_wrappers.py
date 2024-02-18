from django.conf import settings

def upsert_secret(path, value):
    settings.VAULT_CLIENT.secrets.kv.v2.create_or_update_secret(
        path=path,
        secret=value,
        mount_point=settings.VAULT_MOUNTPOINT
    )


def read_secret(path):
    return settings.VAULT_CLIENT.secrets.kv.v2.read_secret_version(
        path,
        mount_point=settings.VAULT_MOUNTPOINT
    )


def delete_secret(path):
    settings.VAULT_CLIENT.secrets.kv.v2.delete_metadata_and_all_versions(
        path=path,
        mount_point=settings.VAULT_MOUNTPOINT
    )


def list_secrets(path):
    return settings.VAULT_CLIENT.secrets.kv.v2.list_secrets(
        path=path,
        mount_point=settings.VAULT_MOUNTPOINT
    )