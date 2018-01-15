'use strict';

import Player from './Player';
import * as playerValidator from '../validators/playerValidator';
import * as playerConstants from '../constants/player';
import { updateDeckCounter } from '../render/actionDeck';


let players = [];
let selectedPlayer;

/**
 * @function
 * @name addPlayer
 * @param { object } characterCard - The character card that the player has chosen.
 * @return { object } The player.
 * @description Create a new instance of the class Player.
 */
function addPlayer (characterCard) {
	let player = new Player(characterCard);
	playerValidator.validateDuplicatingPlayerInstances(players, player, characterCard);

	players.push(player);

	return player;
}

/**
 * @function
 * @name getPlayers
 * @return { array } The list of all the players.
 */
function getPlayers () {
	let immutableList = Object.assign([], players);

	return immutableList;
}

/**
 * @function
 * @name getPlayer
 * @param { number } id - The id of the player.
 * @return { object } The player.
 */
function getPlayer (id) {
	let player = players.filter(p => p.id === id)[0];

	return player;
}

/**
 * @function
 * @name amountOfCardsToBeInitiallyDealt
 * @return { number } The amount of cards that all the players need to have when the game starts.
 */
function amountOfCardsToBeInitiallyDealt () {
	if (players.length === 3) {
		return playerConstants.maxAmountOfCardsInitial;
	} else if (players.length > 3) {
		return playerConstants.minAmountOfCardsInitial;
	}
}

/**
 * @function
 * @name updateSelectedPlayer
 * @description Update the selected player.
 */
function updateSelectedPlayer (id) {
	for (let index = 0; index < players.length; index += 1) {
		let currentPlayer = players[index];

		if (currentPlayer.id === id) {
			currentPlayer.isSelected = true;

			selectedPlayer = currentPlayer;
		} else {
			currentPlayer.isSelected = false;
		}
	}
}

/**
 * @function
 * @name getSelectedPlayer
 * @return { object } The selected player.
 * @description Receive the selected player.
 */
function getSelectedPlayer () {
	return selectedPlayer;
}

/**
 * @function
 * @name getSidePlayers
 * @return { array } The side players.
 * @description Receive the side players.
 */
function getSidePlayers () {
	let sidePlayers = [];
	for (let index in players) {
		let currentPlayer = players[index];
		if (!currentPlayer.isSelected) {
			sidePlayers.push(currentPlayer);
		}
	}

	return sidePlayers;
}

/**
 * @function
 * @name playersReceiveCardsAfterChallenge
 * @description Player should receive a card after passing/failing a challenge.
 */
function playersReceiveCardsAfterChallenge () {
	for (let index = 0; index < players.length; index += 1) {
		let currentPlayer = players[index];

		currentPlayer.receiveCards(1);
		updateDeckCounter();
	}
}

export {
	addPlayer,
	getPlayers,
	getPlayer,
	amountOfCardsToBeInitiallyDealt,
	updateSelectedPlayer,
	getSelectedPlayer,
	getSidePlayers,
	playersReceiveCardsAfterChallenge
}