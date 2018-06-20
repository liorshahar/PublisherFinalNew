var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    db              = require('./db/db.connection'),
    bookRoutes      = require('./routes/book.routes'),
    publisherRoutes = require('./routes/publisher.routes');
    userRoutes      = require('./routes/user.routes');
    
/* The app module , middleware and route configuration*/

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/publisher' , publisherRoutes);
app.use('/book' , bookRoutes);
app.use('/user', userRoutes);

app.get('/' , (req , res)=>{
    res.status(200).json({'main routes': 
        [
        {'publisher routes': 'https://hanan-lior-publisher-app.herokuapp.com/publisher'},
        {'books routes': 'https://hanan-lior-publisher-app.herokuapp.com/book'},
        {'user routes': 'https://hanan-lior-publisher-app.herokuapp.com/user'}
    ]});
})
module.exports = app;
