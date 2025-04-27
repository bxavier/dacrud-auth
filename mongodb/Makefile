# Basic configuration
APP_NAME := dacrud
MODULE_NAME := mongo-database
CONTAINER_TOOL := podman
MONGO_IMAGE := docker.io/mongo
MONGO_PORT := 27017
MONGO_INIT_SCRIPT := ./mongo-init.js

run:
	$(CONTAINER_TOOL) run --rm --name $(APP_NAME)-$(MODULE_NAME) -p $(MONGO_PORT):27017 \
		-e MONGO_INITDB_ROOT_USERNAME=admin \
		-e MONGO_INITDB_ROOT_PASSWORD=dacrudpasswd \
		-e MONGO_INITDB_DATABASE=dacrud-development \
		-v $(MONGO_INIT_SCRIPT):/docker-entrypoint-initdb.d/mongo-init.js:ro \
		$(MONGO_IMAGE)

stop:
	$(CONTAINER_TOOL) stop $(APP_NAME)-$(MODULE_NAME)

clean:
	$(CONTAINER_TOOL) rm -f $(APP_NAME)-$(MODULE_NAME) || true
	$(CONTAINER_TOOL) volume prune -f

