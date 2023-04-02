// GameOver.js
import { Scene } from "phaser";

export default class GameOver extends Scene {

    constructor() {
        super('sceneGame-over');
    }

    create() {
        let width = this.scale.width;
        let height = this.scale.height;
        console.log(width, height)

        this.add.text(width/2, height/2, 'GAME OVER', {
            fontSize: 48
        }).setOrigin(0.5);

        // Jogar de novo
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('level');
        });
    }
}