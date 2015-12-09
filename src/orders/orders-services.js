var database = new (require('../dao/database'))();
var uuid = require('uuid');

var OrderShort = function(id, email, status, total, orderDate, shippingAddress, lineItems){
  this.id = id;
  this.email = email;
  this.status = status;
  this.total = total;
  this.orderDate = orderDate;
  this.shippingAddress = shippingAddress;
  this.lineItems = lineItems;
};

var Order = function(id, email, status, total, orderDate, shippingAddress, items){
  this.id = id;
  this.email = email;
  this.status = status;
  this.total = total;
  this.orderDate = orderDate;
  this.shippingAddress = shippingAddress;
  this.items = items;
}

var OrderItem = function(productId, productName, price, quantity){
  this.productId = productId;
  this.productName = productName;
  this.price = price;
  this.quantity = quantity;
}

function OrderService(){
}

OrderService.prototype = {
  list: function *(){
    var results = yield database.query (
      "SELECT ord.id, ord.email, ord.status, ord.total, ord.orderDate, ord.shippingAddress, ( \
      SELECT COUNT(*) FROM `OrderDetail` detail WHERE detail.orderId = ord.id \
      ) AS \"lineItems\" \
      FROM `Order` ord");

    var list = results[0].map(function(dto){
      return new OrderShort(dto.id, dto.email, dto.status, dto.total, dto.orderDate,
        JSON.parse(dto.shippingAddress), dto.lineItems);
    });

    return list;
  },

  getById: function *(id){

    var orderDto = null;
    var itemsDto = null;

    var selects = [
      function *(){
        var result = yield database.query('SELECT ord.email, ord.status, ord.total, ord.orderDate, ord.shippingAddress ' +
          ' from `Order` ord where ord.id = ?', id);
        orderDto = result[0].length ? result[0][0] : null
      },
      function *(){
        var result = yield database.query('SELECT productId, productName, price, quantity, total FROM `orderdetail` where orderId = ?', id);
        itemsDto = result[0];
      }
    ];

    yield selects;

    console.log(orderDto)

    if (!orderDto){
      return null;
    }

    var items = itemsDto.map(function(dto){
      return new OrderItem(dto.productId, dto.productName, dto.price, dto.quantity);
    });

    return new Order(id, orderDto.email, orderDto.status, orderDto.total, orderDto.orderDate,
      JSON.parse(orderDto.shippingAddress), items);

  },

  create: function *(data){
    // Process payment ()
    // In a real system this would involve multiple steps with some consistency checks in place
    // We may even simply capture the payment and charge it when shipping

    // Add a new order to mysql

    var orderId = uuid.v1();

    yield database.query("INSERT INTO `Order` \
		(id, customerId, email, status, total, orderDate, shippingAddress) \
		VALUES (?, ?, ?, ?, ?, NOW(), ?)",
      [orderId,
        data.customerId,
        data.email,
        data.status,
        data.total,
        JSON.stringify(data.shippingAddress)]);

    if (!data.items){
      return;
    }

    var inserts = [];
    for(var i = 0; i < data.items.length; i++){
      var item = data.items[i];
      inserts.push(database.query('INSERT INTO `orderdetail`\
        (`orderId`,`productId`,`productName`,`price`,`quantity`,`total`) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.productId, item.productName, item.price, item.quantity, item.price * item.quantity]));
    }

    yield inserts;
    // TODO: Send email notification to notify service
  }
}

module.exports = OrderService;
