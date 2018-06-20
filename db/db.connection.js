var mongoose = require('mongoose'),
    consts   = require('../consts'),
    mongoDB = consts.MLAB_KEY;

/* Connection to mlab-DB*/

module.exports = mongoose.connect(mongoDB);