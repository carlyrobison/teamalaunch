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
			btni = `
			<div id="contribution">
			<iframe src="https://drive.google.com/file/d/${data[i].id}/preview" 	frameborder="0" scrolling="no" 
			width="640" height="480"></iframe>
			</div>
			`;
			// just add 'em all
			$('#bowl').append(btni);

		}
		
	});
	
}

// interaction fxns --------------------------------------------------------

// function take() {
// 	console.log("taking:", selectedContribution);
//   $.get('/take', function(response) {
//     console.log(JSON.parse(response));
//   });
// }

// Set which selection was clicked
function mousePressed() {

}


$(document).ready(function() {
	// add the images
	getImages();

	// // link the take button to a click
	// $('#take').click(function() {
	// 	alert('clicked!');
	// 	$('div.contribution-big').addClass("div.contribution");
	// 	$('div.contribution-big').removeClass("div.contribution-big");
	// 	$(this).addClass("div.contribution-big");
	// 	$(this).removeClass("div.contribution-big");
	// 	console.log($(this).id);
 //  });

 //  // make the other buttons clickable too
	// $('.contribution').click(function() {
	// 	alert('clicked!');
	// 	$('div.contribution-big').addClass("div.contribution");
	// 	$('div.contribution-big').removeClass("div.contribution-big");
	// 	$(this).addClass("div.contribution-big");
	// 	$(this).removeClass("div.contribution-big");
	// 	console.log($(this).id);
	// 	selectedContribution = this.id;
	// 	console.log(selectedContribution);
 //  });

});

