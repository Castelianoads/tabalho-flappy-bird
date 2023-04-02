import { AUTO, Game } from 'phaser';
import GameOver from './src/scenes/GameOver';
import Level from './src/scenes/Level';
//import PrimeiraFase from './src/scenes/PrimeiraFase';

const config = {
	width: 480,		// largura
	height: 640,	// altura
	type: AUTO,
	scene: [Level, GameOver],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 200
			},
			debug: true
		}
	}
}

new Game(config);