var mainSceneConfig = {
	key: 'main', 
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

var gameConfig = {
	type: Phaser.CANVAS, 
	parent: 'mainContent',
	width: 500, 
	height: 350, 
	physics: {
		default: 'arcade', 
		arcade: {
			gravity: {y:300}, 
			debug: false
		}
	},
	scene: [mainSceneConfig]
}

var game = new Phaser.Game(gameConfig);
var player;
var level; 
var levelTimer;
var timerTime;
var cursors;
var previousBackground;

function mainPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/')
	this.load.image('cabinet', 'andar-cabinet.png');
	this.load.image('moonbyul', 'andar-moonbyul.png');
	this.load.image('ground', 'andar-ground.png');
	this.load.image('background', 'andar-bg.png');
}

function mainCreate(){
	this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#f0c98e");
	var cabinet = this.add.image(200,200, 'cabinet');
	cabinet.setScale(.3);
	createPlayer(this);
	createGround(this);
	this.background = this.add.tileSprite(0,0, 1500, 500, "background")
		.setOrigin(0)
		.setScrollFactor(0,1);
	this.background.setTilePosition(this.cameras.main.scrollX);

}

function createPlayer(game){
	player = game.physics.add.sprite(75, 0, 'moonbyul');
	player.setScale(.3);
	player.setCollideWorldBounds(true);
	cursors = game.input.keyboard.createCursorKeys();
}

function createGround(game){
	var ground = game.physics.add.staticGroup();
	ground.create(250, 310, 'ground');
	game.physics.add.collider(player, ground);
}

function mainUpdate(){
	if (player.body.touching.down){
		if (cursors.up.isDown){
			player.setVelocityY(-220);
		}
	}
	else if (player.body.touching.down){
		player.setVelocityX(0);
	}
}
