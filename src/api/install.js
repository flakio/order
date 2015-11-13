(function(){	
	'use strict';
	
	var mysql = require('mysql');
	var wrapper = require('co-mysql');
	var process = require('process');
	var thunkify = require('thunkify');
	var fs = require('fs');
	var read = thunkify(fs.readFile);
	
	module.exports.install = function * () {
		
		//var connection = mysql.createConnection( process.env.MYSQL_ENDPOINT);
		//mysql://root:my-secret-pw@192.168.99.100
		
		// Create the Flak.io Order service database
		var connection = wrapper(mysql.createConnection(process.env.MYSQL_ENDPOINT + '/mysql?debug=true'));
		var results = yield connection.query ("CREATE DATABASE IF NOT EXISTS flakio");
		
		connection = wrapper(mysql.createConnection(process.env.MYSQL_ENDPOINT + '/flakio?debug=true'));

		// Create the orders table
		var statement = yield read('./install/order.table.sql', 'utf-8');
		results = yield connection.query (statement);
		
		// Create the orders table
		statement = yield read('./install/orderDetails.table.sql', 'utf-8');
		results = yield connection.query (statement);
		
		this.body = "rock on";
	}
})();
