import { Scene } from "phaser";

export default class GameOver extends Scene
{
  constructor(){
    super('game-over');
  }

  init(data) {
    this.points = data.points;
  }

  preload() {
    this.load.image('imgBackground', 'assets/backgroundColorGrass.png');
    this.load.image('imgGameOver', 'assets/gameover.png');
  }

  create() {
    let width = this.scale.width
    let height = this.scale.height
    this.add.image(240, 320, 'imgBackground').setScrollFactor(0);
    this.birdBlue = this.physics.add.staticSprite(width / 2, height / 2, 'imgGameOver');

    this.add.text(width/2, height/2,'Pontos: '+this.points,{
      fontSize:30
    }).setOrigin(0.5);
      

    this.add.text(250, 150, 'Pressione SPACE para jogar novamente', { font: '40px Arial', fill: '#000000' }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE',()=>{
      this.scene.start('homePage')
    });
  }

    

}