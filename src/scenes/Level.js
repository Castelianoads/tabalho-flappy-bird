import { Math, Scene } from "phaser";
import Carrot from "../objects/Carrot";

export default class Level extends Scene {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  bird;

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  pipesUp;

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  pipesDown;
 
  /** @type {Phaser.GameObjects.Text} */
  pointsText;

  keySpace;
  points = 0

  constructor() {
    super('level');
  }

  preload() {
    this.load.image('imgBackground', 'assets/backgroundColorGrass.png');
    this.load.image('imgPipeUp', 'assets/pipeUp.png');
    this.load.image('imgPipeDown', 'assets/pipeDown.png');
    this.load.image('imgShip', 'assets/fmship.png');    
  }

  create() {
    this.add.image(240, 320, 'imgBackground').setScrollFactor(0);
    this.bird = this.physics.add.image(240, 120, 'imgShip').setAngle(90).setScale(1.5).setGravityX(60)
    this.pipesUp = this.physics.add.staticGroup();
    this.pipesDown = this.physics.add.staticGroup();

    this.input.on('pointerdown', click, this);
    
    for (let i = 0; i < 5; i++)
    {
      const upX = 150 * i;
      const upY = -100;

      const pipeUp = this.pipesUp.create(upX, upY, 'imgPipeUp')
      pipeUp.setScale(0.3);
      pipeUp.body.updateFromGameObject();

      const downX = upX;
      const downY = 400;
      const pipeDown = this.pipesDown.create(downX, downY, 'imgPipeDown')
      pipeDown.setScale(0.3);
      pipeDown.body.updateFromGameObject();
    }

    this.cameras.main.startFollow(this.bird);

    // Texto de Pontuação
    const style = { color: '#000', fontSize: 24 };
    this.pointsText = this.add.text(240, 10, 'Cenouras: 0', style);
    this.pointsText.setScrollFactor(0);
    this.pointsText.setOrigin(0.5, 0);

    //let rect = this.add.rectangle(240, 300, 100, 50, 0xffcc00);
  }

  update(time, delta) {
    if (this.bird.y > 600 || this.bird.y < 0) {
      gameOver();
    }

    this.physics.overlap(this.bird, this.pipesUp, gameOver, null, this);
    this.physics.overlap(this.bird, this.pipesDown, gameOver, null, this);
    this.pipesUp.passed = false;
    this.pipesDown.passed = false;
    

  }

 


}

function gameOver(){
  console.log('gameover');
}
function moreu(){
  console.log('moreu');
}
function click() {
  this.bird.setVelocityY(-100);
  console.log("click");
}

// function  addPipe() {
//   var pipeTop = this.physics.add.sprite(800, Math.random() * 400 + 100, 'imgPipeUp');
//   var pipeBottom = this.physics.add.sprite(800, pipeTop.y + 600, 'imgPipeDown');
//   this.pipes.add(pipeTop);
//   this.pipes.add(pipeBottom);
//   pipeTop.setVelocityX(-200);
//   pipeBottom.setVelocityX(-200);
// } 