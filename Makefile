.PHONY: up down

all:
	make up

up:
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