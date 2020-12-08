var giveButton;
var takeButton;

var contributionSize;
var contributionPadding;
let contributionsPerRow = 4;
let contributions = 8;

var selectedContribution = -1;



// interaction fxns --------------------------------------------------------
function give() {
  console.log("giving:", selectedContribution);
  // httpGet('/give', function(response) {
  //   console.log(JSON.parse(response));
  // });
}

function take() {
	console.log("taking:", selectedContribution);
  // httpGet('/take', function(response) {
  //   console.log(JSON.parse(response));
  // });
}

// Set which selection was clicked
function mousePressed() {
	console.log(mouseX, mouseY);
	if (mouseX >= contributionSize) {
		let col = Math.floor(mouseX / contributionSize);
		let row = Math.floor(mouseY / contributionSize);
		console.log("Mouse clicked at row:", row, "col:", col);
		selectedContribution = (row * contributionsPerRow + col);
		console.log("Selected contribution:", selectedContribution);

		drawContributions(contributions);
		drawContributionLarger(row, col);
	}
}

// data fetching fxn --------------------------------------------------------

// bowl {
// 	background: purple;
// 	border-radius: 40%;
// 	height: 80vw;
// 	width: 80vw;
// }


// drawing helper functions ---------------------------------------------
function drawContributions(num) {
	for (let i = 0; ++i; i < num) { // todo max this
		row = Math.floor(i / contributionsPerRow);
		col = i % contributionsPerRow;
		drawContribution(row, col);
	}
}

function drawContribution(row, col) {
	contributionColor = color(250, 249, 245);
  fill(contributionColor);
  noStroke();
  rect((row + 1) * contributionSize, col * contributionSize,
  		 .9 * contributionSize, .9 * contributionSize);
}

function drawContributionLarger(row, col) {
	let contributionColor = color(250, 249, 245);
  fill(contributionColor);
  noStroke();
  rect((row + 1) * contributionSize, col * contributionSize,
  		 contributionSize, contributionSize);
}


function setup() {
  console.log(windowWidth, windowHeight);
  cnv = createCanvas(windowWidth, windowHeight);
  contributionSize = windowWidth/(contributionsPerRow + 1);
  console.log("contribution size:", contributionSize);
  
  // setup a button (requires p5.dom library, see index.html)
  giveButton = createButton('GIVE');
  giveButton.position(20, 1 * (windowHeight / 5));
  giveButton.id('give-btn');
  giveButton.mousePressed(give);
  takeButton = createButton('TAKE');
  takeButton.position(20, 2 * (windowHeight / 5));
  takeButton.id('take-btn');
  takeButton.mousePressed(take);


  // Draw initially
  background(255);

  // draw bowl
  fill(86, 57, 173);
  let bowlSize = min((contributionsPerRow * contributionSize), windowHeight);
  ellipse(contributionSize + bowlSize / 2, 10 + bowlSize/2, bowlSize - 40, bowlSize - 20);

  // drawContributions(contributions);

	noLoop(); // interaction based
}

// --------------------------------------------------------
function draw() {
}

