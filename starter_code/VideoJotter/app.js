/*
* 'require' is similar to import used in Java and Python. It brings in the libraries required to be used
* in this JS file.
* */
const express = require('express');
const { engine } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

/*
* Creates an Express server - Express is a web application framework for creating web applications
* in Node JS.
*/
const app = express();

// Handlebars Middleware
/*
* 1. Handlebars is a front-end web templating engine that helps to create dynamic web pages using variables
* from Node JS.
*
* 2. Node JS will look at Handlebars files under the views directory
*
* 3. 'defaultLayout' specifies the main.handlebars file under views/layouts as the main template
*
* */
app.engine('handlebars', engine({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
	defaultLayout: 'main' // Specify default template views/layout/main.handlebar 
}));
app.set('view engine', 'handlebars');

// Express middleware to parse HTTP body in order to read HTTP data
app.use(express.urlencoded({
	extended: false
}));
app.use(express.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// To store session information. By default it is stored as a cookie on browser
app.use(session({
	key: 'vidjot_session',
	secret: 'tojdiv',
	resave: false,
	saveUninitialized: false,
}));

// Place to define global variables
app.use(function (req, res, next) {
	next();
});

// mainRoute is declared to point to routes/main.js
const mainRoute = require('./routes/main');

// Any URL with the pattern ‘/*’ is directed to routes/main.js
app.use('/', mainRoute);

/*
* Creates a port for express server since we don't want our app to clash with well known
* ports such as 80 or 8080.
* */
const port = 5000;

// Starts the server and listen to port
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});