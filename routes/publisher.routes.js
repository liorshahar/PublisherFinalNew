var express          = require('express'),
    router           = express.Router(),
    mongoose         = require('mongoose'),
    publisherModel   = require('../models/publisher.model');
    bookModel        = require('../models/book.model'); 
    userModel        = require('../models/user.model');  



router.get('/' , (req , res)=>{
     res.status(200).json({
        message: 'display all publisher routes',
        description:[
        {   
            return: 'Get all publisher',
            method: 'GET',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/getAllPublishers',
            params: '/'
        },
        {
            return: 'Get publisher by id',
            method: 'POST',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/getPublisherById',
            params: 'pubId'  
        },

        {
            return: 'Adding new publisher',
            method: 'POST',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/createNewPublisher',
            params: 'name'  
        },
    
        {
            return: 'Get publisher books by publisher name',
            method: 'GET',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/getPublisherBooks/:name',
            params: '/:name'  
        },
     
        {
            return: 'Get followers by publisher id',
            method: 'POST',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/getPublisherFollowers',
            params: 'pubId'  
        },
    
        {
            return: 'Add Followers',
            method: 'POST',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/addFollower',
            params: 'pubId , folId'  
        },
    
        {
            return: 'remove Followers',
            method: 'POST',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/getAllPublishers/removeFollower',
            params: 'pubId , folId'  
        },
  
        {
            return: 'Get Following',
            method: 'POST',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/getPublisherFollowing',
            params: 'pubId'  
        },
      
        {
            return: 'Create New Book By Publisher',
            method: 'POST',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/createNewBook',
            params: 'bookName , authorId  , bookTitle , img , autorName , category'  
        },
   
        {
            return: 'Adding chapters to book by book id',
            method: 'POST',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/addingChaptersToBook',
            params: 'chapterNumber , readingTime , content , bookId '  
        },
    
        {
            return: 'Adding publisher goal',
            method: 'POST',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/AddPublisherGoal',
            params: '_id , description , target , current '  
        },
     
        {
            return: 'Delete Book',
            method: 'POST',
            route: 'https://hanan-lior-publisher-app.herokuapp.com/publisher/deleteBook',
            params: 'bookId'  
        }]
     })
});

/* Get all publishers */
router.get('/getAllPublishers' , (req , res)=>{
    console.log('Get All publishers');
    publisherModel.find({})
    .then((publisher) => res.status(200).send(publisher))
    .catch((err) => res.status(500).send("There was problem find publishers in database."));
});


/* Get publisher by id*/

router.post('/getPublisherById' , (req , res)=>{
    publisherId = req.body.pubId;
    publisherModel.findById(publisherId)
    .then((publisher) => res.status(200).send(publisher))
    .catch((err) => res.status(500).send(`There was problem adding follower. ${err}`));
})
/* Adding new publisher*/
router.post('/createNewPublisher' , (req , res)=>{
    console.log('POST request : Create new publisher');
    console.log(req.body.name)
    publisherModel.create({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    })
    .then((publisher) => res.status(200).send(publisher))
    .catch((err) => res.status(500).send(`There was problem adding publisher to database. ${err}`));
});

/* Get publisher books by publisher name*/
router.get('/getPublisherBooks/:name' , (req , res)=>{
    console.log('GET request: Get All Publisher Books');

    publisherModel.findOne({name: req.params.name})
    .then((publisher)=> {
          console.log(publisher.books)
          bookModel.find({_id : {$in: publisher.books}})
          .then(books =>{
                console.log(books);
                res.status(200).send(books);
            });
        }).catch((err)=>{res.status(500).send("There was problem find publisher in the database."); 
    });
});

/* Get followers by publisher id*/
router.post('/getPublisherFollowers' ,(req , res)=>{
    console.log('POST request: get all Followers');
    publisherId = req.body.pubId;
    console.log(publisherId);
    publisherModel.findById(publisherId).
    then(publisher =>{
        console.log(publisher.followers);
        userModel.find({_id : {$in: publisher.followers}})
        .then((followers) => res.status(200).send(followers))
        .catch((err) => res.status(500).send(`There was problem find follower. ${err}`));
    })
    .catch((err) => res.status(500).send(`There was problem publisher. ${err}`));
});

/* Add Followers*/
router.post('/addFollower' ,(req , res)=>{
    console.log('POST request: add Follower');
    publisherId = req.body.pubId;
    followerId  = req.body.folId;
    console.log(publisherId + " " + followerId);
    publisherModel.findById(publisherId).
    then(publisher =>{
        console.log(publisher.followers);
        console.log(followerId);
        var followersArray = publisher.followers;

        /* Checking if follower exist*/
        if(followersArray.includes(parseInt(followerId))){
            console.log('follower exist');
            res.status(200).json({'message' : 'follower exist'});
        }else{
            publisherModel.findByIdAndUpdate(publisherId,
             { $addToSet: { 'followers': followerId },$inc: { 'followerscount': 1 }},{'new': true, 'upsert': true })
            .exec()
            .then((publisher) => res.status(200).send(publisher))
            .catch((err) => res.status(500).send(`There was problem adding follower. ${err}`));
        }
    })
    .catch((err) => res.status(500).send(`There was problem adding follower. ${err}`));
});

/* remove Followers*/
router.post('/removeFollower' ,(req , res)=>{
    console.log('POST request: remove Follower');
    publisherId = req.body.pubId;
    followerId  = req.body.folId;
    console.log(publisherId + " " + followerId);
    publisherModel.findByIdAndUpdate(publisherId,
    { $pull: { 'followers': followerId },$inc: { 'followerscount': -1 }})
    .exec()
    .then((publisher) => res.status(200).send(publisher))
    .catch((err) => res.status(500).send(`There was problem remove follower. ${err}`));
});

/* Get Following*/
router.post('/getPublisherFollowing' ,(req , res)=>{
    console.log('POST request: get publisher Followings');
    publisherId = req.body.pubId;
    console.log(publisherId);
    publisherModel.findById(publisherId).
    then(publisher =>{
        console.log(publisher.following);
        userModel.find({_id : {$in: publisher.followers}})
        .then((followers) => res.status(200).send(followers))
        .catch((err) => res.status(500).send(`There was problem find follower. ${err}`));
    })
    .catch((err) => res.status(500).send(`There was problem publisher. ${err}`));
});


/* Create New Book By Publisher*/
router.post('/createNewBook' , (req , res) =>{
    console.log(`POST request: createNewBook: ${req.body.bookName} ${req.body.authorId}`);
    
    /* Create new book document*/
    console.log(req.body.authorId);
    var newBook  = new bookModel({
        _id: new mongoose.Types.ObjectId(),
        book_name: req.body.bookName,
        author: req.body.authorId,
        title: req.body.bookTitle,
        img: `http://${req.body.img}`,
        authorName: req.body.autorName,
        categories: req.body.category
    });

      newBook.save((err)=>{
        if(err){
            console.log({'message': `somthing went wrong with add new book ${err}`});
            res.status(500).json({'message': `somthing went wrong with add new book ${err}`});
        }else{
            console.log(req.body.authorId + " " + newBook._id);

            /* Adding to the publisher book array the new book*/
             publisherModel.findById(req.body.authorId)
            .then((publisher) => {
                console.log(publisher);
                publisher.books.push(newBook._id);
                publisher.save((err)=>{
                    if(err){
                        console.log({'message': `somthing went wrong with add new book to publisher ${err}`});
                        res.status(500).json({'message': `somthing went wrong with add new book to publisher ${err}`});
                    }
                    else{
                        res.status(200).json({'message' : 'adding new book to publisher'});
                    }
                });
            })
            .catch(err => res.status(500).json({'message': `somthing went wrong with add new book to publisher ${err}`}));
    
        }
    });
});

/* Adding chapters to book by book id*/
router.post('/addingChaptersToBook' , (req , res) => {
    var bookContent = {};
    bookContent.chapter     = req.body.chapterNumber;
    bookContent.readingTime = req.body.readingTime;
    bookContent.content     = req.body.content; 
    console.log(bookContent);
    bookModel.findByIdAndUpdate(req.body.bookId , {$push: { chapters: bookContent}}, { 'new': true})
    .then(()=> res.status(200).json({'update' : 'success'}))
    .catch((err) => res.status(500).send(`there was problem find user ${err}`));
});

/* Add goals*/
router.post('/AddPublisherGoal' , (req , res)=>{
    console.log('POST request: /AddPublisherGoal');
    var goal = {};
    var publisher   = req.body._id;
    goal.description = req.body.description;
    goal.target = req.body.target;
    goal.current = req.body.current;
    console.log(user , goal);
    publisherModel.findByIdAndUpdate({_id: user}, {$push: { goals: goal}}, { 'new': true})
    .then(()=> res.status(200).json({'update' : 'success'}))
    .catch((err) => res.status(500).send(`there was problem find user ${err}`));
});

/* Delete Book*/
router.post('/deleteBook' , (req , res)=>{
    console.log('POST request: /delete book');
    console.log(req.body.bookId);
    bookModel.remove({_id : req.body.bookId})
    .then(()=> {
        console.log('userModel');
        userModel.update({},{$pull : {borrowd_books: {$elemMatch : {_id : req.body.bookId}}}}, { multi: true })
        .then(()=> {

         console.log('publiserModel');
             publisherModel.update({},{$pull : {books: {$elemMatch : {_id : req.body.bookId}}}}, { multi: true })
        })
        .then(()=>res.status(200).json({'delete' : 'success'}))     
        .catch((err) => res.status(500).send(`there was problem delete booke ${err}`))
    })
    .catch((err) => res.status(500).send(`there was problem delete booke ${err}`));
});

module.exports = router;