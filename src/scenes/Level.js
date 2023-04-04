// Level.js
import { Math, Scene } from "phaser";
import Carrot from "../objects/Carrot";

export default class Level extends Scene {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  pipesUp;
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  pipesDown;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  carrots;

  /** @type {Phaser.GameObjects.Text} */
  pointsText;

  keySpace;
  points = 0

  constructor() {
      super('level');
  }

  preload() {
    this.load.image('imgBackground', 'assets/backgroundColorGrass.png');
    this.load.image('imgPipeBig', 'assets/pipe3.png');
    this.load.image('imgPipeSmall', 'assets/pipe2.png');
    this.load.image('imgShip', 'assets/fmship.png'); // Coelho parado
    
  }

  create() {
    // Criando Background
    this.add.image(240, 320, 'imgBackground')
      .setScrollFactor(0);

    // Criando o Player
    this.player = this.physics.add.image(240, 120, 'imgShip') // Add a img do coelho no chão
    .setAngle(90)
    .setScale(1.5)

    // Grupo de canos
    this.pipesUp = this.physics.add.staticGroup();
    
    // Criando os canos 
    for (let i = 0; i < 5; i++) {
      const x = 160 * i; // Largura entre 80 a 400
      const y = -100; // Altura 
      const platform = this.pipesUp.create(x, y, 'imgPipeBig'); // Cria a plataforma nos x, y 
      const platformDown = this.pipesUp.create(x, 350, 'imgPipeBig'); // Cria a plataforma nos x, y 
      platform.setScale(0.3);
      platformDown.setScale(0.3);
      platform.setAngle(180);
      platform.body.updateFromGameObject(); // Atualiza a posição, largura, altura e centro do Corpo a partir do seu Objecto de Jogo e offset.
      platformDown.body.updateFromGameObject(); // Atualiza a posição, largura, altura e centro do Corpo a partir do seu Objecto de Jogo e offset.
    }
      
    // Faz os elementos colidirem
    //this.physics.add.collider(this.player, this.pipesUp);

    //this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this);

    // Disabilitar a colisão do coelho nas laterais e em cima
    //this.player.body.checkCollision.left = false;

    // Câmera - Ela fica focado no player
    this.cameras.main.startFollow(this.player);
    //this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Definir uma dead zone para a Câmera
    this.cameras.main.setDeadzone(this.scale.width - 400);
    //this.cameras.main.setZoom(4);

    // Cursores
    this.cursors = this.input.keyboard.createCursorKeys();


    // Cenouras
    this.carrots = this.physics.add.group({
        classType: Carrot
    });



    // Texto de Pontuação
    const style = { color: '#000', fontSize: 24 };
    this.pointsText = this.add.text(240, 10, 'Cenouras: 0', style);
    this.pointsText.setScrollFactor(0);
    this.pointsText.setOrigin(0.5, 0);

    //let rect = this.add.rectangle(240, 300, 100, 50, 0xffcc00);
  }

  update(time, delta) {
    this.player.setVelocityX(200);
    this.player.setVelocityY(0);
     // Reusando as plataformas
    this.pipesUp.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      //Pegar a posição Y da Câmera
      const scrollx = this.cameras.main.scrollY;
      if ( platform.y >= scrollx + 480 ) {
        console.log('fffffff');
        const x = 160; // Largura entre 80 a 400
        const y = -100; // Altura 
        const platform = this.pipesUp.create(x, y, 'imgPipeBig'); // Cria a plataforma nos x, y 
        platform.setScale(0.3);
        platform.body.updateFromGameObject(); // Atualiza a posição, largura, altura e centro do Corpo a partir do seu Objecto de Jogo e offset.
    

        platform.x = 200;
        platform.y = scrollx - Math.Between(0, 10);
        platform.body.updateFromGameObject();

        //       // criar uma cenoura acima
        //     this.addCarrotAbove(platform);
      }
    })


    // // Cursores Direita e Esquerda
    // if ( this.cursors.left.isDown ) {
    //   this.player.setVelocityX(-200);
    // } else if ( this.cursors.right.isDown ) {
    //   this.player.setVelocityX(200);
    // } else {
    //   this.player.setVelocityX(0);
    // }

    // // Testando se o coelho caiu
    // let bottomPlatform = this.findBottomPlatform();
    // if ( this.player.y > bottomPlatform.y + 200 ) {
    //   // Ir para outra CENA
    //   this.sound.play('audioGameover');
    //   this.scene.start('sceneGame-over');
    // }
  }


/////////////////////// FUNÇÔES
  /**Adiciona a cenoura acima 
   * 
   * @param platform A plataforma.
  */
  addCarrotAbove(platform) {
    const y = platform.y - platform.displayHeight;
    const carrot = this.carrots.get(platform.x, y, 'imgCarrot');

    carrot.setActive(true);
    carrot.setVisible(true);

    this.add.existing(carrot)

    carrot.body.setSize(carrot.width, carrot.height);
    this.physics.world.enable(carrot);
  }

  /**
   * Quando coleta as cenouras
   * 
   * @param player Plataforma
   * @param carrot Cenoura
   */
  handleCollectCarrot(player, carrot) {
    this.carrots.killAndHide(carrot);
        
    this.physics.world.disableBody(carrot.body);

    this.points++;
    this.pointsText.text = 'Cenouras: ' + this.points;

    this.sound.play('audioEat');
  }

  /**
   * Procura a plataforma mais baixa.
   * @returns Plataforma mais baixa.
   */
  findBottomPlatform() {
    let pipesUp = this.pipesUp.getChildren();
    let bottomPlatform = pipesUp[0];
    for (let i = 1; i < pipesUp.length; i++) {
      let platform = pipesUp[i];

      if ( platform.y < bottomPlatform.y ) {
        continue;
      }

      bottomPlatform = platform;
    }

    return bottomPlatform;
  }
}