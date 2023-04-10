import { Scene } from "phaser";

export default class homePage extends Scene {
  birdBlue;
  birdRed;
  birdSelect = null

  constructor() {
    super('homePage');
  }

  preload() {
    this.load.image('imgBackground', 'assets/backgroundColorGrass.png');
    this.load.image('imgBirdBlue', 'assets/bluebird-downflap.png');
    this.load.image('imgBirdRed', 'assets/redbird-downflap.png');
  }

  create() {
    this.add.image(240, 320, 'imgBackground').setScrollFactor(0);
    this.add.text(250, 50, 'Flappy Bird', { font: '64px Arial', fill: '#000000' }).setOrigin(0.5);
    this.add.text(250, 150, 'Selecione o passaro', { font: '40px Arial', fill: '#000000' }).setOrigin(0.5);
    this.birdBlue = this.physics.add.staticSprite(100, 240, 'imgBirdBlue');
    this.birdRed = this.physics.add.staticSprite(350, 240, 'imgBirdRed');
    
    this.birdBlue.setInteractive();
    this.birdRed.setInteractive();

    this.birdBlue.on('pointerdown', function() {
      //this.scene.start('fase', { bird: 'blue' });
      console.log('blue');
      this.birdSelect = 'blue';
    });

    this.birdRed.on('pointerdown', function() {
      //this.scene.start('fase', { bird: 'red' });
      console.log('red');      
      this.birdSelect = 'red';
    });
    

    var playButton = this.add.text(400, 500, 'Jogar', { font: '32px Arial', fill: '#000000' }).setOrigin(0.5, 0.5);
    playButton.setInteractive();
    playButton.on('pointerdown', function() {
      console.log('dd');
      this.scene.start('fase', { bird: this.birdSelect });
    }, this);
    
    
  }

  update(){
  }
}