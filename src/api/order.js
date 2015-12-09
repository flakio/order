'use strict';

var parse = require('co-body');
var mysql = require('mysql2-bluebird')();
var settings = require('settings');
var uuid = require('uuid');

module.exports = {

	/*
	* list()
	* retrieve a list of orders
	*/
	list : function * () {
		
		try {

			mysql.configure(settings.mysqlConnectionString() + '/flakio?debug=true');
	
			var results = yield mysql.query (
				"SELECT ord.id, ord.email, ord.status, ord.total. ord.orderDate, ( \
				SELECT COUNT(*) FROM `OrderDetail` detail WHERE detail.orderId = ord.id \
				) AS \"lineItems\" \
				FROM `Order` ord");
		
			this.status = 200;
			this.body = results[0];

		}
		catch(err) {
			this.status = 500;
			this.body = { error: err };
		}
	},
	
	/*
	* create()
	* create a new order from data posted
	*/
	create : function * () {
		
		//Parse posted data
		var data = yield parse(this, {
			limit: '1kb'
		});
		
		// Process payment ()
		// In a real system this would involve multiple steps with some consistency checks in place
		// We may even simply capture the payment and charge it when shipping
		
		// Add a new order to mysql
		mysql.configure(settings.mysqlConnectionString() + '/flakio?debug=true');
		yield mysql.query("INSERT INTO `Order` \
		(id, customerId, email, status, total, orderDate, shippingAddress) \
		VALUES (?, ?, ?, ?, ?, NOW(), ?)",
		[uuid.v1(),
		data.customerId,
		data.email,
		data.status,
		data.total,
		data.shippingAddress]);
		
		// TODO: Insert order items
		
		this.status = 200;
		
		// TODO: Send email notification to notify service
	},
	
	/*
	* getById(id)
	* retrieve order details using the order id passed
	*/
	getById : function * (id) {
		
		mysql.configure(settings.mysqlConnectionString() + '/flakio?debug=true');

		//if (order.length === 0) {
		//	this.throw(404, {error:'order with id = ' + id + ' was not found'});
		//}
		this.body = 'Done!';
	}
}
