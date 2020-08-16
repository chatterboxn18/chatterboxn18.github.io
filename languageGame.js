const buttonContainer = document.getElementById('options')
var reactionImage = document.getElementById('image')
var correctSound = document.getElementById('correctAudio')
var wrongSound = document.getElementById('wrongAudio')
var currentIndex = -1;
var setList = new Array();
var currentValue = "";
var words = null;

function loadGame(){
	var xmlHttp = new XMLHttpRequest();
	var data = null;
	xmlHttp.open('GET', "https://raw.githubusercontent.com/chatterboxn18/JsonFiles/master/jsons/koreanWords.json", true);
	xmlHttp.resposeType = 'json';
	xmlHttp.send();
	xmlHttp.onreadystatechange = function(){
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			data = JSON.parse(this.responseText);
			//document.getElementById('text').innerHTML = data["to-be-verbs"]["words"][0];
			words = data["to-be-verbs"];
			setupCards(words);
		}
	}
};

function setupCards(wordList){
	var length = 9;
	for (var i = 0; i < length; i++){
		var wordButton = document.createElement('button');
		wordButton.className = 'btn';
		var word = wordList["words"][i]['korean'];
		wordButton.textContent = word;
		wordButton.value = word;
		wordButton.onclick = function() { 
			if (event.srcElement.value == currentValue) 
			{
				correctSound.play();
				image.src = "mamamoo-correct.gif";
				document.getElementById('debug-text').textContent = "TRUE" + currentValue;
			}
			else {
				wrongSound.play();
				image.src = "mamamoo-wrong.png";
				document.getElementById('debug-text').textContent = "FALSE" + event.srcElement.value;
			}
		};
		buttonContainer.appendChild(wordButton);
		setList.push(i); //grab all the indexes in an array
	}
	startGame();
}

function startGame(){
	shuffle(setList);
	currentIndex = 0;
	nextWord();
}

function nextWord(){
	if (currentIndex != -1 && currentIndex < setList.length){
		image.src = "mamamoo-guess.png";
		document.getElementById('debug-text').textContent = "FALSE";
		document.getElementById('mainText').textContent = words["words"][setList[currentIndex]]['english'];
		currentValue = words["words"][setList[currentIndex]]['korean'];
		currentIndex = currentIndex+1;
	}
	else{
		//game is finished, clean array
		setList.length = 0;
		currentValue = "";
		currentIndex = -1;
		words = null;
	}
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  document.getElementById('debug-text').textContent = array;
  return array;
}


loadGame();