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
 * Get the IDs of the latest N images in the BOWL folder
 * TODO: filter by images
 * TODO: read and parse metadata
 * opts: num_results
 */
function listFiles(opts) {
// list files
  const drive = google.drive({version: 'v3'});
  drive.files.list({
    fields: 'nextPageToken, files(id, name, mimeType)',
    orderBy: 'modifiedTime desc',
    q: 'parent:1LajQ89n9DcEFY0O7cWO73VcMQ83IcTCW',
    pageSize: opts.num_results,
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err + res);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
      return files;
    } else {
      console.log('No files found.');
    }
  });
}

/**
 * Download the latest N images in the BOWL folder
 * TODO: filter by images
 * TODO: read and parse metadata
 * TODO: store locally?
 * TODO: 
 */
function downloadImages(opts) {
	// For converting document formats, and for downloading template
  // documents, see the method drive.files.export():
  // https://developers.google.com/drive/api/v3/manage-downloads
  return drive.files
    .get({fileId, alt: 'media'}, {responseType: 'stream'})
    .then(res => {
      return new Promise((resolve, reject) => {
        const filePath = path.join(os.tmpdir(), uuid.v4());
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
          .on('data', d => {
            progress += d.length;
            if (process.stdout.isTTY) {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`Downloaded ${progress} bytes`);
            }
          })
          .pipe(dest);
      });
    });


  const fileMetadata = {
  	'name': opts.name || 'photo.jpg'
	};
	const media = {
	  mimeType: 'image/jpeg', // maybe make this an opt?
	  body: fs.createReadStream(opts.location || 'media/uploaded.jpg')
	};
	drive.files.create({
	  resource: fileMetadata,
	  media: media,
	  fields: 'id'
	}, function (err, file) {
	  if (err) {
	    // Handle error
	    console.error(err);
	    return 'Upload did not work, try again.';
	  } else {
	    console.log('File Id: ', file.id);
	    // console.log('file:', file);
	    return 'Success!';
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
module.exports.listFiles = listFiles;