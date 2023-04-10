import { Scene } from "phaser";

export default class GameOver extends Scene
{
  constructor(){
    super('gameOver');
  }

  init(data) {
    this.points = data.points;
  }

  preload() {
    this.load.image('imgBackground', 'assets/backgroundColorGrass.png');
    this.load.image('imgGameOver', 'assets/gameover.png');
  }

  create() {
    this.add.image(240, 320, 'imgBackground').setScrollFactor(0);
    this.img = this.physics.add.staticSprite(250, 150, 'imgGameOver');

    this.add.text(240, 320, 'Pontos: '+this.points, { font: '40px Arial', fill: '#000000' }).setOrigin(0.5);
    this.add.text(250, 550, 'Pressione SPACE para jogar novamente', { font: '20px Arial', fill: '#000000' }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE',()=>{
      this.scene.start('homePage')
    });
  }
}