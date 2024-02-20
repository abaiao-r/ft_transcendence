def recursive_delete_secrets(start_path):
    paths = set()

    def recursive_lookup(path):
        try:
            response = settings.VAULT_CLIENT.secrets.kv.v2.list_secrets(
                path=path,
                mount_point=settings.VAULT_MOUNTPOINT
            )
        except hvac.exceptions.InvalidPath:
            paths.add(path)
            return

        for key in response['data']['keys']:
            new_path = os.path.join(path, key)
            paths.add(new_path)
            recursive_lookup(new_path)

    recursive_lookup(start_path)

    for path in paths:
        delete_secret(path)