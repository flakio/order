var mysql = require('mysql2-bluebird')();
var settings = require('../settings');

mysql.configure(settings.mysqlConnectionString() + '/flakio?debug=true');

module.exports = {
  query: function *(query, params){

    return  yield mysql.query(query, params);
  }
}
