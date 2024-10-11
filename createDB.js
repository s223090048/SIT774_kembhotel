// Require the express web application framework (https://expressjs.com)
var express = require('express');
var Sqlite3 = require('sqlite3').verbose();

// Create a new web application by calling the express function
var app = express();

var db = new Sqlite3.Database('feedback');

db.serialize(function(){
    db.run(`
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT,
            email TEXT,
            mobile_phone TEXT,
            message TEXT
        ) 
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            mobile_phone integer,
            booking_date TEXT,
            booking_time TEXT,
            persons integer
        ) 
    `)

    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Users table created successfully.');
        }
    });
})


console.log('Database and feedback,bookings tables successfully created');

app.listen(3000, function () {
    console.log(`Web server running at: http://localhost:3000`);
    console.log("Type Ctrl+C to shut down the web server");
});