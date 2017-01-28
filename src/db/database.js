var mysql = require('mysql2/promise');
var settings = require('../settings');
var thunkify = require('thunkify');
var fs = require('fs');
var read = thunkify(fs.readFile);

module.exports = {
  query: function* (query, params) {

    var con = yield mysql.createConnection(settings.mysqlConnectionString() + '/flakio?debug=true');

    rows = yield con.query(query, params);

    yield con.end();

    return rows;
  },

  install: function* () {

    // Create the Flak.io Order service database
    var con = yield mysql.createConnection(settings.mysqlConnectionString() + '/mysql?debug=true');

    var results = yield con.query("CREATE DATABASE IF NOT EXISTS flakio");

    yield con.end();

    con = yield mysql.createConnection(settings.mysqlConnectionString() + '/flakio?debug=true');

    // Create the orders table
    var statement = yield read('./install/order.table.sql', 'utf-8');
    results = yield con.query(statement);

    // Create the orders table
    statement = yield read('./install/orderDetails.table.sql', 'utf-8');
    results = yield con.query(statement);

    yield con.end();
  }
}
