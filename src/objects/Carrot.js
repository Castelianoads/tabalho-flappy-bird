// src/objects/Carrot.js
import Phaser from 'phaser';

// Cenoura
export default class Carrot extends Phaser.Physics.Arcade.Sprite {

    // cena, x, y, textura/imagem
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.setScale(0.5);
    }
}