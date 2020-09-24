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
			gravity: {y:500}, 
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
var player;

var lyricLines;
var tileLines;
var tileCollider;
var totalCharacters;

var cursors;

function mainInit(data){
	name = data.image;
}

function mainPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/');
	this.load.image('main-bg','ddunddun/ddun-selection-bg.png');
	this.load.image('lyrics-tiles','ddunddun/ddunlyrics-black.png');
	this.load.image('block-tiles','ddunddun/tilesheets/blocks-tile.png');
	this.load.image('solar','ddunddun/sprite.png');
	totalCharacters = 368;
}

function mainCreate(){
	main = this;
	var background = this.add.sprite(0,0, 'selection-bg').setOrigin(0);
	var lvl = createLevel();
	var map = this.make.tilemap({data:lvl, tileWidth: 32, tileHeight: 32});
	var tiles = map.addTilesetImage('lyrics-tiles');
	lyricLines = map.createStaticLayer(0, tiles, 0,0);
	lyricLines.setPosition(0, 300);
	player = createPlayer();
	main.physics.add.collider(player, tileLines);
	cursors = this.input.keyboard.createCursorKeys();
}

function createLevel(){
	var index = 0;
	var tileList = [];
	var emptyLine = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
	var ultList = [];
	for (var i = 0; i < (totalCharacters/10) + 1; i++){
		var list = []; 
		var tList = [];
		var spaceIndex = Phaser.Math.Between(0,11);
		var tileType = Phaser.Math.Between(0,1);
		for (var j = 0; j < 12; j++){
			if (j == spaceIndex || j == spaceIndex + 1){
				tList.push(-1);
				list.push(-1);
			}
			else if (j == 0 || j == spaceIndex + 2){
				tileType == 0? tList.push(3) : tList.push(0);
				list.push(index);
				index++;
			}
			else if (j == spaceIndex-1 || j == 11){
				tileType == 0? tList.push(5) : tList.push(2);
				list.push(index);
				index++;
			}
			else {
				tileType == 0? tList.push(4) : tList.push(1);
				list.push(index);
				index++;
			}
		}
		ultList.push(list);
		ultList.push(emptyLine);
		ultList.push(emptyLine);
		tileList.push(tList);
		tileList.push(emptyLine);
		tileList.push(emptyLine);
	}
	var map = main.make.tilemap({data: tileList, tileWidth: 32, tileHeight:32});
	var tiles = map.addTilesetImage('block-tiles');
	tileLines = map.createStaticLayer(0, tiles, 0,0);
	tileLines.setPosition(0,300);
	tileLines.setCollisionBetween(0,100);
	return ultList;
}

function createPlayer(){
	player = main.physics.add.sprite(16, 0, 'solar');
	player.setCollideWorldBounds(true);
	return player;
}

function mainUpdate(){
	var lastPos = lyricLines.y;
	if (lastPos > -1 * lyricLines.height + gameConfig.height)
	{
		lyricLines.setPosition(0, lastPos - 1);
		tileLines.setPosition(0,lastPos -1);
	}
	if (cursors.right.isDown){
		player.setVelocityX(300);
	}
	else if (cursors.left.isDown){
		player.setVelocityX(-300);
	}
	else{
		player.setVelocityX(0);
	}
}