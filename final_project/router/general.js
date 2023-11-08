const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
        users.push({
            username,
            password,
        });
        return res.status(200).json({
            message: "Customer successfully registered. Now you can login."
        })
    }
  } else {
      return res.status(404).json({
          message: "Unable to register user."
      });
  }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    if(isbn in Object.keys(books)) {
        return res.send(JSON.stringify(books[isbn], null, 4));
    } else {
        return res.send(`No Book with that ISBN: ${isbn}`)
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  const bookMap = Object.values(books);
  const book = await bookMap.find((book) => book.author === author);
  if (book) {
      return res.send(JSON.stringify(book), null, 4);
  } else {
      return res.send(`No Book with that author: ${author}`);
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    const bookMap = Object.values(books);
    const book = await bookMap.find((book) => book.title === title);
    if (book) {
        return res.send(JSON.stringify(book), null, 4);
    } else {
        return res.send(`No Book with that title: ${title}`);
    }
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    if(isbn in Object.keys(books)) {
        return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.send(`No Book with that ISBN: ${isbn}`)
    }
});

module.exports.general = public_users;
