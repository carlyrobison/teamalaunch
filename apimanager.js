// google drive apis
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// Google API stuffs
const SCOPES = ['https://www.googleapis.com/auth/drive',
'https://www.googleapis.com/auth/photoslibrary',
'https://mail.google.com/']
const REDIRECT_URI = 'https://give-take-ga.herokuapp.com/oauth'
const drive = google.drive('v3');
const gmail = google.gmail('v1');
const BOWL_FOLDER_ID = '1LajQ89n9DcEFY0O7cWO73VcMQ83IcTCW'
const TAKEN_FOLDER_ID = '1R28PnSZ6wi7g0zO2FZGJ1odupXOVutkA'


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

/**
 * Upload a file to the cloud
 * Returns the id if successful, and an error or blank id if not.
 */
function uploadToCloud(opts) {
  const fileMetadata = {
  	'name': opts.name || 'photo.jpg',
  	parents: [BOWL_FOLDER_ID]
	};
	const media = {
		mimeType: opts.mimeType,
	  body: fs.createReadStream(opts.location || 'media/uploaded.jpg')
	};
	drive.files.create({
	  resource: fileMetadata,
	  media: media,
	  fields: 'id'
	}, (err, file) => {
	  if (err) {
	    // Handle error by logging
	    console.error(err);
	  } else {
	  	console.log(file.data.id);
	  }
	});
}

/**
 * Download AN IMAGE how hard can this be
 */
function downloadImage(imgI) {
	return drive.files
    .get({fileId: imgI.id, alt: 'media'}, {responseType: 'stream'})
    .then(res => {
      return new Promise((resolve, reject) => {
        const filePath = './public/media/' + imgI.id + imgI.name;
        console.log(`writing to ${filePath}`);
        const dest = fs.createWriteStream(filePath);
        let progress = 0;

        res.data
          .on('end', () => {
            console.log('Done downloading file.');
            resolve(filePath);
          })
          .on('error', err => {
            console.error('Error downloading file.');
            reject(err);
          })
          .pipe(dest);
      });
    });
}

/**
 * SendMail
 */
function sendMail(opts) {
	opts.email

// You can use UTF-8 encoding for the subject using the method below.
  // You can also just use a plain string if you don't need anything fancy.
  const subject = 'Your image from Give & Take';
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    'From: Give & Take <giveandtakega2020@gmail.com>',
    `To: <${opts.email}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    `Here's the link to your image: ${opts.link}`,
  ];
  const message = messageParts.join('\n');

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  }, (err, res) => {
  	if (err) {
  		console.log('The API returned an error: ' + err + res);
    	opts.res.error('API error');
  	} else {
  		console.log(res.data);
  		opts.res.send(res.data);
  	}
  });
}

/**
 * Get the IDs of the latest N images in the BOWL folder
 * TODO: filter by images
 * TODO: read and parse metadata
 * opts: num_results
 */
function updateFileList(opts) {
// list files
  drive.files.list({
    fields: 'files(id, name, webViewLink)',
    orderBy: 'modifiedTime desc',
    q: "'" + BOWL_FOLDER_ID + "' in parents",
    pageSize: opts.max_results || 24,
  }, (err, res) => {
    if (err) {
    	console.log('The API returned an error: ' + err + res);
    	opts.res.error('API error');
    }
    const files = res.data.files;
    if (files.length) {
      console.log('Files:', files.length);
      // files.map((file) => {
      //   console.log(`${file.name} (${file.id})`);
      // });
      	opts.res.send(files);
    } else {
      console.log('No files found.');
      opts.res.error('No files found');
    }
  });
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
module.exports.uploadToCloud = uploadToCloud;
module.exports.updateFileList = updateFileList;
module.exports.sendMail = sendMail;