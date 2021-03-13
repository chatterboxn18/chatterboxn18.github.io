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

var gameConfig = {
	type: Phaser.CANVAS, 
	parent: 'gameContent',
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

//data variables
var game = new Phaser.Game(gameConfig);
var main;
var name = "";

//object variables
var radishScore = 10;
var cakeScore = 20;

//game variables
var player;
var level = 0; 
var obstacleSpawned = 0;
var isPaused;
var currentVelocity = 150;
var ground;
var numberOfItems = 3;

//interactivity variables
var pointer;
var keyPress;
var cursors;

//score variables
var scoreTimer;
var score = 0;
var scoreText;

function mainInit(data){
}

function mainPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/')
	this.load.image('background', 'andar-bg.png');
	this.load.image('player', 'player.png');
	this.load.image('item-1', 'radish.png');
	this.load.image('item-2', 'cupcake.png');
	this.load.image('ground', 'andar-ground.png');
	this.load.image('item-3', 'enemy.png');
}

function mainCreate(){
	main = this;
	isPaused = false;
	this.background = this.add.tileSprite(0,0, 1500, 500, "background");
	this.background.setScale(.7);
	this.background.setOrigin(0);
	this.background.setScrollFactor(0,1);
	cursors = this.input.keyboard.createCursorKeys();
	keyPressLeft = this.input.keyboard.addKey('LEFT');
	keyPressRight = this.input.keyboard.addKey('RIGHT');
	pointer = this.input.activePointer;
	levelTimer = this.time.addEvent({
		delay: 2000, 
		callback: createObstacle, 
		loop: true
	});
	
	scoreText = this.add.text(250, 20, "Score: " + score, {fontFamily: 'AGENCYR'}).setOrigin(0.5);
	/*scoreTimer = this.time.addEvent({
		delay: 2000,
		callback: addScore, 
		loop: true
	});*/
	createPlayer(this);
	createGround(this);

}

function addScore(){
	score += level * 10;
	scoreText.setText("Score: " + score);
}

function createObstacle(){
	var spawnNumber = Phaser.Math.Between(1,numberOfItems);
	switch (spawnNumber){
		case 1:
			createRadish();
			break;
		case 2:
			createCake();
			break;
		case 3:
			createEnemy();
			break;
		default:
			createRadish();
			break;
	}

}

function createRadish(){
	var xPoisition = Phaser.Math.Between(30,480);
	var radish = main.physics.add.sprite(xPoisition, 0, 'item-1');
	radish.setScale(.15);
	radish.body.allowGravity = false;
	radish.body.setVelocityY(100);
	main.physics.add.collider(player, radish, collectRadish, null, main);
	main.physics.add.collider(ground, radish, destroyObstacle);
}

function createCake(){
	var xPoisition = Phaser.Math.Between(30,480);
	var cake = main.physics.add.sprite(xPoisition, 0, 'item-2');
	cake.setScale(.25);
	cake.body.allowGravity = false;
	cake.body.setVelocityY(100);
	main.physics.add.collider(player, cake, collectCake, null, main);
	main.physics.add.collider(ground, cake, destroyObstacle);
}

function createEnemy(){
	var xPoisition = Phaser.Math.Between(30,480);
	var enemy = main.physics.add.sprite(xPoisition, 0, 'item-3');
	enemy.setScale(.25);
	enemy.body.allowGravity = false;
	enemy.body.setVelocityY(100);
	main.physics.add.collider(player, enemy, touchObject, null, main);
	main.physics.add.collider(ground, enemy, destroyObstacle);
}

function collectCake(player, object){
	if (player.body.touching.right || player.body.touching.down || player.body.touching.left || player.body.touching.up){
		score += cakeScore;
		scoreText.setText("Score: " + score);
		object.destroy(main);
	}
}

function collectRadish(player, object){
	if (player.body.touching.right || player.body.touching.down || player.body.touching.left || player.body.touching.up){
		score += radishScore;
		scoreText.setText("Score: " + score);
		object.destroy(main);
	}
}

function touchObject(player, object){
	if (player.body.touching.right || player.body.touching.down || player.body.touching.left || player.body.touching.up){
		pause();
		isPaused = true;
		console.log("GameOver");
	}
}

function destroyObstacle(ground, object){
	object.destroy(main);
}

function createPlayer(game){
	player = game.physics.add.sprite(200, 170, 'player');
	player.setScale(.3);
	player.setCollideWorldBounds(true);
}

function createGround(game){
	group = game.physics.add.staticGroup();
	ground = group.create(250, 310, 'ground');
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
	if (isPaused)
		return;

	//this.background.tilePositionX += 5;

	if (keyPressLeft.isDown){
		player.setVelocityX(-200);
	}
	else if (keyPressRight.isDown){
		player.setVelocityX(200);
	}
	else{
		player.setVelocityX(0);
	}
}