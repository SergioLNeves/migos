.PHONY: help build up down logs restart clean ps start start-all stop-all

help: ## Lista todos os comandos disponíveis
	@echo "Comandos disponíveis:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build da imagem Docker do backend
	@echo "Building backend Docker image..."
	docker-compose build

up: ## Iniciar backend (Docker)
	@echo "Starting backend..."
	docker-compose up -d
	@echo ""
	@echo "Backend started: http://localhost:8080"

down: ## Parar backend (Docker)
	@echo "Stopping backend..."
	docker-compose down

logs: ## Ver logs do backend
	docker-compose logs -f

restart: ## Reiniciar backend
	docker-compose restart

ps: ## Mostrar status do backend
	docker-compose ps

clean: ## Remover containers e volumes (CUIDADO: remove dados do SQLite)
	@echo "WARNING: This will remove containers and volumes (including SQLite data)!"
	@echo "Press Ctrl+C to cancel or wait 5 seconds to continue..."
	@sleep 5
	docker-compose down -v
	@echo "Cleanup completed!"

rebuild: ## Rebuild e reiniciar backend
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

expo: ## Iniciar frontend Expo (local)
	@echo "Starting Expo dev server..."
	cd frontend && pnpm start

start-all: ## Iniciar backend (Docker) + frontend (local) juntos
	@echo "Starting backend..."
	docker-compose up -d
	@echo "Backend started: http://localhost:8080"
	@echo ""
	@echo "Starting Expo dev server..."
	cd frontend && pnpm start

stop-all: ## Parar backend + frontend
	@echo "Stopping backend..."
	docker-compose down
	@echo "Done! (Expo: use Ctrl+C no terminal onde está rodando)"
