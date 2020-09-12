var mainSceneConfig = {
	key: 'main', 
	preload: preloadMain,
	create: mainCreate,
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

function preloadMain(){
	this.load.setBaseURL('https://raw.githubusercontent.com/chatterboxn18/chatterboxn18.github.io/master/')
	this.load.image('cabinet', 'andar-cabinet.png');
}

function mainCreate(){
	this.add.image(200,200, 'cabinet');
}
