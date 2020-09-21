var mainSceneConfig = {
	key: 'main', 
	init: mainInit,
	preload: mainPreload,
	create: mainCreate,
	update: mainUpdate,
	pack: {
		files: [
			{
				//type: 'image', key: 'mainButton', url: ''
			}
		]
	}
}

var mainScene = new Phaser.Scene(mainSceneConfig);

var startSceneConfig = {
	key: 'start',
	preload: startPreload, 
	create: startCreate,
	update: startUpdate
}

var startScene = new Phaser.Scene(startSceneConfig);

var gameConfig = {
	type: Phaser.CANVAS, 
	parent: 'gameContent',
	width: 384, 
	height: 768, 
	physics: {
		default: 'arcade', 
		arcade: {
			gravity: {y:300}, 
			debug: false
		}
	}, 
	scene: [startSceneConfig, mainSceneConfig]
}

function startPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/');
	this.load.image('selection-bg','ddunddun/ddun-selection-bg.png');
	this.load.image('selection-start','ddunddun/ddun-selection-start.png');
}

function startCreate(){

}

function startUpdate(){

}

//data variables
var game = new Phaser.Game(gameConfig);
var main;
var name = "";

//game variables
var player;
var level = 0; 
var obstacleSpawned = 0;
var levelTimer;
var timerTime;
var isPaused;
var currentVelocity = 150;

//interactivity variables
var pointer;
var keyPress;
var cursors;

//score variables
var scoreTimer;
var score = 0;
var scoreText;

function mainInit(data){
	name = data.image;
}

function mainPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/');
	this.load.image('main-bg','ddunddun/ddun-selection-bg.png');
	this.load.image('lyrics-tiles','ddunddun/ddunlyrics-black.png');
}

function mainCreate(){
	main = this;
	var lvl = createLevel();
	var map = this.make.tilemap({data:lvl, tileWidth: 32. tileHeight: 32});
	var tiles = map.addTilesetImage('lyrics-tiles');
	var layer = map.createStaticLayer(0, tiles, 0,0);
}

function createLevel(){
	var index = 0;
	var emptyLine = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
	var ultList = [];
	for (int i = 0; i < 39; i++){
		var list = []; 
		var spaceIndex = Phaser.Math.Between(0,11);
		for (int j = 0; j < 12; i++){
			if (j == spaceIndex || j == spaceIndex + 1){
				list.push(-1);
			}
			else {
				list.push(index);
				index++;
			}
		}
		ultList.push(list);
		ultList.push(emptyLine);
		ultList.push(emptyLine);

	}
	return ultList;
}

function createPlayer(game){
	player = game.physics.add.sprite(64, 64, name);
	player.setScale(.3);
	player.setCollideWorldBounds(true);
}

function mainUpdate(){
	if (isPaused)
		return;

	this.background.tilePositionX += 5;

	if (player.body.touching.down){
		if (keyPress.isDown || pointer.isDown){
			player.setVelocityY(-275);
		}
	}
	else if (player.body.touching.down){
		player.setVelocityX(0);
	}
}