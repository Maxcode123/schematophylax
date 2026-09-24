# Administrative commands for local development. Run `make` or `make help` to list them.

PRISMA := npx prisma
PRISMA_CONFIG := --config src/prisma.config.ts
DB_NAME := schematophylax
API_URL := http://localhost:8000

.DEFAULT_GOAL := help
.PHONY: help install build typecheck start clean \
	contract-emit db-init db-plan db-update db-shell \
	up down stop-backend docker-build ps logs lint-openapi

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

## --- Node -------------------------------------------------------------------

install: ## Install npm dependencies
	npm install

build: ## Compile TypeScript to dist/
	npm run build

typecheck: ## Type-check without emitting
	npx tsc --noEmit

start: build ## Build and run the API server locally on port 8000
	npm start

clean: ## Remove build output
	rm -rf dist

## --- Prisma -----------------------------------------------------------------

contract-emit: ## Regenerate contract.json and contract.d.ts from contract.ts
	$(PRISMA) contract emit $(PRISMA_CONFIG)

db-init: ## Create the tables in an empty database
	$(PRISMA) db init $(PRISMA_CONFIG)

db-plan: ## Preview the schema changes db-update would apply
	$(PRISMA) db update $(PRISMA_CONFIG) --dry-run

db-update: ## Apply contract changes to the database
	$(PRISMA) db update $(PRISMA_CONFIG)

db-shell: ## Open psql in the compose database
	docker compose exec db psql -U postgres -d $(DB_NAME)

## --- Docker -----------------------------------------------------------------

up: ## Build and start db and backend in the background
	docker compose up -d --build

down: ## Stop and remove the containers (keeps the database volume)
	docker compose down

stop-backend: ## Stop only the backend container, freeing port 8000 for `make start`
	docker compose stop backend

docker-build: ## Build the backend image
	docker compose build backend

ps: ## Show container status
	docker compose ps

logs: ## Follow backend logs
	docker compose logs -f backend

## --- API --------------------------------------------------------------------

lint-openapi: ## Lint the OpenAPI spec served by a running server
	npx -y @redocly/cli@latest lint $(API_URL)/openapi.json
