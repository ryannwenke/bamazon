CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE `bamazon`.`products` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(45) NOT NULL,
  `department_name` VARCHAR(45) NOT NULL,
  `price` INT NOT NULL,
  `stock_quantity` INT NOT NULL,
  PRIMARY KEY (`item_id`));