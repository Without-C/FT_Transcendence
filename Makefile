.PHONY: up down

all:
	make up

up:
	rm -rf backend-user/dist
	rm -rf backend-ping-pong/dist
	rm -rf backend-blockchain/dist
	docker compose down
	docker volume prune -f
	docker compose up --build

down:
	docker compose down --rmi all

clean : 
	docker compose down --rmi all

fclean : 
	make clean
	docker volume prune -f

re :
	make fclean
	make all
