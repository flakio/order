var database = require('../db/database');
var uuid = require('uuid');

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

module.exports = {
    list: function* () {
        let results = yield database.query(
            "SELECT ord.id, ord.email, ord.status, ord.total, ord.orderDate, ord.shippingAddress, ( \
            SELECT COUNT(*) FROM `OrderDetail` detail WHERE detail.orderId = ord.id \
            ) AS \"lineItems\" \
            FROM `Order` ord");

        let list = results[0].map(function (model) {
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
                let result = yield database.query('SELECT ord.email, ord.status, ord.total, ord.orderDate, ord.shippingAddress ' +
                    ' from `Order` ord where ord.id = ?', id);
                orderModel = result[0].length ? result[0][0] : null
            },
            function* () {
                let result = yield database.query('SELECT productId, productName, price, quantity, total FROM `OrderDetail` where orderId = ?', id);
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
            let item = data.items[i];
            inserts.push(database.query(
                'INSERT INTO `OrderDetail`(`orderId`,`productId`,`productName`,`price`,`quantity`,`total`) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.productId, item.productName, item.price, item.quantity, item.price * item.quantity]));
        }

        yield Promise.all(inserts);
    },

    install: function* () {
        yield database.install();
    }
}
