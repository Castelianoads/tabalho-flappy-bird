// Primeira.js
import { Scene } from "phaser";

export default class PrimeiraFase extends Scene {
    plataforma2;

    constructor() {
        // chamar o construtor da classe mãe
        // Passar o nome único desta cena
        super('primeiraFase');
    }

    // Carrega seus arquivos para uso (imagens, sons, etc)
    preload() {
        this.load.image('imgPlataforma', 'assets/ground_grass.png');
    }

    // Inicializa os objetos gráficos na tela
    create() {
        const plataforma = this.add.image(240, 320, 'imgPlataforma');
        plataforma.setScale(0.5);
        plataforma.x = 100;
        plataforma.y = 200;
        plataforma.angle = 20;

        this.plataforma2 = this.add.image(240, 320, 'imgPlataforma')
            .setScale(0.5)
            .setAngle(15);
    }

    // Chamado a cada atualização
    update(time, delta) {
        this.plataforma2.angle += 1;

        this.plataforma2.x -= 3;
        if ( this.plataforma2.x < 0 ) {
            this.plataforma2.x = 480;
        }
    }
}
