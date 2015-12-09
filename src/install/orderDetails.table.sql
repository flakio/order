CREATE TABLE IF NOT EXISTS `OrderDetail` (
	`orderId` VARCHAR(45) NOT NULL ,
	`productId` VARCHAR(45) NOT NULL ,
	`productName` VARCHAR(45) NOT NULL,
	`price` DECIMAL(13,4) NULL,
	`quantity` INT NOT NULL,
	`total` DECIMAL(13,4) NULL,
	PRIMARY KEY (`orderId`)
)