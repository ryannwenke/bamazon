var mysql = require('mysql2');
var Table = require('cli-table');
var inquirer = require('inquirer');
var Colors = require('colors');

var connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "Ridicul0us!",
     database: "bamazon"
});


connection.connect(function(err) {
    if (err) throw err;
      console.log("connected as id " + connection.threadId);
    printItems(function(){
    selectItem();  
    });
});


var shoppingCart = [];
var totalCost = 0;

function printItems(showtable){
  var table = new Table({
    head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity Available']
  });
  connection.query('SELECT * FROM Products', function(err, res){
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, '$' + res[i].price_ctc, res[i].stock_quantity]);
    }
    console.log(table.toString());
    showtable();
    });
  }


function selectItem(){
   var items = [];             
    connection.query('SELECT product_name FROM Products', function(err, res){
       if (err) throw err;
        for (var i = 0; i < res.length; i++) {  
        items.push(res[i].product_name);
        }

     inquirer.prompt([
      {
      name: 'choices',
      type: 'checkbox',
      message: 'Press the space key to select each Product and enter when you are finished shopping.',
      choices: items
      }
      ]).then(function(customer){
       if (customer.choices.length === 0) {        
         console.log('Please select an item');
         inquirer.prompt([
           {
           name: 'choice',
           type: 'list',
           message: 'Your cart is empty. Would you like to keep shopping or exit?',
           choices: ['Continue Shopping', 'Exit']
           }
      ]).then(function(customer){
        if (customer.choice === 'Continue Shopping') {
              printItems(function(){    
              selectItem();             
            });
            }  else {
              console.log('Exiting');
              connection.end();  
             }
          });
        } else {
          numberOfItems(customer.choices);
        }
    });
    });
  } 

function numberOfItems(itemNames){

      var item = itemNames.shift();
      var itemStock;  
      var itemCost;  
      var department;  

    connection.query('SELECT stock_quantity, price_ctc, department_name FROM Products WHERE ?', {
    product_name: item
    }, function(err, res){
     if(err) throw err;
     itemStock = res[0].stock_quantity;
     itemCost = res[0].price_ctc;
     department = res[0].department_name;
     });
    
    inquirer.prompt([
     {
    name: 'amount',
    type: 'text',
    message: 'Select how many ' + item + ' you would like to purchase',

     validate: function(instock){
         if (parseInt(instock) <= itemStock) {
           return true
         } else {
           console.log('Insufficient quantity ' + itemStock + ' of those in stock.');
           return false;
         }
       }
     }
   ]).then(function(user){
     var amount = user.amount;
     shoppingCart.push({
        item: item,
        amount: amount,
        itemCost: itemCost,
        itemStock: itemStock,
       department: department,
       total: itemCost * amount
     });
     
     if (itemNames.length != 0) {
       numberOfItems(itemNames);
     } else {
      
      checkout(); 
     }
     });
 }


function checkout(){
   if (shoppingCart.length != 0) {  
    var fTotal = 0;      
    console.log("Are you ready to checkout with the following items?");
      for (var i = 0; i < shoppingCart.length; i++) {
        var item = shoppingCart[i].item;
        var amount = shoppingCart[i].amount;
        var cost = shoppingCart[i].itemCost;
        var total = shoppingCart[i].total;
        var itemCost = cost * amount;
        fTotal += itemCost;    // adds 
        console.log(amount + ' ' + item + ' ' + '$' + total);
      }  // end for loop
      console.log("Total: $" + fTotal);  
  
      inquirer.prompt([
       {
         name: 'checkout',
         type: 'list',
         message: 'Are You Ready To Checkout?',
         choices: ['Checkout', 'Edit Cart']
       }
     ]).then(function(res){
          
         if (res.checkout === 'Checkout') {
             updateDatabase(fTotal);
            } else {
           
           editCart();
            }
          });
          } else {



        inquirer.prompt([
        {
          name: 'choice',
          type: 'list',
          message: 'The cart is empty, do you want to keep shopping or exit?',
          choices: ['Continue Shopping', 'Exit']
        }
        ]).then(function(user){
         //options to continue or stop
         if (user.choice === 'Continue Shopping') {
            printItems(function(){
            selectItem();
           });
          } else {
           console.log('Exiting Bamazon');
           connection.end();
         }
     });  
   }
 } 




function updateDatabase(fTotal){
   var item = shoppingCart.shift();  
   var itemName = item.item;
   var itemCost = item.itemCost
   var userPurchase = item.amount;
   var department = item.department;
   var departmentTransaction = itemCost * userPurchase;
   connection.query('SELECT total_sales FROM Department WHERE ? ' , {
    department_name: department

   }, function(err, res){
    
      var departmentTotalSale = res[0]["total_sales"];

      connection.query('UPDATE Department SET ? WHERE ?', [
    {
      total_sales: departmentTotalSale += departmentTransaction
    },
    {
      department_name: department
    }], function(err){
      if(err) throw err;
    });
   });


    connection.query('SELECT stock_quantity FROM Products WHERE ?', {
    product_name: itemName

    }, function(err, res){
     var currentStock = res[0].stock_quantity;
     console.log("Current Stock " + currentStock);
     
     connection.query('UPDATE Products SET ? WHERE ?', [
     {
      stock_quantity: currentStock -= userPurchase
     },
     {
       product_name: itemName
     }], function(err){
       if(err) throw err;
      
       if (shoppingCart.length != 0) {
         updateDatabase(fTotal);
       } else {
         
         fTotal = fTotal.toFixed(2);
         console.log('Thank you for using Bamazon!');
         console.log('Your total is $' + fTotal);
         connection.end();
              }  // closes else statement
        });
      });
  }  




function editCart(){
   var items = [];
   for (var i = 0; i < shoppingCart.length; i++) {
     var item = shoppingCart[i].item;
     items.push(item);
   }
   //prompt the user to select items to edit
   inquirer.prompt([
     {
     name: 'choices',
     type: 'checkbox',
     message: 'Select which item(s) you want to edit.',
     choices: items
     }
   ]).then(function(user){
       if (user.choices.length === 0) {
         console.log('Select something to edit from your cart');
         checkout();
       } else {
         var itemsToEdit = user.choices;
         editItem(itemsToEdit);
       }
   });
 }


 function editItem(itemsToEdit){
   if (itemsToEdit.length != 0) {
     var item = itemsToEdit.shift(); 
     inquirer.prompt([
       {
       name: 'choice',
       type: 'list',
       message: 'Do you want to remove ' + item + ' from your cart change the quantity?',
       choices: ['Remove Item From My Cart', 'Change Quanity']
       }
     ]).then(function(user){
        
         if (user.choice === 'Remove Item From My Cart') {
           for (var i = 0; i < shoppingCart.length; i++) {
             if (shoppingCart[i].item === item) {
                shoppingCart.splice(i, 1);
                console.log('Your cart is now updated');
             }
          }  
           editItem(itemsToEdit);  
         } else {
          
           inquirer.prompt([
             {
             name: 'amount',
             type: 'text',
             message: 'How many ' + item + ' would you like to purchase?',
             }
           ]).then(function(user){   
             for (var i = 0; i < shoppingCart.length; i++) {
               if (shoppingCart[i].item === item) {
                 shoppingCart[i].amount = user.amount;
                 shoppingCart[i].total = shoppingCart[i].itemCost * user.amount;
                 console.log('Your cart is now updated');
               }  
             }  
             editItem(itemsToEdit);  
           });
         }
       });
   } else {
     checkout(); 
   }
 }