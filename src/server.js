(function(){	
	'use strict';
	
	var order = require('./api/order');
	var compress = require('koa-compress');
	var logger = require('koa-logger');
	var route = require('koa-route');
	var koa = require('koa');
	var app = module.exports = koa();
	
	app.use(logger());
	
	app.use(route.get('/order/', order.list));
	app.use(route.post('/order/', order.create));
	app.use(route.get('/order/:id', order.getById));

	app.use(compress());
	
	if (!module.parent) {
		app.listen(9001);
		console.log('listening on port 9001');
	}
})();
