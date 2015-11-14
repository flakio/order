(function(){	
	'use strict';
	
	var parse = require('co-body');
	var mysql = require('mysql');
	var settings = require('../settings');
	var wrapper = require('co-mysql');
	var uuid = require('uuid');
	
	module.exports.list = function * (next) {
		if ('GET' != this.method) return yield next;
		
		//var connection = mysql.createConnection( process.env.CONNECTION_STRING );
		var connection = wrapper(mysql.createPool(settings.mysqlConnectionString() + '/flakio?debug=true'));

		var results = yield connection.query ("SELECT * FROM `Order`");
	
		this.body = results;
	}
	
	module.exports.create = function * (next) {
		
		//Parse posted data
		var data = yield parse(this, {
			limit: '1kb'
		});
		
		// Process payment ()
		// In a real system this would involve multiple steps with some consistency checks in place
		// We may even simply capture the payment and charge it when shipping
		
		// Add a new order to MariaDB
		var connection = wrapper(mysql.createPool(settings.mysqlConnectionString() + '/flakio?debug=true'));
		yield connection.query("INSERT INTO `Order` (id, customerId, status, total, orderDate, shippingAddress) \
		 VALUES (?, ?, ?, ?, NOW(), ?)",
		 [uuid.v1(),
		 data.customerId,
		 data.status,
		 data.total,
		 data.shippingAddress]);
		 
		 this.body = '';
		
		// TODO: Send email notification to notify service
	}
	
	module.exports.getById = function * (id, next) {
		
		var connection = wrapper(mysql.createPool(settings.mysqlConnectionString() + '/flakio?debug=true'));

		//if (order.length === 0) {
		//	this.throw(404, {error:'order with id = ' + id + ' was not found'});
		//}
		this.body = 'Done!';
	}
})();
