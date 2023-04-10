import { Math, Scene } from "phaser";

export default class Level extends Scene {
  pipesUp;
  pipesDown;
  pointsText;
  keySpace;
  points = 0;
  bird;
  corBird;

  constructor() {
    super('fase');
  }

  init(data) {
    this.bird = data.bird;
    this.corBird = data.bird;
  }

  preload() {
    this.load.image('imgBackground', 'assets/backgroundColorGrass.png');

    this.load.image('imgPipeUp', 'assets/pipe-green-top.png');
    this.load.image('imgPipeDown', 'assets/pipe-green-bottom.png');

    this.load.image('imgBirdBlueUp', 'assets/bluebird-upflap.png');
    this.load.image('imgBirdBlueDown', 'assets/bluebird-downflap.png');

    this.load.image('imgBirdRedUp', 'assets/redbird-upflap.png');  
    this.load.image('imgBirdRedDown', 'assets/redbird-downflap.png');  
  }

  create() {
    this.add.image(240, 320, 'imgBackground').setScrollFactor(0);

    if(this.bird === 'Blue'){
      this.bird = this.physics.add.image(240, 120, 'imgBirdBlueDown').setScale(1).setAccelerationX(30)
      this.cameras.main.startFollow(this.bird);
    } else if (this.bird === 'Red'){
      this.bird = this.physics.add.image(240, 120, 'imgBirdRedDown').setScale(1).setAccelerationX(30)
      this.cameras.main.startFollow(this.bird);
    } 

    this.pipesUp = this.physics.add.staticGroup();
    this.pipesDown = this.physics.add.staticGroup();

    this.input.on('pointerdown', click, this);

    // 5 first pipe
    for (let i = 0; i < 5; i++) {
      const upX = 250 * i;
      const upY = Phaser.Math.Between(-200, 0);
      const pipeUp = this.pipesUp.create(upX, upY, 'imgPipeUp')
      pipeUp.body.updateFromGameObject();

      const downX = upX;
      const downY = upY + 500;
      const pipeDown = this.pipesDown.create(downX, downY, 'imgPipeDown')
      pipeDown.body.updateFromGameObject();
    }

    const style = { color: '#000', fontSize: 24 };
    this.pointsText = this.add.text(240, 10, 'Pontos: ' + this.points, style);
    this.pointsText.setScrollFactor(0);
    this.pointsText.setOrigin(0.5, 0);
  }

  update(time, delta) {
    // 
    if (this.bird.y > 600 || this.bird.y < 0) {
      gameOver();
    }

    // Verifica se o pássaro passou pelo cano e adiciona pontos
    this.pipesUp.getChildren().forEach((pipeUp) => {
    if (pipeUp.getBounds().right < this.bird.getBounds().left && !pipeUp.scored) {
      this.points += 1;
      this.pointsText.setText('Pontos: ' + this.points);
      pipeUp.scored = true;
    }
  });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.bird.setVelocityY(-150);
    });

    this.physics.overlap(this.bird, this.pipesUp, gameOver, null, this);
    this.physics.overlap(this.bird, this.pipesDown, gameOver, null, this);
    
    addPipe(this.pipesUp, this.pipesDown, this.cameras);

    // Texture ao subir e descer
    if (this.bird.body.velocity.y > 0) {
      this.bird.setTexture('imgBird' + this.corBird + 'Down');
    } else {
      this.bird.setTexture('imgBird' + this.corBird + 'Up');
    }

  }
}

function gameOver(){
  this.scene.start('gameOver', { points: this.points });      
}

function click() {
  this.bird.setVelocityY(-150);
}

function addPipe(up, down, camera){
  up.getChildren().forEach((pipeUp, i) => {
    if (pipeUp.getBounds().right < camera.main.worldView.left) {
      pipeUp.x += 250 * 5;
      pipeUp.y = Phaser.Math.Between(-200, 0);
      pipeUp.scored = false;
      pipeUp.body.updateFromGameObject();

      const pipeDown = down.getChildren()[i];
      pipeDown.x = pipeUp.x;
      pipeDown.y = pipeUp.y + 500;
      pipeDown.body.updateFromGameObject();
      }
  });
}