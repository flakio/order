var database = new (require('../db/database'))();
var uuid = require('uuid');

//TEMP
var mysql = require('mysql2-bluebird')();
var settings = require('../settings');
var thunkify = require('thunkify');
var fs = require('fs');
var read = thunkify(fs.readFile);

var OrderSummary = function (id, email, status, total, orderDate, shippingAddress, lineItems) {
    this.id = id;
    this.email = email;
    this.status = status;
    this.total = total;
    this.orderDate = orderDate;
    this.shippingAddress = shippingAddress;
    this.lineItems = lineItems;
};

var Order = function (id, email, status, total, orderDate, shippingAddress, items) {
    this.id = id;
    this.email = email;
    this.status = status;
    this.total = total;
    this.orderDate = orderDate;
    this.shippingAddress = shippingAddress;
    this.items = items;
}

var OrderItem = function (productId, productName, price, quantity) {
    this.productId = productId;
    this.productName = productName;
    this.price = price;
    this.quantity = quantity;
}

function OrderData() {
}

OrderData.prototype = {
    list: function* () {
        var results = yield database.query(
            "SELECT ord.id, ord.email, ord.status, ord.total, ord.orderDate, ord.shippingAddress, ( \
      SELECT COUNT(*) FROM `OrderDetail` detail WHERE detail.orderId = ord.id \
      ) AS \"lineItems\" \
      FROM `Order` ord");

        var list = results[0].map(function (model) {
            return new OrderSummary(model.id, model.email, model.status, model.total, model.orderDate,
                JSON.parse(model.shippingAddress), model.lineItems);
        });

        return list;
    },

    getById: function* (id) {

        var orderModel = null;
        var itemsModel = null;

        var selects = [
            function* () {
                var result = yield database.query('SELECT ord.email, ord.status, ord.total, ord.orderDate, ord.shippingAddress ' +
                    ' from `Order` ord where ord.id = ?', id);
                orderModel = result[0].length ? result[0][0] : null
            },
            function* () {
                var result = yield database.query('SELECT productId, productName, price, quantity, total FROM `OrderDetail` where orderId = ?', id);
                itemsModel = result[0];
            }
        ];

        yield selects;

        if (!orderModel) {
            return null;
        }

        var items = itemsModel.map(function (model) {
            return new OrderItem(model.productId, model.productName, model.price, model.quantity);
        });

        return new Order(id, orderModel.email, orderModel.status, orderModel.total, orderModel.orderDate,
            JSON.parse(orderModel.shippingAddress), items);

    },

    create: function* (data) {
        // Process payment ()
        // In a real system this would involve multiple steps with some consistency checks in place
        // We may even simply capture the payment and charge it when shipping

        // Add a new order to mysql

        var orderId = uuid.v1();

        yield database.query("INSERT INTO `Order` \
		(id, customerId, email, status, total, orderDate, shippingAddress) \
		VALUES (?, ?, ?, ?, ?, NOW(), ?)",
            [orderId,
                data.customerId,
                data.email,
                0,
                data.total,
                JSON.stringify(data.shippingAddress)]);

        if (!data.items) {
            return;
        }

        var inserts = [];
        for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            inserts.push(database.query('INSERT INTO `OrderDetail`\
        (`orderId`,`productId`,`productName`,`price`,`quantity`,`total`) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.productId, item.productName, item.price, item.quantity, item.price * item.quantity]));
        }

        yield inserts;
    },
    
    install: function* () {
        
        // Create the Flak.io Order service database
        mysql.configure(settings.mysqlConnectionString() + '/mysql?debug=true');
        var results = yield mysql.query("CREATE DATABASE IF NOT EXISTS flakio");

        mysql.configure(settings.mysqlConnectionString() + '/flakio?debug=true');

        // Create the orders table
        var statement = yield read('./install/order.table.sql', 'utf-8');
        results = yield mysql.query(statement);
        
        // Create the orders table
        statement = yield read('./install/orderDetails.table.sql', 'utf-8');
        results = yield mysql.query(statement);
    }
}

module.exports = OrderData;
