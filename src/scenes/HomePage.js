import { Scene } from "phaser";
var birdSelect = '';
export default class homePage extends Scene {
  birdBlue;
  birdRed;  

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
    this.add.text(250, 150, 'Selecione um passaro', { font: '40px Arial', fill: '#000000' }).setOrigin(0.5);

    this.birdBlue = this.physics.add.staticSprite(100, 240, 'imgBirdBlue');
    this.birdRed = this.physics.add.staticSprite(350, 240, 'imgBirdRed');
    
    this.birdBlue.setInteractive();
    this.birdRed.setInteractive();
    selectBird(this.birdBlue, this.birdRed);
    
    this.add.text(15, 550, 'SPACE ou click direito', { font: '20px Arial', fill: '#000000' })
    this.add.text(15, 575, 'para mover o passaro', { font: '20px Arial', fill: '#000000' })

    var playButton = this.add.text(400, 580, 'Jogar', { font: '32px Arial', fill: '#000000' }).setOrigin(0.5, 0.5);
    playButton.setInteractive();
    playButton.on('pointerdown', () => {
      this.scene.start('fase', { bird: birdSelect });
    }, this);
        
  }
}

function selectBird(birdBlue, birdRed){
  birdBlue.on('pointerdown', () => {
    birdSelect = 'blue';
  });

  birdRed.on('pointerdown', () => {
    birdSelect = 'red';
  });
}