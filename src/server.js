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

	//TODO: move this to a seperate setup command (it's here for simplicity right now)
	require('./install').install();
	
	app.use(compress());
	
	if (!module.parent) {
		app.listen(9000);
		console.log('listening on port 9000');
	}
})();
