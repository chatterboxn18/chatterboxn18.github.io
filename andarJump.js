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
var main;
var player;
var level = 0; 
var cabinetsSpawned = 0;
var levelTimer;
var timerTime;
var cursors;
var keyPress;
var previousBackground;
var isPaused;
var currentVelocity = 150;

function mainPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/')
	this.load.image('background', 'andar-bg.png');
	this.load.image('cabinet', 'andar-cabinet.png');
	this.load.image('moonbyul', 'andar-moonbyul.png');
	this.load.image('ground', 'andar-ground.png');
}

function mainCreate(){
	main = this;
	isPaused = false;
	this.background = this.add.tileSprite(0,0, 1500, 500, "background")
	this.background.setScale(.7);
	this.background.setOrigin(0);
	this.background.setScrollFactor(0,1);
	cursors = this.input.keyboard.createCursorKeys();
	keyPress = this.input.keyboard.addKey('P');

	levelTimer = this.time.addEvent({
		delay: 3000, 
		callback: createCabinet, 
		loop: true
	})
	createPlayer(this);
	createGround(this);
	createCabinet();
}

function createCabinet(){
	if (cabinetsSpawned%5 == 0){
		level += 1;
		if (currentVelocity < 250){
			currentVelocity += 10;
		}
		if (levelTimer.delay >2000){
			levelTimer.delay -= 200;
		}
		console.log("Leveled up: " + currentVelocity + " "  + levelTimer.delay);
	}
	var cabinet = main.physics.add.sprite(530, 235, 'cabinet');
	cabinet.setScale(.25);
	cabinet.body.allowGravity = false;
	cabinet.body.setVelocityX(-currentVelocity);
	cabinet.body.onWorldBounds = true;
	main.physics.add.collider(player, cabinet, touchObject, null, main);
	var cabinetLifeTimer = main.time.delayedCall(5000, destroyCabinet, [cabinet]);
	cabinetsSpawned++; 
}

function touchObject(player, object){
	if (player.body.touching.right || player.body.touching.up || player.body.touching.left){
		pause();
		isPaused = true;
		console.log("GameOver");
	}
}

function destroyCabinet(cabinet){
	cabinet.destroy(main);
}

function createPlayer(game){
	player = game.physics.add.sprite(75, 0, 'moonbyul');
	player.setScale(.3);
	player.setCollideWorldBounds(true);
}

function createGround(game){
	var ground = game.physics.add.staticGroup();
	ground.create(250, 310, 'ground');
	game.physics.add.collider(player, ground);
}

function pause(){
	console.log("paused");
	main.physics.pause();
	levelTimer.paused = true;
}

function unpause(){
	console.log("unpaused");
	main.physics.resume();
	levelTimer.paused = false;
}

function mainUpdate(){
	if (keyPress.isDown){
		isPaused = !isPaused;
		if (isPaused)
			pause();
		else
			unpause();
	}

	if (isPaused)
		return;

	this.background.tilePositionX += 5;

	if (player.body.touching.down){
		if (cursors.up.isDown){
			player.setVelocityY(-275);
		}
	}
	else if (player.body.touching.down){
		player.setVelocityX(0);
	}
}
