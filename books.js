const express = require('express');
const router = express.Router();

let users = [];
let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', ISBN: '9780743273565', reviews: {} },
  { id: 2, title: '1984', author: 'George Orwell', ISBN: '9780451524935', reviews: {} },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper_Lee', ISBN: '9780061120084', reviews: {} },
  { id: 4, title: 'Moby-Dick', author: 'Herman Melville', ISBN: '9781503280786', reviews: {} }
];

// Task 1: Get the list of books available in the shop
router.get('/books', (req, res) => {
  res.json(books);
});

// Task 2: Get books based on ISBN
function findBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      const book = books.find(b => b.ISBN === isbn);
      if (book) {
        resolve(book);
      } else {
        reject('Book not found');
      }
    });
  }
  
  router.get('/books/promise/isbn/:isbn', (req, res) => {
    findBookByISBN(req.params.isbn)
      .then(book => res.json(book))
      .catch(err => res.status(404).json({ message: err }));
  });
// Task 3: Get all books by the author
router.get('/books/author/:author', (req, res) => {
  const authorBooks = books.filter(b => b.author.toLowerCase() === req.params.author.toLowerCase());
  res.json(authorBooks);
});

// Task 4: Get all books based on title
router.get('/books/title/:title', (req, res) => {
  const titleBooks = books.filter(b => b.title.toLowerCase() === req.params.title.toLowerCase());
  res.json(titleBooks);
});

// Task 5: Get a book review
router.get('/books/:isbn/review', (req, res) => {
  const book = books.find(b => b.ISBN === req.params.isbn);
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Task 6: Register new user
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully' });
});

// Task 7: Login as a registered user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(400).json({ message: 'Invalid username or password' });
  }
});

// Task 8: Add/modify a book review
router.post('/books/:isbn/review', (req, res) => {
  const { username, review } = req.body;
  const book = books.find(b => b.ISBN === req.params.isbn);
  if (book) {
    book.reviews[username] = review;
    res.json({ message: 'Review added/modified successfully' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Task 9: Delete a book review that was earlier added by that particular user
router.delete('/books/:isbn/review', (req, res) => {
  const { username } = req.body;
  const book = books.find(b => b.ISBN === req.params.isbn);
  if (book && book.reviews[username]) {
    delete book.reviews[username];
    res.json({ message: 'Review deleted successfully' });
  } else {
    res.status(404).json({ message: 'Review or book not found' });
  }
});

// Task 10: Get all books using an async callback function
function getAllBooksAsync(callback) {
  setTimeout(() => {
    callback(null, books);
  }, 1000);
}

router.get('/async-books', (req, res) => {
  getAllBooksAsync((err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving books' });
    }
    res.status(200).json(data);
  });
});

function findBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      const booksByAuthor = books.filter(b => b.author.toLowerCase() === author.toLowerCase());
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject('No books found for the specified author');
      }
    });
  }
  
  router.get('/books/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const booksByTitle = books.filter(b => b.title.toLowerCase().includes(title));
  
    if (booksByTitle.length > 0) {
      res.json(booksByTitle);
    } else {
      res.status(404).json({ message: 'No books found with the specified title' });
    }
  });
  
  router.get('/books/promise/author/:author', (req, res) => {
    findBooksByAuthor(req.params.author)
      .then(books => res.json(books))
      .catch(err => res.status(404).json({ message: err }));
  });

module.exports = router;
