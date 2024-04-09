COMPOSE_FILE := ./src/docker-compose.yml

all:
	@echo "Usage: make [up|down|clean|clean-re|up-volumes|stop|fclean|delete_folders|images_clean|restart|volume_clean|container_clean|prune|connect|re-up]"

build:
	docker compose -f $(COMPOSE_FILE) build

buildup:
	docker compose -f $(COMPOSE_FILE) up --build

up:
	docker compose -f $(COMPOSE_FILE) up

down:
	- docker compose -f $(COMPOSE_FILE) down

down-volumes:
	docker compose -f $(COMPOSE_FILE) down -v

clean: images_clean
	docker compose -f $(COMPOSE_FILE) down -v --remove-orphans

stop:
	docker compose -f $(COMPOSE_FILE) stop

test_backend:
	docker exec -it backend python manage.py test

fclean:
	- docker stop $$(docker ps -qa)  # Stop all containers
	- docker rm $$(docker ps -qa) # Remove all containers
	- docker rmi -f $$(docker images -qa) # Remove all images
	- docker volume rm $$(docker volume ls -q) # Remove all volumes
	- docker network rm $$(docker network ls -q) 2>/dev/null # Remove all networks

images_clean:
	docker rmi $$(docker images -q)

unseal_vault:
	docker exec -it vault vault operator unseal <unseal_key>

# Unseal vault and login
# docker exec -it vault vault operator unseal <unseal_key>
# docker exec -it vault vault login <root_token>

# Write secret
#docker exec -it vault vault kv put secret/my-app my-secret-key=my-secret-value

# Get Secret
#docker exec -it vault vault kv get secret/my-app



restart: down up

volume_clean:
	docker volume rm $$(docker volume ls -qf dangling=true)

container_clean:
	docker rm $$(docker ps -qa --no-trunc --filter "status=exited")

prune:
	docker system prune -a

connect:
	docker exec -it mariadb mysql -u root -p

re-up: fclean buildup

.PHONY: up down clean clean-re up-volumes stop fclean delete_folders images_clean restart volume_clean container_clean prune connect_mariadb re-up