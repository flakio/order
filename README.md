# Order Service
Payment processing service

API

| URL | METHOD | DESCRIPTION |
| --- | --- | --- |
| /order | POST | Place a new order (checkout) |
| /order | GET | Get all orders |
| /order/:id | GET | Get order by id |
| /install | GET | Setup sample database |

You can use docker-compose to run this service `docker-compose --project-name orderservice --x-networking up`.  the --x-networking enabled the new networking features allowing the application to talk to the mysql database.  The --project-name flag sets the project name, by default compose will use the parent folder name.
