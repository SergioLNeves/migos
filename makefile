.PHONY: run
run:
	pnpm start --clear

.PHONY: lint
lint:
	pnpm run lint

.PHONY: format
format:
	pnpm run format
