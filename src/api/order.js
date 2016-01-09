'use strict';

var parse = require('co-body');
var mysql = require('mysql2-bluebird')();
var settings = require('../settings');
var thunkify = require('thunkify');
var fs = require('fs');
var read = thunkify(fs.readFile);

var orderData = require('../db/order-data');

module.exports = {

	//retrieve a list of orders
    list: function* () {
        try {
            this.body = yield orderData.list();
            this.status = 200;
        }
        catch (err) {
            this.status = 500;
            this.body = { error: err };
        }
    },

	//create a new order from data posted
    create: function* () {

        try {
            //Parse posted data
            var data = yield parse.json(this, {
                limit: '1kb'
            });

            yield orderData.create(data);
            
            // TODO: Send email notification to notify service
            
            this.status = 200;
        } catch (err) {
            this.status = 500;
            this.body = { error: err };
        }
    },
	
	//retrieve order details using the order id passed
    getById: function* () {

        try {

            this.body = yield orderData.getById(this.params.id);
            this.status = 200;
        }
        catch (err) {
            this.status = 500;
            this.body = { error: err };
        }
    },

	//deploy database schema and sample data
    install: function* () {

        try {
            yield orderData.install();

            this.status = 200;
            this.body = "Fantastic!  The database install completed and is ready to go.";
        }
        catch (err) {
            this.status = 500;
            this.body = { error: err };
        }
    }
}
