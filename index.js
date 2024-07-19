const express = require('express');
const app = express();
app.listen(8000);

const mongoose = require('mongoose');
const CONNECTION_STRING = 'mongodb+srv://friktonkornel:ZcZQiM8J39qamU0V@cluster0.vlrai1v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(CONNECTION_STRING);
mongoose.connection.on('connected', () => console.log('Mongoose DB has been connected'));
mongoose.connection.on('error', () => console.log('Connection error'));

const jwt = require('jsonwebtoken');

const User = require('./Models/user');
const Book = require('./Models/book');
const Review = require('./Models/review');

//Middleware parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Middleware for authentication
const authenticationJWT = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, 'secret', (error, user) => {
                if (error) {
                    return res.sendStatus(403);
                }
                req.user = user;       
                next();
            });
        } else {
            res.redirect('/api/users/login');
        }
    } catch (error) {
        res.json({error});
    }
};

//Calculate averageRate for BookSchema
const updateBookRatings = async (bookId) => {
    try {
      const result = await Review.aggregate([
        { $match: { bookId: bookId } },
        { $group: { _id: null, averageRate: { $avg: '$stars' }, reviewsNumber: { $sum: 1 } } },
      ]);
  
      const averageRate = result.length > 0 ? result[0].averageRate : 0;
      const reviewsNumber = result.length > 0 ? result[0].reviewsNumber : 0;
  
      await Book.findByIdAndUpdate(bookId, {
        averageRate: averageRate,
        reviewsNumber: reviewsNumber,
      });
    } catch (error) {
        res.json({error});
    }
};

//Adding custom request headers
app.all('*' , (req, res, next) => {
    if (!token) {
    console.log('Token is undefined');;
    } else {
    req.headers.authorization = 'Bearer ' + token; 
    }
    next();
});

//USER API - Create new user
app.post('/api/users', async (req, res) => {
    const newUser = await User.exists({ email: req.body.email });
    if (!newUser) {
        const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password 
        });

        try {
            const userResponse = await user.save();
            res.json(userResponse);   
        } catch (error) {
            res.json({error});
        }

    } else {
        return res.status(404).json({ error: 'Email has already registered!' });
    }
});

//USER API - Login user and JWT authentication
var token;

app.post('/api/users/login', async (req, res) => {
    try {        
        const loginEmail = await User.findOne({ email: req.body.email });
        const loginPassword = await User.findOne({ password: req.body.password });

        if (!loginEmail) {
            return res.status(404).json({ error: 'Email is not registered!' });
        } else if (!loginPassword) {
            return res.status(404).json({ error: 'Password is not valid!' });     
        }        
            
        const accessToken = loginEmail.generateAuthToken();
        token = accessToken;       
        return res.status(200).send('Login successful!');   
        } catch (error) {
            res.json({error});
        }
});

//USER API - User data
app.get('/api/users/me', authenticationJWT, async (req, res) => {
    try {
        const userMe = jwt.decode(token, 'secret');
        const userData = await User.findOne({_id: userMe._id});
        res.send(userData);
    } catch (error) {
        res.json({error});
    }
});

// BOOK API - Create new book
app.post('/api/books', async (req, res) => {
    const newBook = await Book.exists({ author: req.body.author }, { title: req.body.title });
 
    if (!newBook) {
        const book = new Book({
        title: req.body.title,
        author: req.body.author     
    });

        try {
            const bookResponse = await book.save();
            res.json(bookResponse);   
        } catch (error) {
            res.json({error});
        }

    } else {
        return res.status(404).json({ error: 'Book has already registered!' });
    }
});

//BOOK API - Get the list of books
app.get('/api/books', async (req, res) => {
    try {
        const bookData = await Book.find().populate('reviews').exec();
        res.send(bookData);
    } catch (error) {
        res.json({error});
    }
});

//BOOK API - Get the book by ID
app.get('/api/books/:id', async (req, res) => {
    
    //Modify the "testId" based on the requested book 
    const testId = "66995f71590b65ef5a33d378"
    
    try {
        const findBook = await Book.findById(testId);
        res.send(findBook);
    } catch (error) {
        res.json({error});
    }
}); 

//BOOK API - Modify the book data by ID
app.put('/api/books/:id/patch', async (req, res) => {
   
    //Modify the "modId" based on the requested book 
    const modId = { _id: "669a19b59d2180ef38a869e5"};
    //Modify the "modifiedData" based on the new data
    const modifiedData = {author: "modifiedAuthor"}   
   
    try {
        const findModifiedBook = await Book.findOneAndUpdate( modId, modifiedData, {
            new: true
        });
        res.send(findModifiedBook);
    } catch (error) {
        res.json({error});
    }
});

//BOOK API - Delete book
app.delete('/api/books/:id/delete', async (req, res) => {
    
    //Modify the "delId" based on the requested book
    const delId = { _id: "669a19b59d2180ef38a869e5"};

    try {
        const deleteData = await Book.findOneAndDelete(delId);
        res.json(deleteData);   
    } catch (error) {
        res.json({error});
    }
});

//REVIEW API - Create review
app.post('/api/books/:bookId/reviews', authenticationJWT, async (req, res) => {

    //Modify the "revBookId" based on the requested book
    const revBookId = "66995f71590b65ef5a33d378";

    const book = await Book.findById(revBookId);
    console.log('book', book)
    const review = new Review({
        review: req.body.review,
        stars: req.body.stars,
        reviewAuthor: req.user._id,
        bookId: revBookId,
    });

    try {
        const response = await review.save();

        await updateBookRatings(revBookId);
        book.reviews.push(review);
        await book.save();

        res.json(response);
       
    } catch (error) {
        res.json({error});
    }
});

//REVIEW API - Get the list of reviews by book
app.get('/api/books/:bookId/reviews', async (req, res) => {

    //Modify the "bookId" based on the requested book
    const bookId = "66995f71590b65ef5a33d378"

    try {
        const revByBook = await Book.findById(bookId).populate('reviews').exec();
        res.send(revByBook);
    } catch (error) {
        res.json({error});
    }
});

//REVIEW API - Modify the review by book
app.put('/api/reviews/:id', authenticationJWT, async (req, res) => {
    
    //Modify the "revId"  based on the requested review for modification
    const revId = { _id: "669a1af0a51526043a46d9db"};
    //Modify the "modRevData" based on the new data
    const modRevData = {review: "Modified review"}

    const userId = req.user._id;

        try {
            const modRev = await Review.findOne(revId);

            if (modRev.reviewAuthor.toString() !== userId) {
                return res.status(404).json({ error: 'The review was written by other user!' });
            } else {
                await Review.findOneAndUpdate( revId, modRevData, {
                    new: true
                });
                res.send(modRev);
            }
        } catch (error) {
            res.json({error});
        }
});

//REVIEW API - Delete the review
app.delete('/api/reviews/:id/delete', authenticationJWT, async (req, res) => {
    
    //Modify the "delRevId" based on the requested review for delete
    const delRevId = "669a1af0a51526043a46d9db";

    const userId = req.user._id;

     try {
        const delRev = await Review.findById(delRevId);

        if (delRev.reviewAuthor.toString() !== userId) {
            return res.status(404).json({ error: 'The review was written by other user!' });
        } else {
            await Review.findOneAndDelete({_id: delRevId});
            res.json(delRev);
        
            const bookId = delRev.bookId;
            await updateBookRatings(bookId);
            await Book.findOneAndUpdate({_id:bookId},{ $pull: { reviews: delRev._id }}
            );
            
        }
        } catch (error) {
            res.json({error});
    }
});