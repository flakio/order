'use strict';

var process = require('process');

//mysql://root:my-secret-pw@192.168.99.100
module.exports.mysqlConnectionString = function () {
	return process.env.MYSQL_ENDPOINT;
}
