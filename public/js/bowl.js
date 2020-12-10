let contributions = [];
let maxContributions = 25;

var selectedContribution = -1;

function getRowCol(idx) {
	let row = Math.floor(i / contributionsPerRow);
	let col = i % contributionsPerRow;
	return row, col;
}


// data fetching fxn --------------------------------------------------------
function getImages() {
  console.log("getting images");
	$.get('/loadimages?num_results=' + maxContributions, function(data) {
		contributions = data;
		console.log("images gotten", data[0]);
		for (let i = 0; i < data.length; i++) {
			console.log(i);
			btni = `<button class="contribution">
			<div class="contribution">
			<div class="contributionImage">
			<iframe id=${i} src="https://drive.google.com/file/d/${data[i].id}/preview" 	frameborder="0" scrolling="no" 
			width="640" height="480"></iframe>
			</div>
			</div>
			</button>
			`;
			// just add 'em all
			console.log($('#bowl'))
			$('#bowl').append(btni);


		}
		
	});
	
}


$(document).ready(function() {
	// add the images
	getImages();
});

