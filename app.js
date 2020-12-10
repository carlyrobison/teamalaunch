const express = require('express');
const app     = express();
const PORT    = process.env.PORT || 3000;
const fs = require('fs');

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
  console.log("{}{}{} serving index page");
});
app.get('/bowl', function(req, res) {
  console.log("{}{}{} serving bowl page");

  res.sendFile(__dirname + '/public/bowl.html');
});


// interaction pages
app.get('/give', function(req, res) {
	console.log("{}{}{} serving giving page");
  res.sendFile(__dirname + '/give.html');
});

// for now take a random one
app.get('/take', function(req, res) {
	console.log("{}{}{} taking");
  res.sendFile(__dirname + '/take.html');
});

// for now take a random one
app.post('/send', function(req, res) {
	console.log("{}{}{} sending");
	gapi.sendMail({email: req.email, link: 'https://drive.google.com/file/d/1BYl92BWZoAydnnBJmXfDTLGVf1WU0NDp/view?usp=sharing',
		res: res});

	console.log('{}{}{} Sent mail');
	res.redirect('/bowl');
})

// interaction pages
app.get('/loadimages', function(req, res) {
	console.log("loading images");
  gapi.updateFileList({num_results: req.query.num_results, res: res});
});

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let contribution = req.files.contribution;
  console.log('{}{}{} Intended upload of ' + contribution.name);

  // mimeType check
  // const fileSize = fs.statSync(fileName).size; // error case on too large

  // Use the mv() method to place the file somewhere on your server
  contribution.mv('./media/uploaded.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
  });

  gapi.uploadToCloud({name: contribution.name, // existing name
  	location: './media/uploaded.jpg', // temporary storage
  	mimeType: contribution.mimetype // mimetype
  });

	console.log('{}{}{} Upload of ' + contribution.name);
	res.redirect('/bowl');

	res.send('File was unable to be uploaded. Please try again.');
});

// ------------ HELPER LINKS BELOW HERE ---------------

// manual reauthing if needed
app.get('/reauth', function(req, res) {
	gapi.getReAuthUrl(req, res);
});

// trigger listing the files in the drive
app.get('/testapi', function(req, res) {
	gapi.sendMail({email: 'rodtel314@gmail.com', res: res});
});

// for the oauth flow
app.get('/oauth', function(req, res) {
	// console.log("req:", req, "\nres:", res);
	console.log("code:", req.query.code);
	gapi.oauth2Client.getToken(req.query.code, (err, token) => {
	  if (err) return console.error('Error retrieving access token(s)', err);
	  console.log("token(s):", token);
	  gapi.oauth2Client.credentials = token;
	});
	res.sendFile(__dirname + '/index.html');
});

//listens for when we want model files
app.use('/models', express.static(__dirname + '/models'));

// tell our app where to listen for connections
app.listen(PORT, function() {
  console.log('listening on PORT: ' + PORT);
});
