'use strict';

import { displayMainMenu } from '../render/mainMenu';

let menuState = {
	/**
	 * @function
	 * @name create
	 * @param { object } game - The game object.
	 * @description This is the place where the main menu is displayed and manipulated.
	 */
	create: (game) => {
		displayMainMenu(game);
	}
};

export default menuState;