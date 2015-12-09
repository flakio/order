'use strict';

var parse = require('co-body');

var ordersService = new (require('../orders/orders-services'))();

module.exports = {
	/*
	* list()
	* retrieve a list of orders
	*/
	list : function * () {
		try {
      this.body = yield ordersService.list();
			this.status = 200;
		}
		catch(err) {
			this.status = 500;
			this.body = { error: err };
		}
	},
	
	/*
	* create()
	* create a new order from data posted
	*/
	create : function * () {

    try{
      //Parse posted data
      var data = JSON.parse(yield parse(this, {
        limit: '1kb'
      }));

      yield ordersService.create(data);
      this.status = 200;
    }catch (err){
      this.status = 500;
      this.body = { error: err };
    }
	},
	
	/*
	* getById(id)
	* retrieve order details using the order id passed
	*/
	getById : function * () {

    try {

      this.body = yield ordersService.getById(this.params.id);
      this.status = 200;
    }
    catch(err) {
      this.status = 500;
      this.body = { error: err };
    }
	}
}
