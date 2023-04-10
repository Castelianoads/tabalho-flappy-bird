import { Math, Scene } from "phaser";

export default class Level extends Scene {
  pipesUp;
  pipesDown;
  pointsText;
  keySpace;
  points = 0
  bird;

  constructor() {
    super('fase');
  }

  init(data) {
    console.log('init', data);
    this.bird = data.bird;
  }

  preload() {
    this.load.image('imgBackground', 'assets/backgroundColorGrass.png');
    this.load.image('imgPipeUp', 'assets/pipe-green-top.png');
    this.load.image('imgPipeDown', 'assets/pipe-green-bottom.png');
    this.load.image('imgBirdBlue', 'assets/bluebird-downflap.png');
    this.load.image('imgBirdRed', 'assets/redbird-downflap.png');  
  }

  // CREATE
  create() {
    this.add.image(240, 320, 'imgBackground').setScrollFactor(0);
    if(this.bird === 'blue'){
      console.log('bluee')
      this.bird = this.physics.add.image(240, 120, 'imgBirdBlue').setScale(1).setGravityX(30)
      this.cameras.main.startFollow(this.bird);
    } else if (this.bird === 'red'){
      console.log('redd')
      this.bird = this.physics.add.image(240, 120, 'imgBirdRed').setScale(1).setGravityX(30)
      this.cameras.main.startFollow(this.bird);
    }
    //this.bird = this.physics.add.image(240, 120, 'imgBird').setScale(2.5).setGravityX(30)
    this.pipesUp = this.physics.add.staticGroup();
    this.pipesDown = this.physics.add.staticGroup();

    this.input.on('pointerdown', click, this);

    // 5 first pipe
    for (let i = 0; i < 5; i++) {
      const upX = 300 * i;
      const upY = Phaser.Math.Between(-200, 0);
      const pipeUp = this.pipesUp.create(upX, upY, 'imgPipeUp')
      pipeUp.body.updateFromGameObject();

      const downX = upX;
      const downY = upY + 500;
      const pipeDown = this.pipesDown.create(downX, downY, 'imgPipeDown')
      pipeDown.body.updateFromGameObject();
    }

    //this.cameras.main.startFollow(this.bird);

    const style = { color: '#000', fontSize: 24 };
    this.pointsText = this.add.text(240, 10, 'Pontos: ' + this.points, style);
    this.pointsText.setScrollFactor(0);
    this.pointsText.setOrigin(0.5, 0);

    this.timer = this.time.addEvent({
      delay: 1500,
      callback: addPipe,
      callbackScope: this,
      loop: true
    });
  }

  // UPDATE
  update(time, delta) {
    if (this.bird.y > 600 || this.bird.y < 0) {
      gameOver();
    }

    this.input.keyboard.once('keydown-SPACE', () => {
      this.bird.setVelocityY(-100);
    });

    // Colisão
    this.physics.overlap(this.bird, this.pipesUp, gameOver, null, this);
    this.physics.overlap(this.bird, this.pipesDown, gameOver, null, this);

    this.pipesUp.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right < 0) {
        pipe.destroy();
      }
    });

    this.pipesDown.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right < 0) {
        pipe.destroy();
        this.points += 1;
        this.pointsText.setText(`Pontos: ${this.points}`);
      }
    });



  }
}

function gameOver(){
  // ir para scenes GameOver
  console.log('gameover');
  this.physics.pause();

}

function click() {
  this.bird.setVelocityY(-100);
  console.log("click");
}

function addPipe(){
  const upX = 300 * 5;
  const upY = Phaser.Math.Between(-200, 0);
  const pipeUp = this.pipesUp.create(upX, upY, 'imgPipeUp');
  pipeUp.body.updateFromGameObject();

  const downX = upX;
  const downY = upY + 500;
  const pipeDown = this.pipesDown.create(downX, downY, 'imgPipeDown');
  pipeDown.body.updateFromGameObject();  
}