// Level.js
import { Math, Scene } from "phaser";
import Carrot from "../objects/Carrot";

export default class Level extends Scene {
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Group} */
  carrots;

  points = 0;
  /** @type {Phaser.GameObjects.Text} */
  pointsText;

  constructor() {
      super('level');
  }

  preload() {
    this.load.image('imgBackground', 'assets/bg_layer1.png');
    this.load.image('imgPlatform', 'assets/ground_grass.png');
    this.load.image('imgBunny-stand', 'assets/bunny1_stand.png'); // Coelho parado
    this.load.image('imgBunny-jump', 'assets/bunny1_jump.png'); // Coelho pulando
    this.load.image('imgCarrot', 'assets/carrot.png'); // Cenoura

    this.load.audio('audioJump', 'assets/sfx/jump.ogg'); // Quando pula
    this.load.audio('audioGameover', 'assets/sfx/gameover.ogg'); 
    this.load.audio('audioEat', 'assets/sfx/eat.ogg');
  }

  create() {
    // Background
    this.add.image(240, 320, 'imgBackground')
      .setScrollFactor(0, 0);

    // Plataforma
    //const platform = this.physics.add.staticImage(240, 320, 'platform')
    //    .setScale(0.5);

    // Grupo de plataformas
    this.platforms = this.physics.add.staticGroup();

    // Criando as plataforma 
    for (let i = 0; i < 5; i++) {
      const x = Math.Between(80, 400); // Largura entre 80 a 400
      const y = 150 * i; // Altura 
      const platform = this.platforms.create(x, y, 'imgPlatform'); // Cria a plataforma nos x, y 
      platform.setScale(0.5);
      platform.body.updateFromGameObject(); // Atualiza a posição, largura, altura e centro do Corpo a partir do seu Objecto de Jogo e offset.
    }

    // Criando o Player
    this.player = this.physics.add.image(240, 120, 'imgBunny-stand') // Add a img do coelho no chão
      .setScale(0.5);
        
    // Faz os elementos colidirem
    this.physics.add.collider(this.player, this.platforms);

    // Disabilitar a colisão do coelho nas laterais e em cima
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;
    this.player.body.checkCollision.up = false;

    // Câmera - Ela fica focado no player
    this.cameras.main.startFollow(this.player);

    // Definir uma dead zone para a Câmera
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    // Cursores
    this.cursors = this.input.keyboard.createCursorKeys();


    // Cenouras
    this.carrots = this.physics.add.group({
        classType: Carrot
    });

    this.physics.add.collider(this.carrots, this.platforms);

    this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this);

    // Texto de Pontuação
    const style = { color: '#000', fontSize: 24 };
    this.pointsText = this.add.text(240, 10, 'Cenouras: 0', style);
    this.pointsText.setScrollFactor(0);
    this.pointsText.setOrigin(0.5, 0);

    let rect = this.add.rectangle(240, 300, 100, 50, 0xffcc00);
  }

  update(time, delta) {
    // Pulando
    /**Quando colide na parte de baixo */
    const touchingGround = this.player.body.touching.down;
        
    if ( touchingGround ) {
      this.player.setVelocityY(-300);
      this.sound.play('audioJump');

      // Mudar a imagem do coelho ao pular
      this.player.setTexture('imgBunny-jump'); // Coelho no ar
    }

    let velocityY = this.player.body.velocity.y;
    if ( velocityY > 0 ) {
      this.player.setTexture('imgBunny-stand'); // Coelho no chão
    }

    // Reusando as plataformas
    this.platforms.children.iterate(child => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      // Pegar a posição Y da Câmera
      const scrollY = this.cameras.main.scrollY;
      if ( platform.y >= scrollY + 700 ) {
        platform.x = Math.Between(80, 400);
        platform.y = scrollY - Math.Between(0, 10);
        platform.body.updateFromGameObject();

          // criar uma cenoura acima
        this.addCarrotAbove(platform);
      }
    })


    // Cursores Direita e Esquerda
    if ( this.cursors.left.isDown ) {
      this.player.setVelocityX(-200);
    } else if ( this.cursors.right.isDown ) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    // Testando se o coelho caiu
    let bottomPlatform = this.findBottomPlatform();
    if ( this.player.y > bottomPlatform.y + 200 ) {
      // Ir para outra CENA
      this.sound.play('audioGameover');
      this.scene.start('sceneGame-over');
    }
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
    let platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];
    for (let i = 1; i < platforms.length; i++) {
      let platform = platforms[i];

      if ( platform.y < bottomPlatform.y ) {
        continue;
      }

      bottomPlatform = platform;
    }

    return bottomPlatform;
  }
}