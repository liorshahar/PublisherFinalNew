var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* Create and exports book schema*/

var BookSchema = mongoose.Schema({
     _id: Schema.Types.ObjectId,
    book_name: String,
    img: String,
    publishDate: Date,
    authorName: String,
    authorId: Number,
    rank: Number,
    like:Number,
    reviews: [{reviewerId:Number , description:String}],
    followers:[{type: Schema.Types.ObjectId}],
    share:Number,
    categories:[String],
    writingProgress:Number,
    chapters:[{chapter:Number , readingTime:Number , content:String}]

},{collection : 'books'});

module.exports = mongoose.model('Book' , BookSchema);

