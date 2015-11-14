(function(){	
	'use strict';
	
	var process = require('process');
	
	module.exports.mysqlConnectionString = function () {
		return process.env.MYSQL_ENDPOINT;
	}
})();
