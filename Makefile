all:
	rm -rf backend-user/dist
	rm -rf backend-ping-pong/dist
	rm -rf backend-blockchain/dist
	docker compose down
	docker volume prune -f
	docker compose up --build
