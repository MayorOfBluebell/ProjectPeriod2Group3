'use strict';

import { dealDeck } from '../decks/challengeDeck';
import * as challengeCardConstants from '../constants/challengeCards';
import { isSuitableForChallenge } from '../validators/actionCardValidator';
import { updatePointsLeft, updateChallenge, endGame } from '../render/challenges';
import { updateSelectedPlayerCards } from '../render/players';
import { playersReceiveCardsAfterChallenge, getSelectedPlayer, updateSelectedPlayer, getPlayer } from '../player/helpers';
import { updateProgressBar } from '../render/progressBar';

let currentChallenge;
let currentStage = challengeCardConstants.stages.early;
let challengesList = [];
let placedActionCards = [];
let remainingPoints = 0;

/**
 * @function
 * @name placeActionCard
 * @param { object } actionCard - The action card.
 * @description Place action card on user interaction.
 */
function placeActionCard (actionCard) {
	let hasAlreadyBeenPlaced = checkForDuplication(actionCard);
	if (hasAlreadyBeenPlaced) {
		return false;
	}

	let hasReturnedSuitableTrait = isSuitableForChallenge(actionCard, currentChallenge);
	if (hasReturnedSuitableTrait !== false) {
		placedActionCards.push(actionCard);
		calculatePoints(hasReturnedSuitableTrait);

		return true;
	} else {
		return false;
	}
}

/**
 * @function
 * @name calculatePoints
 * @param { object } trait - The trait of the action card.
 * @description Calculate the points when placing an action card.
 */
function calculatePoints (trait) {
	let player = getSelectedPlayer();
	let playerTraits = player.traits;
	let bonusPoints = 0;

	for (let index = 0; index < playerTraits.length; index++){
		let currentPlayerTrait = playerTraits[index];
		if (currentPlayerTrait.name === trait.name) {
			bonusPoints = currentPlayerTrait.value;

			break;
		}
	}

	let finalPoints = trait.value + bonusPoints;
	if (finalPoints > 0) {
		if (remainingPoints - finalPoints <= 0) {
			challengePassed();
		} else {
			remainingPoints -= finalPoints;
		}
	}

	updatePointsLeft(remainingPoints);
}

/**
 * @function
 * @name challengePassed
 * @description Update everything after challenge is passed.
 */
function challengePassed () {
	currentChallenge.passed = true;
	challengesList.push(currentChallenge);

	changeStage();
	dealChallenge();
	updateChallenge();
	playersReceiveCardsAfterChallenge();
	updateProgressBar();
}

/**
 * @function
 * @name dealChallenge
 * @return { object } The random challenge card.
 * @description Deal a random challenge card.
 */
function dealChallenge () {
	let challenge = dealDeck(currentStage);

	currentChallenge = challenge;
	currentStage = challenge.stage;
	remainingPoints = challenge.traits[0].value;

	return challenge;
}

/**
 * @function
 * @name changeStage
 * @description Change the stage.
 */
function changeStage () {
	let counter = challengesList.length;

	switch (counter / challengeCardConstants.roundsPerStage) {
		case 0:
			currentStage = challengeCardConstants.stages.early;
			break;
		case 1:
			currentStage = challengeCardConstants.stages.mid;
			break;
		case 2:
			currentStage = challengeCardConstants.stages.late;
			break;
		case 3:
			endGame();
			break;
	}

	placedActionCards = [];
}

/**
 * @function
 * @name checkForDuplication
 * @param { object } actionCard - The action card.
 * @return { boolean } The result from the check.
 * @description Check if the player has already placed this acction card.
 */
function checkForDuplication (actionCard) {
	for (let index = 0; index < placedActionCards.length; index += 1) {
		let currentCard = placedActionCards[index];
		if (currentCard.id === actionCard.id) {
			return true;
		}
	}

	return false;
}

/**
 * @function
 * @name surrender
 * @description Set the card's passed property to false and update back end and UI
 */
function surrender () {
	currentChallenge.passed = false;
	challengesList.push(currentChallenge);

	playersReceiveCardsBackAfterSurrender();
	changeStage();
	dealChallenge();
	updateChallenge();
	playersReceiveCardsAfterChallenge();
	updateSelectedPlayerCards();
	updateProgressBar();
}

/**
 * @function
 * @name playersReceiveCardsBackAfterSurrender
 * @description Give all the players who have placed their cards back.
 */
function playersReceiveCardsBackAfterSurrender () {
	for (let index = 0; index < placedActionCards.length; index += 1) {
		let currentCard = placedActionCards[index];
		let playerWhoPlacedTheCard = getPlayer(currentCard.playerId);
		let selectedPlayer = getSelectedPlayer();

		playerWhoPlacedTheCard.cardsInHand.push(currentCard);
		if (playerWhoPlacedTheCard.id === selectedPlayer.id) {
			updateSelectedPlayerCards();
		}
	}
}

function getHowManyChallengesHavePassed () {
	return challengesList.length;
}

function getChallengesList () {
	return challengesList;
}

export {
	challengesList,
	placeActionCard,
	calculatePoints,
	dealChallenge,
	currentChallenge,
	currentStage,
	surrender,
	getHowManyChallengesHavePassed,
	getChallengesList
}