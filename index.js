// Require the express web application framework (https://expressjs.com)
var express = require('express');
var Sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Create a new web application by calling the express function
var app = express();
app.use(express.urlencoded({extended: false}))
app.use(express.static('public_html'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

// Set up express-session middleware for session management
app.use(session({
    secret: 'kemb@254', // Change to a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // Set session duration (in milliseconds)
}));

app.use((req, res, next) => {
    res.locals.error = req.session.error || null; 
    res.locals.success = req.session.success || null; 
    res.locals.username = req.session.username || null;
    next();
});

// ********************************************
// *** Other route/request handlers go here ***
// ********************************************
app.get('/', (req, res, next) => {
    
    res.render('index', { title: 'Kemb Hotel' });
});

app.get('/login', (req, res) => {
    res.render('login');
});

// Route for handling login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ?`;

    db.get(query, [username], (err, user) => {
        if (err) {
            console.error('Error finding user:', err.message);
            req.session.error = 'An error occurred.'
            res.redirect('/login');
        } else if (!user) {
            req.session.error ='No user found with this username.'
            res.redirect('/login')
        } else {
            // Compare hashed password
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    req.session.username = username; // Set session variable
                    req.session.success = 'Login successful! Welcome ' + username
                    
                    res.redirect('/');
                } else {
                    req.session.error = 'Invalid password.'
                    res.redirect('/login');
                }
            });
        }
    });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy session
    res.redirect('/login');
});

// Route for the registration page
app.get('/register', (req, res) => {
    res.render('register');
});

// Route for handling registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(query, [username, hashedPassword], function (err) {
        if (err) {
            console.error('Error inserting user:', err.message);
            req.session.error = 'An error occurred.'
            res.redirect('/register');
        } else {
            req.session.success ='Registration successful! You can now log in.';
            res.redirect('/login');
        }
    });
});

app.get('/accomodation', (req, res, next) => {
    
    res.render('accomodation', { title: 'Kemb Accomodation' });
});

app.get('/menu', (req, res, next) => {
    
    res.render('menu', { title: 'Kemb Menu' });
});

app.get('/reserve', (req, res, next) => {
    
    res.render('reserve', { title: 'Kemb Menu' });
});

app.get('/about', (req, res, next) => {
    
    res.render('about', { title: 'Kemb Menu' });
});


var db = new Sqlite3.Database('feedback');

app.post('/book-table', (req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const phone  = req.body.phone;
    const booking_date  = req.body.booking_date;
    const booking_time  = req.body.booking_time;
    const persons  = req.body.no_of_people;

    const sql = `INSERT INTO bookings(name,email,mobile_phone,booking_date,booking_date,persons) VALUES("${name}","${email}","${phone}","${booking_date}","${booking_time}","${persons}")`;
    db.run(sql,(err) =>{
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: `Error inserting data. ${err.message}` });
            return;
        }
        
        // successful insert
        res.render('reserve-info', { 
            title: 'Kemb Hotel' ,
            success : 'Succefully added your reservation',
            data: req.body
        });

    });
})


app.post('/save-feedback', (req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const phone  = req.body.phone;
    const message  = req.body.message;

    const sql =`INSERT INTO feedback(full_name,email,mobile_phone,message) VALUES("${name}","${email}","${phone}","${message}")`;
    db.run(sql,(err) =>{
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: `Error inserting data. ${err.message}` });
            return;
        }
        // successful insert

        res.render('feedback', { 
            title: 'Kemb Hotel' ,
            success : 'Succefully added your feedback',
            data: req.body
        });
    })

})  

app.listen(3000, function () {
    console.log(`Web server running at: http://localhost:3000`);
    console.log("Type Ctrl+C to shut down the web server");
});