'use strict';

import characterSelection from '../selection/characterSelection';
import * as playerSlots from '../render/playerSlots';

let playerSelectionState = {
	/**
	 * @function
	 * @name create
	 * @param { object } game - The game object.
	 * @description This is the place where the users select the number of players and choose their characters.
	 */
	create: (game) => {
    	playerSlots.create(game);
    	characterSelection(game);
	}
};

export default playerSelectionState;