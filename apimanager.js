// google drive apis
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// Google API stuffs
const SCOPES = ['https://www.googleapis.com/auth/drive',
'https://www.googleapis.com/auth/photoslibrary',
'https://mail.google.com/']
const REDIRECT_URI = 'https://give-take-ga.herokuapp.com/oauth'



oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({
	refresh_token: process.env.REFRESH_TOKEN
});

// set auth as a global default
google.options({
  auth: oauth2Client
});

/**
 * Return an auth URL (in case we mess up and need to do it again)
 */
function getReAuthUrl(req, res) {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES.join(' '),
    });
    console.log('Authorize this app by visiting this url:', authorizeUrl);
    res.send('Authorize this app by visiting this url: ' + authorizeUrl);
}

function runSample() {
  // list files
  const drive = google.drive({version: 'v3'});
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

module.exports.runSample = runSample;
module.exports.oauth2Client = oauth2Client;
module.exports.getReAuthUrl = getReAuthUrl;
