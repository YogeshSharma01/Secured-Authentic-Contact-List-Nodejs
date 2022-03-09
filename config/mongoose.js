// require the library
const mongoose = require('mongoose');

//  connect to the database
mongoose.connect('mongodb://localhost/contact_list');

// acquire the connection 
const db = mongoose.connection;


// Error 
db.on('error', console.error.bind(console, 'Error in connecting DataBase'));


db.once('open',function(){
    console.log('Successfully connected to the DataBase');
});


module.exports = db;



