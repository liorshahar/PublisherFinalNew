var app  = require('./app'),
    port = process.env.PORT || 3000;


/* The entry point for the app - server.js*/

var server = app.listen(port , ()=>{
    console.log(`Express sever listening on port ${port}`);
});