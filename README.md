# Order Service
Payment processing service

## Getting Started
Use docker-compose to run the service `docker-compose --project-name orderservice --x-networking up`. The `--x-networking` flag enables the new networking features allowing the application to talk to the mysql database. The `--project-name` flag sets the project name, by default compose will use the parent folder name.

##API

| URL | METHOD | DESCRIPTION |
| --- | --- | --- |
| /order | POST | Place a new order (checkout) |
| /order | GET | Get all orders |
| /order/:id | GET | Get order by id |
| /install | GET | Setup sample database |

Sample document to post to the /create api
```json
{
    "customerId": "asdf",
    "total": 22.40,
    "orderDate": "01/01/2016",
    "shippingAddress": {
        "line1": "2020 Industrial Blvd",
        "city": "Mill Creek",
        "state": "WA",
        "zip": "98012"
    },
    "items": [
        {
            "productId": "1",
            "productName": "Hello",
            "price": 20.12,
            "quantity": 2
        }
    ]
}
```

Deploy to mesos
```
curl https://raw.githubusercontent.com/flakio/order/master/marathon.json | curl -qs -XPOST localhost/marathon/v2/groups -d@- -H "Content-Type: application/json"
```
