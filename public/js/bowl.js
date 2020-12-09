var giveButton;
var takeButton;

var contributionSize;
var contributionPadding;
let contributionsPerRow = 4;
let contributions = 8;

var selectedContribution = -1;



// interaction fxns --------------------------------------------------------
function give() {
	window.open('/give.html');
}

function take() {
	console.log("taking:", selectedContribution);
  // httpGet('/take', function(response) {
  //   console.log(JSON.parse(response));
  // });
}

// drawing helper functions ---------------------------------------------
function drawContributions(num) {
	for (let i = 0; i < num; i++) { // todo max this
		let row = Math.floor(i / contributionsPerRow);
		let col = i % contributionsPerRow;
		console.log("drawing: ", row, col);
		drawContribution(row, col);
	}
}

function drawContribution(row, col) {
	let contributionColor = color(250, 249, 245);
  fill(contributionColor);
  noStroke();
  rect((col + 1) * contributionSize + (.1 * contributionSize), row * contributionSize + (.1 * contributionSize),
  		 .8 * contributionSize, .8 * contributionSize);
}

function drawContributionLarger(row, col) {
	let contributionColor = color(250, 249, 245);
  fill(contributionColor);
  noStroke();
  rect((col + 1) * contributionSize, row * contributionSize,
  		 contributionSize, contributionSize);
}

function redrawScene() {
	background(86, 57, 173); // color of the bowl
	
	drawContributions(contributions);
}

// Set which selection was clicked
function mousePressed() {
	console.log(mouseX, mouseY);
	if (mouseX >= contributionSize) {
		let col = Math.floor(mouseX / contributionSize) - 1;
		let row = Math.floor(mouseY / contributionSize);
		console.log("Mouse clicked at row:", row, "col:", col);
		selectedContribution = (row * contributionsPerRow + col);
		console.log("Selected contribution:", selectedContribution);

		redrawScene();
		drawContributionLarger(row, col);
	}
}



// data fetching fxn --------------------------------------------------------





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

  console.log("buttons made");

  // Draw initially
  redrawScene();

	noLoop(); // interaction based
}

// --------------------------------------------------------
function draw() {
}

