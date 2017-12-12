'use strict';

import characterSelection from '../selection/characterSelection';
import * as playerHelpers from '../player/helpers';

let mainScreen = {
	create: (game) => {
		// TODO: create main screen using the layot
		let players = playerHelpers.getPlayers();
		let amountOfCardsToBeInitiallyDealt = playerHelpers.amountOfCardsToBeInitiallyDealt();
		for (let index = 0; index < amountOfCardsToBeInitiallyDealt; index += 1) {
			for (let jndex = 0; jndex < players.length; jndex += 1) {
				let player = players[jndex];
				
				player.receiveCards(1);
			}
		}

		console.log(players);
	},
	win: (game) => {
		game.state.start('win');
	},
	lose: (game) => {
		game.state.start('lose');
	}
};

export default mainScreen;