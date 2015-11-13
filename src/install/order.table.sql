CREATE TABLE IF NOT EXISTS `Order` (
	`id` VARCHAR(45) NOT NULL ,
	`customerId` VARCHAR(45) NOT NULL,
	`status` INT NOT NULL ,
	`total` DECIMAL(13,4) NOT NULL ,
	`orderDate` DATE NOT NULL,
	`shipDate` DATE NULL,
	`processor` VARCHAR(45) NULL,
	`txnId` VARCHAR(45) NULL,
	`shippingAddress` VARCHAR(200) NULL,
	PRIMARY KEY (`id`)
)