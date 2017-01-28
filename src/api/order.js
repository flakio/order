'use strict';

var parse = require('co-body');
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
            this.body = { error: err.message };
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
            this.body = { error: err.message };
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
            this.body = { error: err.message };
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
            this.body = { error: err.message };
        }
    }
}
