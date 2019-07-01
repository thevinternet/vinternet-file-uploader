const express = require('express'),
  app     = express(),
  port    = process.env.PORT || 5000,
  path    = require('path');

app.use(express.static(path.join(__dirname, '/build')));

// app root
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

// requested views
// using regexp to match request to path
app.get(/([^\/]+)$/g, function(req, res) {
  res.sendFile(path.join(__dirname, req.path));
});

app.listen(port, function() {
  console.log('Server started on port: ' + port);
});
