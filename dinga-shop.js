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
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/');
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

var skates;

var client1;

var selectedValue = null; 

function mainInit(data){
	name = data.image;
}

function mainPreload(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/');
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
    this.load.image('dinga-client', 'dinga/dinga-client.png');
}

function mainCreate(){
	main = this;

	//create Background
	background = this.add.image(300,200,'main-bg').setOrigin(0.5);


	var Skate = new Phaser.Class({
		Extends: Phaser.GameObjects.Sprite, 

		initialize:

		function Skate(scene, x, y, index){
			this.skate = scene.add.sprite(x,y, 'dinga-shoe-' + index).setOrigin(0);
			this.skate.setInteractive();
			this.value = index;
			this.isDropping = false;
			scene.input.setDraggable(this.skate);
			scene.input.topOnly = true; 
			scene.input.on('drag', function(pointer, gameObject, dragX, dragY){
				gameObject.x = dragX;
				gameObject.y = dragY;
			});
			scene.input.on('dragend', function(pointer, gameObject){
				gameObject.destroy(main);
			});
			this.skate.on('pointerdown', () => {
				selectedValue = this;
				var skate = new Skate(main, x, y, index);
			});
		}
	});

	var Client = new Phaser.Class({
		initialize:
		function Client(scene, x, y){
			this.scene = scene; 
			this.image = scene.add.image(x,y,'dinga-client').setOrigin(0);
			this.value = 0;
			this.image.on('pointerover', clientCheck);
		},

		clientCheck: function(){
			if (selectedValue.value == this.value){
				console.log("Point!!");
				selectedValue.destroy(main);
				selectedValue = null;
			}
		}

	});


	Skate(main, 18, 80, 1);
	Skate(main, 87, 80, 2);
	Skate(main, 156,80, 3);

	Skate(main, 386, 80, 4);
	Skate(main, 453, 80, 5);
	Skate(main, 522, 80, 6);

	Skate(main, 18, 182, 7);
	Skate(main, 87, 182, 8);
	Skate(main, 156,182, 9);

	client1 = new Client(26, 294);
	//skates = this.add.staticGroup(Skate);

	//creating Skate Buttons
	/*skates.add(new Skate(main, 18, 80, 1));
	skates.add(new Skate(main, 87, 80, 2));
	skates.add(new Skate(main, 156,80, 3));

	//column 2
	skates.add(new Skate(main, 386, 80, 4));
	skates.add(new Skate(main, 453, 80, 5));
	skates.add(new Skate(main, 522, 80, 6));

	//column 1 row 2
	skates.add(new Skate(main, 18, 182, 7));
	skates.add(new Skate(main, 87, 182, 8));
	skates.add(new Skate(main, 156,182, 9));

	//column 2 row 2
	skates.add(new Skate(main, 386, 182, 10));
	skates.add(new Skate(main, 453, 182, 11));
	skates.add(new Skate(main, 522, 182, 12));
		*/

}


function mainUpdate(){
	
}