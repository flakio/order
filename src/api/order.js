(function(){	
	'use strict';
	
	var parse = require('co-body');
	var mysql = require('mysql');
	var process = require('process');
	var wrapper = require('co-mysql');
	
	module.exports.list = function * (next) {
		if ('GET' != this.method) return yield next;
		
		//var connection = mysql.createConnection( process.env.CONNECTION_STRING );
		var connection = wrapper(mysql.createConnection(process.env.MYSQL_ENDPOINT + '/flakio?debug=true'));

		var results = yield connection.query ("SELECT * FROM `Order`");		
	
		this.body = results;
	}
	
	module.exports.create = function * (next) {
		
		//Parse posted data
		var data = yield parse(this, {
			limit: '1kb'
		});
		
		//This is where we would call payment process or hold cc
		
		//Add a new order to MariaDB
	}
	
	module.exports.getById = function * (id, next) {
		//if (order.length === 0) {
		//	this.throw(404, {error:'order with id = ' + id + ' was not found'});
		//}
		this.body = 'Done!';
	}
})();
