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
	width: 600, 
	height: 400, 
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
	this.load.setBaseURL('https://moomooarcade.s3-us-west-1.amazonaws.com/');
	this.load.image('game-start','dinga/dinga-start-button.png');
	this.load.image('selection-bg', 'dinga/dinga-start.png');
}

function startCreate(){
	var background = this.add.sprite(0,0, 'selection-bg').setOrigin(0);
	var play = this.add.image(300, 380, 'game-start').setOrigin(0.5);
	play.setInteractive();
	play.on('pointerup', () => { play.destroy(this); this.scene.start('main');});
	play.on('pointerover', () => { play.setScale(1.1);});
	play.on('pointerout', () => { play.setScale(1.0);});
}

function startUpdate(){

}

//data variables
var game = new Phaser.Game(gameConfig);
var main;

var skateTest;

function mainInit(data){
	name = data.image;
}

function mainPreload(){
	this.load.setBaseURL('https://moomooarcade.s3-us-west-1.amazonaws.com/');
	this.load.image('main-bg','dinga/dinga-background.png');
	this.load.image('dinga-shoe-1', 'dinga/dinga-shoe-1.png');
	this.load.image('dinga-shoe-2', 'dinga/dinga-shoe-2.png');
    this.load.image('dinga-shoe-3', 'dinga/dinga-shoe-3.png');
    this.load.image('dinga-shoe-4', 'dinga/dinga-shoe-4.png');
    this.load.image('dinga-shoe-5', 'dinga/dinga-shoe-5.png');
    this.load.image('dinga-shoe-6', 'dinga/dinga-shoe-6.png');
    this.load.image('dinga-shoe-7', 'dinga/dinga-shoe-7.png');
    this.load.image('dinga-shoe-8', 'dinga/dinga-shoe-8.png');
    this.load.image('dinga-shoe-9', 'dinga/dinga-shoe-9.png');
    this.load.image('dinga-shoe-10', 'dinga/dinga-shoe-10.png');
    this.load.image('dinga-shoe-11', 'dinga/dinga-shoe-11.png');
    this.load.image('dinga-shoe-12', 'dinga/dinga-shoe-12.png');
}

function mainCreate(){
	main = this;

	//create Background
	background = this.add.image(300,200,'main-bg').setOrigin(0.5);

	var Skate = new Phaser.Class({
		Extends: Phaser.GameObjects.Sprite, 

		initialize:

		function Skate(scene, x, y, index){
			this.sprite = scene.add.sprite(x,y, 'dinga-shoe-' + index);
			this.sprite.setInteractive();
			scene.input.setDraggable(this.sprite);
			scene.input.topOnly = true; 
			scene.input.on('drag', function(pointer, gameObject, dragX, dragY){
				gameObject.x = dragX;
				gameObject.y = dragY;
			});
		}
	});

	skateTest = new Skate(this, 300,200, 1);

}


function mainUpdate(){
	
}