CREATE TABLE IF NOT EXISTS `Order` (
	`id` VARCHAR(45) NOT NULL ,
	`customerId` VARCHAR(45) NOT NULL,
	`status` INT NOT NULL ,
	`total` DECIMAL(13,4) NULL ,
	`orderDate` DATE NOT NULL,
	`shipDate` DATE NULL,
	`processor` VARCHAR(45),
	`txnId` VARCHAR(45),
	`shippingAddress` VARCHAR(200),
	PRIMARY KEY (`id`)
)