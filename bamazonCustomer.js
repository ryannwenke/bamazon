const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("cli-table");
const colors = require("colors");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3000,
	user: "root",
	password: "Ridicul0us!",
	database: "bamazon_db"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	printItems(function() {
		selectItem();
	});
});

//Display all items for sale

//Prompt users with two messages
//First ask item ID
//Then ask how many units they would like to purchase

//Once customer places order, check if store has enough to meet their demands
//If not, app should say Insufficient quantity! and prevent order from going through

//If the store does have enough, order should go through
	//Update SQL database to reflect remaining quantity
	//Once update goes through, show customer total cost of their order