import { AUTO, Game } from 'phaser';
import GameOver from './src/scenes/GameOver';
import Fase from './src/scenes/Fase';
import HomePage from './src/scenes/HomePage'

const config = {
	width: 480,		
	height: 640,	
	type: AUTO,
	scene: [HomePage, Fase, GameOver],
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