(function(){	
	'use strict';
	
	var order = require('./api/order');
	var parse = require('co-body');
	var mysql = require('mysql');
	var process = require('process');
	
	module.exports.install = function() {
		
		//var connection = mysql.createConnection( process.env.MYSQL_ENDPOINT);
		//mysql://root:my-secret-pw@192.168.99.100
		
		var connection = mysql.createConnection(process.env.MYSQL_ENDPOINT + '/mysql?debug=true&timezone=-0700');

		// Create the Flak.io Order service database
		var results = connection.query ("CREATE DATABASE IF NOT EXISTS flakio");
		
		connection = mysql.createConnection(process.env.MYSQL_ENDPOINT + '/flakio?debug=true&timezone=-0700');

		// Create the orders table
		results = connection.query ("CREATE TABLE IF NOT EXISTS `Order` ( \
			`id` VARCHAR(45) NOT NULL , \
			`name` VARCHAR(255) NOT NULL , \
			`total` DECIMAL(13,4) NULL , \
			PRIMARY KEY (`id`))");
		
	}
})();
