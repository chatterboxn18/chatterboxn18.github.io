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

var gameType;

function startPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/');
	this.load.image('selection-bg','ddunddun/ddun-selection-bg.png');
	this.load.image('selection-start','ddunddun/en-play.png');
	this.load.image('lyrics','ddunddun/en-lyrics.png');
	this.load.image('player1','ddunddun/en-player1.png');
	this.load.image('player2','ddunddun/en-player2.png');
}

function startCreate(){
	var background = this.add.sprite(0,0, 'selection-bg').setOrigin(0);
	var lyrics = this.add.image(200, 430, 'lyrics').setOrigin(0.5);
	lyrics.setInteractive();
	lyrics.on('pointerup', () => { gameType = 'lyrics'; this.scene.start('main'); lyrics.destroy(this); if (play) play.destroy(this);});
	lyrics.on('pointerover', () => { lyrics.setScale(1.1);});
	lyrics.on('pointerout', () => { lyrics.setScale(1.0);});
	var play = this.add.image(200, 380, 'selection-start').setOrigin(0.5);
	play.setInteractive();
	play.on('pointerup', () => { playerMenu(this); play.destroy(this); if (lyrics) lyrics.destroy(this);});
	play.on('pointerover', () => { play.setScale(1.1);});
	play.on('pointerout', () => { play.setScale(1.0);});
}

function playerMenu(scene){
	var player1 = scene.add.image(195, 380, 'player1');
	player1.setInteractive();
	player1.on('pointerup', () => { 
		gameType = '1Player';
		scene.scene.start('main');
	});
	player1.on('pointerover', () => { player1.setScale(1.1);});
	player1.on('pointerout', () => { player1.setScale(1.0);});
	var player2 = scene.add.image(195, 430, 'player2');
	player2.setInteractive();
	player2.on('pointerup', () => { 
		gameType = '2Player';
		scene.scene.start('main');
	});
	player2.on('pointerover', () => { player2.setScale(1.1);});
	player2.on('pointerout', () => { player2.setScale(1.0);});
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
var cursors2;

var scoreText;
var score = 0;

var background;

var lyrics;

var isTwoPlayer = false;

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
    this.load.image('lyrics-sheet', 'ddunddun/lyrics.png');
    this.load.spritesheet('solar', 'ddunddun/ddun-sprites.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('moonbyul', 'ddunddun/ddun-mb-sprites.png', { frameWidth: 32, frameHeight: 32 });
	totalCharacters = 380;
}

function mainCreate(){
	main = this;

	//create Background
	background = this.add.tileSprite(0,0, 384, 1536, "main-bg");
	background.setOrigin(0);
	background.setScrollFactor(0,1);

	if (gameType == 'lyrics'){

		lyrics = this.add.tileSprite(0,0,384,1880,'lyrics-sheet');
		lyrics.setOrigin(0);
		lyrics.setScrollFactor(0,1);

		cursors = this.input.keyboard.createCursorKeys();


		return;
	}

	var lvl = createLevel();
	var map = this.make.tilemap({data:lvl, tileWidth: 32, tileHeight: 32});
	var tiles = map.addTilesetImage('lyrics-tiles');
	lyricLines = map.createStaticLayer(0, tiles, 0,0);
	lyricLines.setPosition(0, 300);
	
	var Player = new Phaser.Class({

		initialize:

		function Player(scene, x, y, name){
			this.scene = scene;
			this.character = scene.physics.add.sprite(x, y, name, '#FFFFFF', {restitution: 1, friction: 1});
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
			this.character.play(this.name + '-left');
			this.character.setVelocityX(-1 * this.movementSpeed);
		},

		moveRight: function(){
			this.character.play(this.name + '-right');
			this.character.setVelocityX(this.movementSpeed);
		},

		stopped: function(isTileCollision){
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
			if (this.character.body.blocked.down)
			{
				this.character.setVelocityY(-275);
			}
		},

		gameOver: function(){
			this.character.destroy(this.scene);
		}

	});

	var startingX = 32;
	if (gameType == '2Player') startingX = gameConfig.width -32;
	player1 = new Player(this, startingX,32, 'solar');
	main.physics.add.collider(player1, tileLines);

	if (gameType == '2Player'){
		player2 = new Player(this, 32, 32, 'moonbyul');
		main.physics.add.collider(player2, tileLines);
	}

	cursors = this.input.keyboard.createCursorKeys();
	cursors2 = this.input.keyboard.addKeys(
		{
			up:Phaser.Input.Keyboard.KeyCodes.W,
			down:Phaser.Input.Keyboard.KeyCodes.S,
			left:Phaser.Input.Keyboard.KeyCodes.A,
			right:Phaser.Input.Keyboard.KeyCodes.D
		});
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

		if (gameType == '2Player'){
			var coin2 = main.physics.add.sprite((12-randomX) * 32 + 16, i * 32 * 4 + 256, 'mb-coin');
			main.physics.add.collider(player2, coin2, collectCoins, null, main);
			main.physics.add.collider(coin2, coin);
			main.physics.add.collider(coin2, tileLines);
		}
	}
}

function collectCoins(player, coin){
	coin.destroy(main);
	score++;
	var total = 0;
	if (gameType == '2Player') 
		total = totalCharacters/5;
	else
		total = totalCharacters/10;
	scoreText.setText( "재미 웃음 포인트: " + score + "/" + total);
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
	console.log(tileList);
	var map = main.make.tilemap({data: tileList, tileWidth: 32, tileHeight:32});
	var tiles = map.addTilesetImage('block-tiles');
	tileLines = map.createStaticLayer(0, tiles, 0,0);
	tileLines.setPosition(0,300);
	tileLines.setCollisionByExclusion([-1]);
	return ultList;
}

function mainUpdate(){
	if (gameType == 'lyrics'){
		if (cursors.down.isDown && lyrics.tilePositionY < 1400)
		{
			lyrics.tilePositionY += 2;
		}
		else if (cursors.up.isDown && lyrics.tilePositionY > 0){
			lyrics.tilePositionY -= 2;
		}
		background.tilePositionY += 1.2;
		return;
	}
	if (player1.character.y < 5){
		console.log("lose");
		player1.gameOver();
		if (gameType == '2Player')
			player2.gameOver();
		return;
	}

	if (gameType == '2Player'){
		if (player2.character.y < 5){
			console.log("lose");
			player1.gameOver();
			player2.gameOver();
			return;
		}	
	}
	
	background.tilePositionY += 1.2;

	var lastPos = lyricLines.y;
	if (lastPos > -1 * lyricLines.height + gameConfig.height)
	{
		lyricLines.setPosition(0, lastPos - 1.2);
		tileLines.setPosition(0,lastPos -1.2);
	}

	//player 1
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

	if (gameType == '2Player'){
		if (cursors2.up.isDown){
			player2.jump();
		}
		if (cursors2.right.isDown){
			player2.moveRight();
		}
		else if (cursors2.left.isDown){
			player2.moveLeft();
		}
		else{
			player2.stopped(true);
		}
	}
}