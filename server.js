const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // For parsing application/json

// Import routes
const bookRoutes = require('./books');
const userRoutes = require('./users');

// Use routes
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
