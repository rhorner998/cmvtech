const express = require('express');
const { engine } = require('express-handlebars');
const handlebarsHelpers = require('./helpers/handlebars-helpers');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Handlebars with custom helpers
app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: handlebarsHelpers,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000 // 1 hour
    }
}));

app.use((req, res, next) => {
    console.log(req.path);
    next();
});

// Middleware to make 'loggedIn' available to all views
app.use((req, res, next) => {
    res.locals.loggedIn = !!req.session.userId;
    next();
});

// Use routes defined in your routes directory
app.use(routes);

module.exports = app;