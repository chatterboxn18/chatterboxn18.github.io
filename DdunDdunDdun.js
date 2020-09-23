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
	var background = this.add.sprite(0,0, 'selection-bg').setOrigin(0);
	var image = this.add.image(192, 384, 'selection-start').setOrigin(0.5);
	image.setInteractive();
	image.on('pointerup', () => { this.scene.start('main')});
}

function startUpdate(){

}

//data variables
var game = new Phaser.Game(gameConfig);
var main;
var name = "";

var lyricLines;

function mainInit(data){
	name = data.image;
}

function mainPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/');
	this.load.image('main-bg','ddunddun/ddun-selection-bg.png');
	this.load.image('lyrics-tiles','ddunddun/ddunlyrics-black.png');
	this.load.image('block-tiles','ddunddun/tilesheets/blocks-tile.png');
}

function mainCreate(){
	main = this;
	var background = this.add.sprite(0,0, 'selection-bg').setOrigin(0);
	var lvl = createLevel();
	var map = this.make.tilemap({data:lvl, tileWidth: 32, tileHeight: 32});
	var tiles = map.addTilesetImage('lyrics-tiles');
	lyricLines = map.createStaticLayer(0, tiles, 0,0);
	lyricLines.setPosition(0, 300);
}

function createLevel(){
	var index = 0;
	var tileList = [];
	var emptyLine = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
	var ultList = [];
	for (var i = 0; i < 39; i++){
		var list = []; 
		var tList = [];
		var spaceIndex = Phaser.Math.Between(0,11);
		for (var j = 0; j < 12; j++){
			if (j == spaceIndex || j == spaceIndex + 1){
				tList.push(-1);
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
		tileList.push(list);
		tileList.push(emptyLine);
		tileList.push(emptyLine);

		var map = main.make.tilemap({data: tileList, tileWidth: 32, tileHeight:32});
		var tiles = map.addTilesetImage('block-tiles');
		var lines = map.createStaticLayer(0, tiles, 0,0);
		lines.setPosition(0,300);

	}
	return ultList;
}

function createPlayer(game){
	player = game.physics.add.sprite(64, 64, name);
	player.setScale(.3);
	player.setCollideWorldBounds(true);
}

function mainUpdate(){
	var lastPos = lyricLines.y;
	if (lastPos > -1 * lyricLines.height + gameConfig.height)
		lyricLines.setPosition(0, lastPos - 3);
	/*if (isPaused)
		return;

	this.background.tilePositionX += 5;

	if (player.body.touching.down){
		if (keyPress.isDown || pointer.isDown){
			player.setVelocityY(-275);
		}
	}
	else if (player.body.touching.down){
		player.setVelocityX(0);
	}*/
}