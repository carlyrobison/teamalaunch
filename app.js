const express = require('express');
const app     = express();
const PORT    = process.env.PORT || 3000;


// I separated out all the messy google api stuff
var gapi = require('./apimanager');

// file uploading
const fileUpload = require('express-fileupload');
// default options
app.use(fileUpload());

// tell our app where to serve our static files (root dir)
app.use(express.static('public'));

// define a route - what happens when people visit /
app.get('/', function(req, res) {
  res.sendFile(__dirname + 'index.html');
  console.log("serving index page");
});
app.get('/bowl', function(req, res) {
  res.sendFile(__dirname + 'bowl.html');
  console.log("serving bowl page");
});


// interaction pages
app.get('/give', function(req, res) {
	console.log("giving");
  res.sendFile(__dirname + '/give.html');
});

app.get('/take', function(req, res) {
	console.log("taking");
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  console.log(req.files);

  // The name of the input field is used to retrieve the uploaded file
  let contribution = req.files.contribution;

	// TODO just go straight to the google drive api
  // Use the mv() method to place the file somewhere on your server
  contribution.mv('./media/uploaded.jpg', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

// for the oauth flow
app.get('/oauth', function(req, res) {
	console.log("req:", req);
});

//listens for when we want model files
app.use('/models',express.static(__dirname + '/models'));

// let's do the oauth thing
gapi.setupAPIConnection();

// tell our app where to listen for connections
app.listen(PORT, function() {
  console.log('listening on PORT: ' + PORT);
});
