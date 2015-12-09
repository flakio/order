'use strict';

var order = require('./api/order');
var install = require('./api/install');
var compress = require('koa-compress');
var logger = require('koa-logger');
var route = require('koa-router')();
var koa = require('koa');
var app = module.exports = koa();

app.use(logger());

route.get('/order/', order.list);
route.post('/order/', order.create);
route.get('/order/:id', order.getById);
route.get('/install/', install.install);

app.use(route.routes());

app.use(compress());

if (!module.parent) {
	app.listen(9000);
	console.log('listening on port 9000');
}
