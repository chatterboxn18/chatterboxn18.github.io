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
	height: 512, 
	physics: {
		default: 'arcade', 
		arcade: {
			gravity: {y:400}, 
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
	var image = this.add.image(200, 390, 'selection-start').setOrigin(0.5);
	image.setInteractive();
	image.on('pointerup', () => { this.scene.start('main')});
}

function startUpdate(){

}

//data variables
var game = new Phaser.Game(gameConfig);
var main;
var name = "";
var player1;
var player2;

var lyricLines;
var tileLines;
var tileCollider;
var totalCharacters;

var cursors;

var scoreText;
var score = 0;

var background;

function mainInit(data){
	name = data.image;
}

function mainPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/');
	this.load.image('main-bg','ddunddun/ddun-main-bg.png');
	this.load.image('lyrics-tiles','ddunddun/ddunlyrics-black.png');
	this.load.image('block-tiles','ddunddun/tilesheets/blocks-tile.png');
    this.load.image('solar-coin', 'ddunddun/solar-coin.png');
    this.load.image('mb-coin', 'ddunddun/mb-coin.png');
    this.load.spritesheet('solar', 'ddunddun/ddun-sprites.png', { frameWidth: 32, frameHeight: 32 });
	totalCharacters = 380;
}

function mainCreate(){
	main = this;

	//create Background
	background = this.add.tileSprite(0,0, 384, 1536, "main-bg");
	background.setOrigin(0);
	background.setScrollFactor(0,1);

	var lvl = createLevel();
	var map = this.make.tilemap({data:lvl, tileWidth: 32, tileHeight: 32});
	var tiles = map.addTilesetImage('lyrics-tiles');
	lyricLines = map.createStaticLayer(0, tiles, 0,0);
	lyricLines.setPosition(0, 300);
	
	var Player = new Phaser.Class({

		initialize:

		function Player(scene, x, y, name){
			this.scene = scene;
			this.character = scene.physics.add.sprite(32, 32, name, 'FFFFFF', {restitution: 1, friction: 1});
			this.name = name;
			scene.anims.create({
		        key: this.name + '-right',
		        frames: scene.anims.generateFrameNumbers(name, { start: 2, end: 3 }),
		        frameRate: 5,
		        repeat: -1
	    	});
	   		scene.anims.create({
		        key: this.name + '-left',
		        frames: scene.anims.generateFrameNumbers(name, { start: 0, end: 1 }),
		        frameRate: 5,
		        repeat: -1
	    	});

	   		this.active = false;

	    	this.body = this.character.body;
	    	this.body.setSize(10,32);
	    	this.body.setOffset(10, 0);

	    	//collision checks
	    	this.body.setCollideWorldBounds(true);
	    	this.body.checkCollision.left = true;
	    	this.body.checkCollision.right = true;

	    	this.jumpSpeed = -275;
	    	this.movementSpeed = 200;
		},

		update: function() {

		},

		moveLeft: function(){
			console.log("left");
			this.character.play(this.name + '-left');
			this.character.setVelocityX(-1 * this.movementSpeed);
		},

		moveRight: function(){
			console.log("right");
			this.character.play(this.name + '-right');
			this.character.setVelocityX(this.movementSpeed);
		},

		stopped: function(isTileCollision){
			console.log("stop");
			if (isTileCollision) {
				if (this.body.blocked.down){
					this.character.setVelocityX(0);
				}
			}
			else{
				if (this.body.touching.down){
					this.character.setVelocityX(0);
				}
			}
		}, 

		jump: function(){
			console.log("jump");
			if (this.character.body.blocked.down)
			{
				this.character.setVelocityY(-275);
			}
		},

		gameOver: function(){
			this.character.destroy(this.scene);
		}

	});

	player1 = new Player(this, 32,32, 'solar');

	main.physics.add.collider(player1, tileLines);
	cursors = this.input.keyboard.createCursorKeys();
	createCoins();

	scoreText = this.add.text(32,32, "재미 웃음 포인트: " + score + "/" + totalCharacters/10);
	scoreText.setColor("#000000");
}

function createCoins(){
	for (var i = 0; i < totalCharacters/10; i++){
		var randomX = Phaser.Math.Between(0,11);
		var coin = main.physics.add.sprite(randomX * 32 + 16, i * 32 * 4 + 256, 'solar-coin');
		main.physics.add.collider(player1, coin, collectCoins, null, main);
		main.physics.add.collider(coin, tileLines);
	}
}

function collectCoins(player, coin){
	coin.destroy(main);
	score++;
	scoreText.setText( "재미 웃음 포인트: " + score + "/" + totalCharacters/10);
}

function createLevel(){
	var index = 0;
	var tileList = [];
	var emptyLine = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
	var ultList = [];
	for (var i = 0; i < (totalCharacters/10) + 1; i++){
		var list = []; 
		var tList = [];
		var spaceIndex = Phaser.Math.Between(0,10);
		var tileType = Phaser.Math.Between(0,2);
		for (var j = 0; j < 12; j++){
			if (j == spaceIndex || j == spaceIndex + 1){
				tList.push(-1);
				list.push(-1);
			}
			else if (j == 0 || j == spaceIndex + 2){
				tList.push(tileType * 3);
				list.push(index);
				index++;
			}
			else if (j == spaceIndex-1 || j == 11){
				tList.push(tileType * 3+ 2);
				list.push(index);
				index++;
			}
			else {
				tList.push(tileType * 3+ 1);
				list.push(index);
				index++;
			}
		}
		ultList.push(emptyLine);
		ultList.push(emptyLine);
		ultList.push(emptyLine);
		ultList.push(list);
		var randomTile = Phaser.Math.Between(0,11);
		var walkingLine = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
		if (list[randomTile] != -1) walkingLine[randomTile] = 9;
		tileList.push(emptyLine);
		tileList.push(emptyLine);
		tileList.push(walkingLine);
		tileList.push(tList);
		
	}
	var map = main.make.tilemap({data: tileList, tileWidth: 32, tileHeight:32});
	var tiles = map.addTilesetImage('block-tiles');
	tileLines = map.createStaticLayer(0, tiles, 0,0);
	tileLines.setPosition(0,300);
	tileLines.setCollisionByExclusion([-1]);
	return ultList;
}

function mainUpdate(){
	if (player1.character.y < 5){
		console.log("lose");
		player1.gameOver();
		return;
	}

	background.tilePositionY += 1.2;

	var lastPos = lyricLines.y;
	if (lastPos > -1 * lyricLines.height + gameConfig.height)
	{
		lyricLines.setPosition(0, lastPos - 1.2);
		tileLines.setPosition(0,lastPos -1.2);
	}
	if (cursors.up.isDown){
		player1.jump();
	}
	if (cursors.right.isDown){
		player1.moveRight();
	}
	else if (cursors.left.isDown){
		player1.moveLeft();
	}
	else{
		player1.stopped(true);
	}
}