const mysql = require("mysql2");
const inquirer = require("inquirer");

// let connection = mysql.createConnection({
// 	host: "localhost",
// 	port: 3000,
// 	username: "root",
// 	password:"",
// 	database: "bamazon_db"
// });

//Display all items for sale

//Prompt users with two messages
//First ask item ID
//Then ask how many units they would like to purchase

//Once customer places order, check if store has enough to meet their demands
//If not, app should say Insufficient quantity! and prevent order from going through

//If the store does have enough, order should go through
	//Update SQL database to reflect remaining quantity
	//Once update goes through, show customer total cost of their order