# Books management application

## Getting started
The application can handle a book database, where the user can CRUD (Create, Read, Update, Delete) books and reviews. 

## How to use the application
The application can be tested in `Visual Studio Code` with the `REST Client` (humao.rest-client) extension.
Please use the `test.http` file `Send Request` lines for testing the requested API end point: 
- POST API: modify the json data in `test.http`
- GET / PUT / DELETE API: modify the data in `index.js`

### MongoDB Database
The following database is available for using:
- User Model
```yaml
{ 
_id: ObjectId("6698fe34e38997503cd738cc"),
username: "testUser1",
email: "test1@user.com",
password: "123450",
__v: 0
}
```

- Book Model
```yaml
{ 
_id: ObjectId("669a19b59d2180ef38a869e5"),
author: "Author01",
title: "Title01",
reviewsNumber: 0,
averageRate: 0,
reviews: [],
__v: 0
},
{ 
_id: ObjectId("66995f71590b65ef5a33d378"),
author: "Author02",
title: "Title02",
reviewsNumber: 2,
averageRate: 3,
reviews: [
    ObjectId("669a1ae5a51526043a46d9d4"), 
    ObjectId("669a1af0a51526043a46d9db")],
__v: 0
},
{ 
_id: ObjectId("66990713b359a548b3784874"),
author: "Author03",
title: "Title03",
reviewsNumber: 0,
averageRate: 0,
reviews: [],
__v: 0
}
```

- Review Model
```yaml
{ 
_id: ObjectId("669a1ae5a51526043a46d9d4"),
review: "Review1",
stars: 1,
reviewAuthor: ObjectId("6698fe34e38997503cd738cc"),
bookId: "66995f71590b65ef5a33d378",
__v: 0
},
{
_id: ObjectId("669a1af0a51526043a46d9db"),
review: "Review2",
stars: 5,
reviewAuthor: ObjectId("6698fe34e38997503cd738cc"),
bookId: "66995f71590b65ef5a33d378",
__v: 0
}
```
### APIs
#### User APIs 
- POST /api/users
   - Allow to create a new user as follows: 
     - email: validated email format (any@thing.com), email is not allowed be not registered before
     - username: minimum 4 characters
     - password: minimum 4 characters
   - 
- POST /api/users/login
  - Allow to login a user after registration with email and password
  - After the successful login attempt return a JWT token for authentic use of other API endpoints

- GET /api/users/me
  - Allow to get the logged user data
  - Authenticated end point, user has to be logged in

#### Books API
- POST /api/books
  - Allow to create a book as follows:
    - author: required
    - title: required
  - Not allow to create a book if the author and title has already created

- GET /api/books
  - Allow to get the book list

- GET /api/books/:id
  - Allow to get a specific book data
  - Modify in `index.js` the `testId` based on the ID of the requested book

- PUT /api/books/:id/patch
  - Allow to update a specific book data
  - Modify in `index.js` the `modId` based on the ID of the requested book
  - Modify in `index.js` the `modifiedData` based on the new data

- DELETE /api/books/:id/delete
  - Allow to update a specific book data
  - Modify in `index.js` the `delId` based on the ID of the requested book

#### Review APIs
- POST /api/books/:bookId/reviews
  - Allow to create a review for a specific book
  - Authenticated end point, user has to be logged in
  - Modify in `index.js` the `revBookId` based on the ID of the requested book for review

- GET /api/books/:bookId/reviews
  - Allow to get the reviews of a specific book
  - Modify in `index.js` the `bookId` based on the ID of the requested book

- PUT /api/reviews/:id
  - Allow to update a specific review
  - Authenticated end point, user has to be logged in
  - Review can be updated only if it was written by the logged user
  - Modify in `index.js` the `revId` based on the ID of the requested review for modification
  - Modify in `index.js` the `modRevData` based on the new data
  
- DELETE /api/reviews/:id/delete
  - Allow to delete a specific review
  - Authenticated end point, user has to be logged in
  - Review can be deleted only if it was written by the logged user
  - Modify in `index.js` the `delRevId` based on the ID of requested review for delete

## Built with
- [Node.js](https://nodejs.org)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens](https://jwt.io/)

## Version
*1.0 - 19/07/2024* - Publishing of the application  

## Author
Kornel Frikton - [https://github.com/KornelFrikton](https://github.com/KornelFrikton)