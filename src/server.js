'use strict';

var order = require('./api/order');
var install = require('./api/install');
var compress = require('koa-compress');
var logger = require('koa-logger');
var route = require('koa-route');
var koa = require('koa');
var app = module.exports = koa();

app.use(logger());

app.use(route.get('/order/', order.list));
app.use(route.post('/order/', order.create));
app.use(route.get('/order/:id', order.getById));
app.use(route.get('/install/', install.install));

app.use(compress());

if (!module.parent) {
	app.listen(9000);
	console.log('listening on port 9000');
}
