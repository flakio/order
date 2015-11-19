(function(){	
	'use strict';
	
	var mysql = require('mysql2-bluebird')();
	var settings = require('settings');
	var thunkify = require('thunkify');
	var fs = require('fs');
	var read = thunkify(fs.readFile);
	
	module.exports.install = function * () {
		
		//var connection = mysql.createConnection( process.env.MYSQL_ENDPOINT);
		//mysql://root:my-secret-pw@192.168.99.100
		
		try {
			// Create the Flak.io Order service database
			mysql.configure(settings.mysqlConnectionString() + '/mysql?debug=true');
			var results = yield mysql.query ("CREATE DATABASE IF NOT EXISTS flakio");

			mysql.configure(settings.mysqlConnectionString() + '/flakio?debug=true');
	
			// Create the orders table
			var statement = yield read('./install/order.table.sql', 'utf-8');
			results = yield mysql.query (statement);
			
			// Create the orders table
			statement = yield read('./install/orderDetails.table.sql', 'utf-8');
			results = yield mysql.query (statement);
			
			this.status = 200;
			this.body = "Awesome-sauce!  The database install completed and is ready to go.";
		}
		catch(err) {
			this.status = 500;
			this.body = {error: err};
		}
	}
})();
