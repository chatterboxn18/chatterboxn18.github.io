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
	width: 600, 
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

function mainPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/')
	this.load.image('cabinet', 'andar-cabinet.png');
	this.load.image('moonbyul', 'andar-moonbyul.png');
}

function mainCreate(){
	var cabinet = this.add.image(200,200, 'cabinet');
	cabinet.setScale(.3);
	createPlayer(this);
}

function createPlayer(game){
	player = game.physics.add.sprite(50, 0, 'moonbyul');
	player.setScale(.3);
	player.setCollideWorldBounds(true);
	cursors = game.input.keyboard.createCursorKeys();
}

function mainUpdate(){
	if (player.body.touching.down){
		if (cursors.up.isDown){
			player.setVelocityY(-350);
		}
	}
	else if (player.body.touching.down){
		player.setVelocityX(0);
	}
}
