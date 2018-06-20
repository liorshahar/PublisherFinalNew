var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* Create and exports publisher schema*/
    
var User = new Schema({
     _id: Schema.Types.ObjectId,
    name: String,
    email: String,
    img: String,
    categories: [String],
    goals: [
        {description: String , target: Number , current: Number}
    ],
    followers: [Number],
    following: [Number],
    borrowd_books: [
        {book_id:{type: Schema.Types.ObjectId} ,current_chapter: Number }
    ],
    unliked_books:[Number],
    recently_finished:[Number],
    wishlist:[Number]
},{collection : 'users'});

/* Exporting the schema*/
mongoose.model('User' , User);
module.exports = mongoose.model('User');

