(function(){	
	'use strict';
	
	var parse = require('co-body');
	var mysql = require('mysql');
	var process = require('process');
	var wrapper = require('co-mysql')
	
	module.exports.list = function * list(next) {
		if ('GET' != this.method) return yield next;
		
		//var connection = mysql.createConnection( process.env.CONNECTION_STRING );
		var connection = wrapper(mysql.createConnection('mysql://root:my-secret-pw@192.168.99.100/flakio?debug=true&timezone=-0700'));

		var results = yield connection.query ("SELECT * FROM `Order`");		
	
		this.body = results;
	}
	
	module.exports.create = function * create(next) {
		
		//Parse posted data
		var data = yield parse(this, {
			limit: '1kb'
		});
		
		//Process the order
		
		//Add a new order to MariaDB
	}
	
	module.exports.getById = function * getById(id, next) {
		if (book.length === 0) {
			this.throw(404, {error:'order with id = ' + id + ' was not found'});
		}
		this.body = 'Done!';
	}
})();
