COMPOSE_FILE := ./src/docker-compose.yml

DOCKER := alias docker='docker --host=$HOME/.docker/run/docker.sock'


all:
	@echo "Usage: make [up|down|clean|clean-re|up-volumes|stop|fclean|delete_folders|images_clean|restart|volume_clean|container_clean|prune|connect|re-up]"

build:
	docker compose -f $(COMPOSE_FILE) build

buildup:
	docker compose -f $(COMPOSE_FILE) up --build

up:
	docker compose -f $(COMPOSE_FILE) up

down:
	docker compose -f $(COMPOSE_FILE) down

down-volumes:
	docker compose -f $(COMPOSE_FILE) down -v

clean: images_clean
	docker compose -f $(COMPOSE_FILE) down -v --remove-orphans

stop:
	docker compose -f $(COMPOSE_FILE) stop

test_backend:
	docker exec -it backend python manage.py test

connect_backend:
	docker exec -it backend python manage.py shell

fclean:
	- docker rm -f $$(docker ps -qa)
	- docker rmi -f $$(docker images -qa)
	- docker volume rm $$(docker volume ls -q)
	- docker network rm transcendence-network 2>/dev/null

images_clean:
	docker rmi $$(docker images -q)

unseal_vault:
	docker exec -it vault vault operator unseal <unseal_key>

restart: down up

volume_clean:
	docker volume rm $$(docker volume ls -qf dangling=true)

container_clean:
	docker rm $$(docker ps -qa --no-trunc --filter "status=exited")

prune:
	docker system prune -a

connect:
	docker exec -it mariadb mysql -u root -p

re: fclean buildup

.PHONY: up down clean clean-re up-volumes stop fclean delete_folders images_clean restart volume_clean container_clean prune connect_mariadb re