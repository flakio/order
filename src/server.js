'use strict';

var order = require('./api/order');
var compress = require('koa-compress');
var logger = require('koa-logger');
var route = require('koa-router')();
var koa = require('koa');
var app = module.exports = koa();

app.use(logger());

route.get('/order/', order.list);
route.post('/order/', order.create);

// We need to work something else out for this one
route.get('/order/install/', order.install);

route.get('/order/:id', order.getById);

app.use(route.routes());

app.use(compress());

if (!module.parent) {
	app.listen(80);
	console.log('listening on port 80');
}
