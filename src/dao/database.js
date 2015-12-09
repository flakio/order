var mysql = require('mysql2-bluebird')();
var settings = require('../settings');

var Database = function(){

}

Database.prototype = {
  query: function *(query, params){
    mysql.configure(settings.mysqlConnectionString() + '/flakio?debug=true');

    return  yield mysql.query(query, params);
  }
}

module.exports = Database;
