// google drive apis
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// Google API stuffs
const SCOPES = ['https://www.googleapis.com/auth/drive',
'https://www.googleapis.com/auth/photoslibrary',
'https://mail.google.com/']
const TOKEN_PATH = 'token.json';
const REDIRECT_URI = 'https://give-take-ga.herokuapp.com/oauth'

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
	if (process.env.AUTH_CODE) {
		oAuth2Client.getToken(process.env.AUTH_CODE, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      console.log(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
	} else {
	  const authUrl = oAuth2Client.generateAuthUrl({
	    access_type: 'offline',
	    scope: SCOPES,
	  });
	  console.log('Authorize this app by visiting this url:', authUrl);
	  const rl = readline.createInterface({
	    input: process.stdin,
	    output: process.stdout,
	  });
	  rl.question('Enter the code from that page here: ', (code) => {
	    rl.close();
	    oAuth2Client.getToken(process.env.AUTH_CODE, (err, token) => {
	      if (err) return console.error('Error retrieving access token', err);
	      oAuth2Client.setCredentials(token);
	      // Store the token to disk for later program executions
	      console.log(token);
	      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
	        if (err) return console.error(err);
	        console.log('Token stored to', TOKEN_PATH);
	      });
	      callback(oAuth2Client);
	    });
    });
	}
}



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(callback) {
  const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID, process.env.CLIENT_SECRET, REDIRECT_URI);

  // Check if we have previously stored a token.
  if (!process.env.ACCESS_TOKEN) {
  	return getAccessToken(oAuth2Client, callback);
  } else {
  	oAuth2Client.setCredentials(process.env.ACCESS_TOKEN);
    callback(oAuth2Client);
  }
}

function setupAPIConnection() {
	// Authorize a client with credentials, then call the Google Drive API.
	authorize(listFiles);
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err + res);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}

module.exports.setupAPIConnection = setupAPIConnection;