# Administrative commands for local development. Run `make` or `make help` to list them.

BACKEND := cd backend &&
FRONTEND := cd frontend &&
PRISMA := $(BACKEND) npx prisma
PRISMA_CONFIG := --config src/prisma.config.ts
DB_NAME := schematophylax
API_URL := http://localhost:8000
SERVICE ?= backend

.DEFAULT_GOAL := help
.PHONY: help install build typecheck clean start \
	frontend-install frontend-dev frontend-build \
	contract-emit db-init db-plan db-update db-shell \
	up down stop-backend docker-build ps logs lint-openapi

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

## --- Both apps ---------------------------------------------------------------

install: ## Install backend and frontend npm dependencies
	$(BACKEND) npm install
	$(FRONTEND) npm install

build: ## Build the backend (dist/) and the frontend (frontend/dist/)
	$(BACKEND) npm run build
	$(FRONTEND) npm run build

typecheck: ## Type-check the backend and the frontend without emitting
	$(BACKEND) npx tsc --noEmit
	$(FRONTEND) npx tsc --noEmit

clean: ## Remove build output
	rm -rf backend/dist frontend/dist

## --- Backend -----------------------------------------------------------------

start: ## Build and run the API server locally on port 8000
	$(BACKEND) npm run build && npm start

## --- Frontend ----------------------------------------------------------------

frontend-install: ## Install frontend npm dependencies
	$(FRONTEND) npm install

frontend-dev: ## Run the Vite dev server (proxies /api to localhost:8000)
	$(FRONTEND) npm run dev

frontend-build: ## Type-check and build the frontend
	$(FRONTEND) npm run build

## --- Prisma ------------------------------------------------------------------

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

## --- Docker ------------------------------------------------------------------

up: ## Build and start db, backend and frontend in the background
	docker compose up -d --build

down: ## Stop and remove the containers (keeps the database volume)
	docker compose down

stop-backend: ## Stop only the backend container, freeing port 8000 for `make start`
	docker compose stop backend

docker-build: ## Build the backend and frontend images
	docker compose build

ps: ## Show container status
	docker compose ps

logs: ## Follow a service's logs (SERVICE=backend by default)
	docker compose logs -f $(SERVICE)

## --- API ---------------------------------------------------------------------

lint-openapi: ## Lint the OpenAPI spec served by a running server
	npx -y @redocly/cli@latest lint $(API_URL)/openapi.json
