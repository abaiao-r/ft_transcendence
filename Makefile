COMPOSE_FILE := ./src/docker-compose.yml

all:
	@echo "Usage: make [up|down|clean|clean-re|up-volumes|stop|fclean|delete_folders|images_clean|restart|volume_clean|container_clean|prune|connect|re-up]"

build:
	sudo docker compose -f $(COMPOSE_FILE) build

buildup:
	sudo docker compose -f $(COMPOSE_FILE) up --build

up:
	sudo docker compose -f $(COMPOSE_FILE) up

down:
	- sudo docker compose -f $(COMPOSE_FILE) down
	- sudo rm ./src/backend/root_token.txt

down-volumes:
	sudo docker compose -f $(COMPOSE_FILE) down -v

clean: images_clean
	sudo docker compose -f $(COMPOSE_FILE) down -v --remove-orphans

stop:
	sudo docker compose -f $(COMPOSE_FILE) stop

test_backend:
	sudo docker exec -it backend sh
#python manage.py test


fclean:
	- sudo rm ./src/backend/root_token.txt
	- sudo docker stop $$(sudo docker ps -qa)  # Stop all containers
	- sudo docker rm $$(sudo docker ps -qa) # Remove all containers
	- sudo docker rmi -f $$(sudo docker images -qa) # Remove all images
	- sudo docker volume rm $$(sudo docker volume ls -q) # Remove all volumes
	- sudo docker network rm $$(sudo docker network ls -q) 2>/dev/null # Remove all networks

images_clean:
	sudo docker rmi $$(sudo docker images -q)

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
	sudo docker volume rm $$(sudo docker volume ls -qf dangling=true)

container_clean:
	sudo docker rm $$(sudo docker ps -qa --no-trunc --filter "status=exited")

prune:
	sudo docker system prune -a

connect:
	sudo docker exec -it mariadb mysql -u root -p

re-up: fclean buildup

.PHONY: up down clean clean-re up-volumes stop fclean delete_folders images_clean restart volume_clean container_clean prune connect_mariadb re-up