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

var selectionSceneConfig = {
	key: 'selection',
	preload: selectionPreload, 
	create: selectionCreate,
	update: selectionUpdate
}

var selectionScene = new Phaser.Scene(selectionSceneConfig);

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
	scene: [selectionSceneConfig, mainSceneConfig]
}

function selectionPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/');
	this.load.image('background', 'andar-bg.png');
	this.load.image('sel-moonbyul', 'andar-selection-moonbyul.png');
	this.load.image('moonbyul', 'andar-moonbyul.png');
	this.load.image('sel-solar', 'andar-selection-solar.png');
	this.load.image('solar', 'andar-solar.png');
	this.load.image('sel-hwasa', 'andar-selection-hwasa.png');
	this.load.image('hwasa', 'andar-hwasa.png');
	this.load.image('sel-wheein', 'andar-selection-wheein.png');
	this.load.image('wheein', 'andar-wheein.png');
	this.load.image('start', 'andar-instructions.png');

	console.log("selection preload");
}

function selectionCreate(){
	var background = this.add.sprite(750,175, "background");
	createButton(this,'moonbyul', 62.5);
	createButton(this,'solar', 187.5);
	createButton(this,'wheein', 312.5);
	createButton(this,'hwasa', 437.5);
	var instructions = this.add.image(250, 175, "start");
	instructions.setInteractive();
	instructions.on('pointerup', ()=> {instructions.setActive(false);});
}

function createButton(scene, name, positionX){
	var image = scene.add.image(positionX, 175, "sel-" + name);
	var button = scene.add.rectangle(positionX, 175, 125, 350).setInteractive();
	button.on('pointerover', () => { image.setTexture(name); image.displayOriginY = 150;});
	button.on('pointerout', () => {image.setTexture('sel-' + name); image.displayOriginY = 175; });
	button.on('pointerup', () => { scene.scene.start('main', {image: name})});
}

function selectionUpdate(){

}

var game = new Phaser.Game(gameConfig);
var main;
var name = "";
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
var pointer;

function mainInit(data){
	name = data.image;
}

function mainPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/')
	this.load.image('background', 'andar-bg.png');
	this.load.image('cabinet', 'andar-cabinet.png');
	this.load.image(name, 'andar-' + name + '.png');
	this.load.image('ground', 'andar-ground.png');
}

function mainCreate(){
	main = this;
	isPaused = false;
	this.background = this.add.tileSprite(0,0, 1500, 500, "background");
	this.background.setScale(.7);
	this.background.setOrigin(0);
	this.background.setScrollFactor(0,1);
	cursors = this.input.keyboard.createCursorKeys();
	keyPress = this.input.keyboard.addKey('SPACE');
	pointer = this.input.activePointer;

	levelTimer = this.time.addEvent({
		delay: 3000, 
		callback: createCabinet, 
		loop: true
	})
	createPlayer(this);
	createGround(this);
	var cabinetLifeTimer = main.time.delayedCall(1000, createCabinet);
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
	player = game.physics.add.sprite(75, 170, name);
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
	/*if (keyPress.isDown){
		isPaused = !isPaused;
		if (isPaused)
			pause();
		else
			unpause();
	}*/

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