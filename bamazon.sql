CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE `bamazon`.`products` (
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(45) NOT NULL,
  `department_name` VARCHAR(45) NOT NULL,
  `price` INT NOT NULL,
  `stock_quantity` INT NOT NULL,
  PRIMARY KEY (`item_id`));

INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('tissues', 'toiletries', 1, 20);
INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('paper towels', 'toiletries', 2, 15);
INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('envelopes', 'office supplies', 2, 17);
INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('pens', 'office supplies', 2, 13);
INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('apples', 'produce', 1, 10);
INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('bananas', 'produce', 1, 10);
INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('bottled water', 'drinks', 1, 16);
INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('kombucha', 'drinks', 4, 18);
INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('ice cream', 'frozen food', 3, 11);
INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('string cheese', 'dairy', 4, 3);
INSERT INTO Products (product_name, department_name, price, stock_quantity)
VALUES ('butter', 'dairy', 3, 9);

select * from Products;

CREATE TABLE Department (
 department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
 department_name VARCHAR(45) NOT NULL,
 total_sales FLOAT(7, 2) NOT NULL,
 PRIMARY KEY (department_id)
 );
 
 INSERT INTO Department (department_name, total_sales)
 VALUES('toiletries', 0);
 INSERT INTO Department (department_name, total_sales)
 VALUES('office supplies', 0);
 INSERT INTO Department (department_name, total_sales)
 VALUES('produce', 0);
 INSERT INTO Department (department_name, total_sales)
 VALUES('drinks', 0);
 INSERT INTO Department (department_name, total_sales)
 VALUES('frozen food', 0);
 INSERT INTO Department (department_name, total_sales)
 VALUES('dairy', 0);
 
 select * from Department;