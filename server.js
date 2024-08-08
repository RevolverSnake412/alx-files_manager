const express = require('express');
const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // To parse JSON bodies
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
