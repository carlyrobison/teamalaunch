const express = require('express');
const app     = express();
const PORT    = process.env.PORT || 3000;

// tell our app where to serve our static files (root dir)
app.use(express.static('public'));

// define a route - what happens when people visit /
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

//listens for when we want model files
app.use('/models',express.static(__dirname + '/models'));

// tell our app where to listen for connections
app.listen(PORT, function() {
  console.log('listening on PORT: ' + PORT);
});